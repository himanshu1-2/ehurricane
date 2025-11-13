# ...new file...
from fastapi import FastAPI
from app.db import connect_to_mongo, close_mongo_connection
from app.api.v1 import predictions

app = FastAPI(title="Stock Predictor API")

app.include_router(predictions.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection(app)