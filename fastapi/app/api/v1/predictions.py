import asyncio
import math
from typing import Any, Dict, List, Optional

import pandas as pd
from bson.objectid import ObjectId
from prophet import Prophet
from fastapi import APIRouter, HTTPException, Request, UploadFile, File

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok"}

# predict for a single product if `symbol` provided, otherwise predict for all products
@router.get("/predict")
async def predict(symbol: Optional[str] = None, window: int = 30, request: Request = None):
    db = request.app.state.db

    names = await db.list_collection_names()
    if "orders" not in names:
        raise HTTPException(status_code=500, detail="orders collection not found in DB")
    orders_col = db["orders"]

    # build query: empty => all orders, otherwise filter by product id or name in orderItems
    q: Dict[str, Any] = {}
    if symbol:
        q = {"$or": [{"orderItems.product": symbol}, {"orderItems.name": symbol}]}

    orders = await orders_col.find(q).to_list(length=20000)
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for query")

    # products collection to check current stock (optional)
    prod_col = db["products"] if "products" in names else None

    # aggregate daily qty per product across orders
    per_product: Dict[str, Dict[str, float]] = {}
    for ord_doc in orders:
        date_val = ord_doc.get("createdAt") or ord_doc.get("created_at") or ord_doc.get("date") or ord_doc.get("timestamp")
        if not date_val and ord_doc.get("_id"):
            try:
                date_val = ord_doc["_id"].generation_time
            except Exception:
                date_val = None
        try:
            ds = pd.to_datetime(date_val).strftime("%Y-%m-%d")
        except Exception:
            ds = None

        for item in ord_doc.get("orderItems", []):
            prod_key = None
            if item.get("product"):
                prod_key = str(item.get("product"))
            elif item.get("name"):
                prod_key = str(item.get("name"))
            else:
                continue
            qty = item.get("qty") or item.get("quantity") or item.get("count") or 0
            try:
                qty = float(qty)
            except Exception:
                qty = 0.0

            if not ds:
                continue

            prod_map = per_product.setdefault(prod_key, {})
            prod_map[ds] = prod_map.get(ds, 0.0) + qty

    if not per_product:
        raise HTTPException(status_code=404, detail="No product sales data extracted from orders")

    SAFE_BUFFER = 0.2  # 20% safety buffer

    results: List[Dict[str, Any]] = []

    # helper predictor functions (local)
    def _find_date_field(doc: Dict[str, Any]) -> str:
        for k in ("date", "ds", "timestamp", "time", "createdAt", "created_at"):
            if k in doc:
                return k
        for k, v in doc.items():
            if isinstance(v, str) and "-" in v and len(v) >= 8:
                return k
        raise ValueError("No date-like field found in documents")

    def _find_qty_field(doc: Dict[str, Any]) -> str:
        for k in ("y", "qty", "quantity", "count", "value"):
            if k in doc:
                return k
        for k, v in doc.items():
            if isinstance(v, (int, float)):
                return k
        raise ValueError("No numeric qty-like field found in documents")

    def predict_with_prophet(docs: List[Dict[str, Any]], periods: int = 30) -> List[Dict[str, Any]]:
        if not docs:
            raise ValueError("No historical documents supplied")
        df = pd.DataFrame(docs)
        if "ds" in df.columns and "y" in df.columns:
            df["ds"] = pd.to_datetime(df["ds"])
            df["y"] = pd.to_numeric(df["y"], errors="coerce")
            df = df.dropna(subset=["ds", "y"]).sort_values("ds")
        else:
            sample = docs[0]
            date_field = _find_date_field(sample)
            qty_field = _find_qty_field(sample)
            df = df[[date_field, qty_field]].rename(columns={date_field: "ds", qty_field: "y"})
            df["ds"] = pd.to_datetime(df["ds"])
            df["y"] = pd.to_numeric(df["y"], errors="coerce")
            df = df.dropna(subset=["ds", "y"]).sort_values("ds")

        if df.shape[0] < 3:
            raise ValueError("Not enough historical points for Prophet (need >=3)")

        m = Prophet()
        m.fit(df)

        future = m.make_future_dataframe(periods=periods, freq="D")
        forecast = m.predict(future)

        preds = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
        out = []
        for _, row in preds.iterrows():
            out.append({
                "ds": row["ds"].strftime("%Y-%m-%d"),
                "yhat": float(row["yhat"]),
                "yhat_lower": float(row["yhat_lower"]),
                "yhat_upper": float(row["yhat_upper"]),
            })
        return out

    # iterate products; if symbol provided, only that product will be present in per_product
    for product, date_qty_map in per_product.items():
        docs = [{"ds": d, "y": v} for d, v in sorted(date_qty_map.items())]
        try:
            preds: List[Dict[str, Any]] = await asyncio.to_thread(predict_with_prophet, docs, window)
        except ValueError:
            # insufficient data, skip
            continue
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error for {product}: {e}")

        # sum predicted yhat over forecast window
        predicted_sales = sum(p["yhat"] for p in preds)
        # ensure predicted sales is not negative
        predicted_sales = max(0.0, float(predicted_sales))

        # find current stock and product name if possible
        current_stock = 0
        product_name = product  # default to the product key (may already be a name)
        if prod_col is not None:
            prod_doc = None
            # try by ObjectId
            try:
                if ObjectId.is_valid(product):
                    prod_doc = await prod_col.find_one({"_id": ObjectId(product)})
            except Exception:
                prod_doc = None
            if prod_doc is None:
                prod_doc = await prod_col.find_one({"name": product})
            if prod_doc is not None:
                # set readable product name from product doc
                product_name = prod_doc.get("name") or product_name
                raw_stock = prod_doc.get("countInStock") or prod_doc.get("stock") or prod_doc.get("quantity") or 0
                try:
                    current_stock = int(float(raw_stock))
                except Exception:
                    current_stock = 0
                # ensure non-negative
                current_stock = max(0, current_stock)

        # apply safety buffer: order enough to cover predicted_sales * (1 + SAFE_BUFFER) minus current stock
        target_inventory = math.ceil(predicted_sales * (1.0 + SAFE_BUFFER))
        # ensure recommended_stock is not negative
        recommended_stock = max(0, target_inventory - current_stock)

        results.append({
            "Product": product,                 # product key (id or name)
            "Product_Name": product_name,       # human-readable name
            "Predicted_Sales": float(round(predicted_sales, 2)),
            "recommended_stock": int(recommended_stock)
        })

    if not results:
        raise HTTPException(status_code=400, detail="No prediction results (insufficient data)")

    return {"results": results}

