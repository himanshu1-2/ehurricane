# ...new file...
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()  # loads fastapi/.env or repo .env if present

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in .env (fastapi/.env or repo .env)")

mongo_client: AsyncIOMotorClient | None = None

async def connect_to_mongo(app):
    global mongo_client
    mongo_client = AsyncIOMotorClient(MONGO_URI)
    # use default DB from URI if present, otherwise require MONGO_DB
    try:
        app.state.db = mongo_client.get_default_database()
    except Exception:
        db_name = os.getenv("MONGO_DB")
        if not db_name:
            raise RuntimeError("MONGO_DB not set and no default DB in MONGO_URI")
        app.state.db = mongo_client[db_name]

async def close_mongo_connection(app):
    global mongo_client
    if mongo_client:
        mongo_client.close()