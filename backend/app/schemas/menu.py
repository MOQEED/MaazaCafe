from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MenuItemCreate(BaseModel):
    name: str
    price: float
    image: Optional[str] = None

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None

class MenuItemOut(BaseModel):
    id: str
    name: str
    price: float
    image: Optional[str] = None
    created_at: datetime
    updated_at: datetime