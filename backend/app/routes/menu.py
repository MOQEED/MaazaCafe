from fastapi import APIRouter, HTTPException, Depends
from app.database import get_database
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, MenuItemOut
from app.routes.auth import get_current_user
from app.schemas.user import UserOut
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=MenuItemOut)
async def create_menu_item(item: MenuItemCreate, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    item_doc = {
        "name": item.name,
        "price": item.price,
        "image": item.image,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.menu_items.insert_one(item_doc)
    item_doc["_id"] = result.inserted_id
    
    return MenuItemOut(
        id=str(item_doc["_id"]),
        name=item_doc["name"],
        price=item_doc["price"],
        image=item_doc["image"],
        created_at=item_doc["created_at"],
        updated_at=item_doc["updated_at"]
    )

@router.get("/", response_model=list[MenuItemOut])
async def get_menu_items():
    db = get_database()
    items = await db.menu_items.find().to_list(length=None)
    
    return [
        MenuItemOut(
            id=str(item["_id"]),
            name=item["name"],
            price=item["price"],
            image=item.get("image"),
            created_at=item["created_at"],
            updated_at=item["updated_at"]
        )
        for item in items
    ]

@router.get("/{item_id}", response_model=MenuItemOut)
async def get_menu_item(item_id: str):
    db = get_database()
    
    try:
        item = await db.menu_items.find_one({"_id": ObjectId(item_id)})
    except:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return MenuItemOut(
        id=str(item["_id"]),
        name=item["name"],
        price=item["price"],
        image=item.get("image"),
        created_at=item["created_at"],
        updated_at=item["updated_at"]
    )

@router.put("/{item_id}", response_model=MenuItemOut)
async def update_menu_item(item_id: str, item_update: MenuItemUpdate, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    try:
        existing_item = await db.menu_items.find_one({"_id": ObjectId(item_id)})
    except:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = {}
    if item_update.name is not None:
        update_data["name"] = item_update.name
    if item_update.price is not None:
        update_data["price"] = item_update.price
    if item_update.image is not None:
        update_data["image"] = item_update.image
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.menu_items.update_one({"_id": ObjectId(item_id)}, {"$set": update_data})
    
    updated_item = await db.menu_items.find_one({"_id": ObjectId(item_id)})
    
    return MenuItemOut(
        id=str(updated_item["_id"]),
        name=updated_item["name"],
        price=updated_item["price"],
        image=updated_item.get("image"),
        created_at=updated_item["created_at"],
        updated_at=updated_item["updated_at"]
    )

@router.delete("/{item_id}")
async def delete_menu_item(item_id: str, current_user: UserOut = Depends(get_current_user)):
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db = get_database()
    
    try:
        result = await db.menu_items.delete_one({"_id": ObjectId(item_id)})
    except:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item deleted successfully"}