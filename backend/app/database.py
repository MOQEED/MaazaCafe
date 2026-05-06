from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config

MONGO_URL = config("MONGO_URL", default="mongodb://localhost:27017")
DATABASE_NAME = config("DATABASE_NAME", default="maaza_cafe")

client: AsyncIOMotorClient = None
database = None

async def connect_to_mongo():
    global client, database
    client = AsyncIOMotorClient(MONGO_URL)
    database = client[DATABASE_NAME]
    print(f"Connected to MongoDB: {DATABASE_NAME}")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_database():
    return database