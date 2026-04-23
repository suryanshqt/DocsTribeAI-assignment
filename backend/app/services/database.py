import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "prescription_db")

client: AsyncIOMotorClient = None


def get_database():
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URI)
    return client[DB_NAME]


async def close_client():
    global client
    if client:
        client.close()