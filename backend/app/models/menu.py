from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MenuItem(BaseModel):
    name: str
    price: float
    image: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None