# new endpoint: accept CSV upload and run same Prophet predictor
@router.post("/predict/csv")
async def predict_from_csv(
    file: UploadFile = File(...),
    window: int = 30,
    current_stock: int = 0,
):
    if file.content_type not in ("text/csv", "application/csv", "text/plain", "application/vnd.ms-excel"):
        raise HTTPException(status_code=400, detail="Unsupported file type; please upload a CSV")

    content = await file.read()
    try:
        import io

        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV contains no rows")

    # detect columns for date (ds) and quantity (y)
    cols_lower = {c: c.lower() for c in df.columns}
    date_col = None
    qty_col = None

    for c, low in cols_lower.items():
        if low in ("ds", "date", "timestamp", "time", "createdat", "created_at"):
            date_col = c
            break
    for c, low in cols_lower.items():
        if low in ("y", "qty", "quantity", "count", "sales", "value"):
            qty_col = c
            break

    # fallback heuristics
    if date_col is None:
        date_col = df.columns[0]
    if qty_col is None:
        # prefer a numeric column different from date_col
        numeric_cols = [c for c in df.columns if c != date_col and pd.api.types.is_numeric_dtype(df[c])]
        qty_col = numeric_cols[0] if numeric_cols else (df.columns[1] if len(df.columns) > 1 else df.columns[0])

    try:
        docs = df[[date_col, qty_col]].rename(columns={date_col: "ds", qty_col: "y"}).to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to normalize CSV columns: {e}")

    # run predictor in background thread
    try:
        preds: List[Dict[str, Any]] = await asyncio.to_thread(predict_with_prophet, docs, window)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    predicted_sales = max(0.0, float(sum(p["yhat"] for p in preds)))
    # ensure current_stock non-negative
    current_stock = max(0, int(current_stock))
    target_inventory = math.ceil(predicted_sales * (1.0 + SAFE_BUFFER))
    recommended_stock = max(0, target_inventory - current_stock)

    return {
        "predictions": preds,
        "Predicted_Sales": float(round(predicted_sales, 2)),
        "current_stock": int(current_stock),
        "recommended_stock": int(recommended_stock),
    }