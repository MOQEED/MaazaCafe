from fastapi import APIRouter, HTTPException, Depends
from app.database import get_database
from app.schemas.bill import BillCreate, BillOut
from app.routes.auth import get_current_user
from app.schemas.user import UserOut
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=BillOut)
async def create_bill(bill: BillCreate):
    db = get_database()
    
    # Get next bill number
    last_bill = await db.bills.find_one(sort=[("bill_no", -1)])
    bill_no = (last_bill["bill_no"] if last_bill else 0) + 1
    
    bill_doc = {
        "bill_no": bill_no,
        "items": [item.dict() for item in bill.items],
        "total": bill.total,
        "date": datetime.utcnow(),
        "created_at": datetime.utcnow()
    }
    
    result = await db.bills.insert_one(bill_doc)
    bill_doc["_id"] = result.inserted_id
    
    return BillOut(
        id=str(bill_doc["_id"]),
        bill_no=bill_doc["bill_no"],
        items=bill_doc["items"],
        total=bill_doc["total"],
        date=bill_doc["date"],
        created_at=bill_doc["created_at"]
    )

@router.get("/", response_model=list[BillOut])
async def get_bills(current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    bills = await db.bills.find().sort("created_at", -1).to_list(length=None)
    
    return [
        BillOut(
            id=str(bill["_id"]),
            bill_no=bill["bill_no"],
            items=bill["items"],
            total=bill["total"],
            date=bill["date"],
            created_at=bill["created_at"]
        )
        for bill in bills
    ]

@router.get("/{bill_id}", response_model=BillOut)
async def get_bill(bill_id: str, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    try:
        bill = await db.bills.find_one({"_id": ObjectId(bill_id)})
    except:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    return BillOut(
        id=str(bill["_id"]),
        bill_no=bill["bill_no"],
        items=bill["items"],
        total=bill["total"],
        date=bill["date"],
        created_at=bill["created_at"]
    )

@router.delete("/{bill_id}")
async def delete_bill(bill_id: str, current_user: UserOut = Depends(get_current_user)):
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Only owner can delete bills")
    
    db = get_database()
    
    try:
        result = await db.bills.delete_one({"_id": ObjectId(bill_id)})
    except:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    return {"message": "Bill deleted successfully"}