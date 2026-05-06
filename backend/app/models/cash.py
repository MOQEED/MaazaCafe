from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CashEntry(BaseModel):
    item: str
    price: float
    qty: int
    total: float
    date: Optional[str] = None  # Date as string like "DD/MM/YYYY"
    created_at: Optional[datetime] = None