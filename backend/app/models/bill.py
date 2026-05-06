from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BillItem(BaseModel):
    name: str
    price: float
    qty: int

class Bill(BaseModel):
    bill_no: int
    items: List[BillItem]
    total: float
    date: Optional[datetime] = None
    created_at: Optional[datetime] = None