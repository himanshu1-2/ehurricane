# ...new file...
from pydantic import BaseModel

class PredictRequest(BaseModel):
    symbol: str
    window: int = 30