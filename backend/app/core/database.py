from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

mongo_client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global mongo_client, database
    mongo_client = AsyncIOMotorClient(settings.mongodb_url)
    database = mongo_client[settings.mongodb_db_name]


async def close_mongo_connection() -> None:
    global mongo_client, database
    if mongo_client is not None:
        mongo_client.close()
    mongo_client = None
    database = None
