from pymongo import MongoClient
from config.config import Config

# Safely initialize the MongoDB client
client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)

# Access the specific database
db = client[Config.DATABASE_NAME]


def ping_database():
    try:
        client.admin.command("ping")
        return True
    except Exception:
        return False
