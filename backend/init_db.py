import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.auth import get_password_hash
from datetime import datetime
from decouple import config

async def init_database():
    MONGO_URL = config("MONGO_URL", default="mongodb://localhost:27017")
    DATABASE_NAME = config("DATABASE_NAME", default="maaza_cafe")

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]

    # Create default admin user
    admin_user = {
        "username": "admin",
        "email": "admin@maazacafe.com",
        "password": get_password_hash("admin123"),
        "role": "admin",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    # Create default owner user
    owner_user = {
        "username": "owner",
        "email": "owner@maazacafe.com",
        "password": get_password_hash("owner123"),
        "role": "owner",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    # Insert users if they don't exist
    existing_admin = await db.users.find_one({"username": "admin"})
    if not existing_admin:
        await db.users.insert_one(admin_user)
        print("Default admin user created: username='admin', password='admin123'")

    existing_owner = await db.users.find_one({"username": "owner"})
    if not existing_owner:
        await db.users.insert_one(owner_user)
        print("Default owner user created: username='owner', password='owner123'")

    # Create indexes for better performance
    await db.users.create_index("username", unique=True)
    await db.users.create_index("email", unique=True)
    await db.menu_items.create_index("name")
    await db.bills.create_index("bill_no", unique=True)
    await db.bills.create_index("date")
    await db.cash_entries.create_index("date")

    print("Database initialized successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())