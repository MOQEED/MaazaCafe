from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CashEntryCreate(BaseModel):
    item: str
    price: float
    qty: int

class CashEntryUpdate(BaseModel):
    item: Optional[str] = None
    price: Optional[float] = None
    qty: Optional[int] = None

class CashEntryOut(BaseModel):
    id: str
    item: str
    price: float
    qty: int
    total: float
    date: str
    created_at: datetime