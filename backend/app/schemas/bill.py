from pydantic import BaseModel
from typing import List
from datetime import datetime
from .menu import MenuItemOut

class BillItem(BaseModel):
    name: str
    price: float
    qty: int

class BillCreate(BaseModel):
    items: List[BillItem]
    total: float

class BillOut(BaseModel):
    id: str
    bill_no: int
    items: List[BillItem]
    total: float
    date: datetime
    created_at: datetime