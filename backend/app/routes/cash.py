from fastapi import APIRouter, HTTPException, Depends
from app.database import get_database
from app.schemas.cash import CashEntryCreate, CashEntryUpdate, CashEntryOut
from app.routes.auth import get_current_user
from app.schemas.user import UserOut
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=CashEntryOut)
async def create_cash_entry(entry: CashEntryCreate, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    entry_doc = {
        "item": entry.item,
        "price": entry.price,
        "qty": entry.qty,
        "total": entry.price * entry.qty,
        "date": datetime.utcnow().strftime("%d/%m/%Y"),
        "created_at": datetime.utcnow()
    }
    
    result = await db.cash_entries.insert_one(entry_doc)
    entry_doc["_id"] = result.inserted_id
    
    return CashEntryOut(
        id=str(entry_doc["_id"]),
        item=entry_doc["item"],
        price=entry_doc["price"],
        qty=entry_doc["qty"],
        total=entry_doc["total"],
        date=entry_doc["date"],
        created_at=entry_doc["created_at"]
    )

@router.get("/", response_model=list[CashEntryOut])
async def get_cash_entries(current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    entries = await db.cash_entries.find().sort("created_at", -1).to_list(length=None)
    
    return [
        CashEntryOut(
            id=str(entry["_id"]),
            item=entry["item"],
            price=entry["price"],
            qty=entry["qty"],
            total=entry["total"],
            date=entry["date"],
            created_at=entry["created_at"]
        )
        for entry in entries
    ]

@router.get("/{entry_id}", response_model=CashEntryOut)
async def get_cash_entry(entry_id: str, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    try:
        entry = await db.cash_entries.find_one({"_id": ObjectId(entry_id)})
    except:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return CashEntryOut(
        id=str(entry["_id"]),
        item=entry["item"],
        price=entry["price"],
        qty=entry["qty"],
        total=entry["total"],
        date=entry["date"],
        created_at=entry["created_at"]
    )

@router.put("/{entry_id}", response_model=CashEntryOut)
async def update_cash_entry(entry_id: str, entry_update: CashEntryUpdate, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    try:
        existing_entry = await db.cash_entries.find_one({"_id": ObjectId(entry_id)})
    except:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if not existing_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    update_data = {}
    if entry_update.item is not None:
        update_data["item"] = entry_update.item
    if entry_update.price is not None:
        update_data["price"] = entry_update.price
    if entry_update.qty is not None:
        update_data["qty"] = entry_update.qty
        # Recalculate total if price or qty changed
        new_price = entry_update.price if entry_update.price is not None else existing_entry["price"]
        update_data["total"] = new_price * entry_update.qty
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.cash_entries.update_one({"_id": ObjectId(entry_id)}, {"$set": update_data})
    
    updated_entry = await db.cash_entries.find_one({"_id": ObjectId(entry_id)})
    
    return CashEntryOut(
        id=str(updated_entry["_id"]),
        item=updated_entry["item"],
        price=updated_entry["price"],
        qty=updated_entry["qty"],
        total=updated_entry["total"],
        date=updated_entry["date"],
        created_at=updated_entry["created_at"]
    )

@router.delete("/{entry_id}")
async def delete_cash_entry(entry_id: str, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    try:
        result = await db.cash_entries.delete_one({"_id": ObjectId(entry_id)})
    except:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return {"message": "Entry deleted successfully"}