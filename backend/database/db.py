from pymongo import MongoClient
from config.config import Config

# Safely initialize the MongoDB client
client = MongoClient(Config.MONGO_URI)

# Access the specific database
db = client[Config.DATABASE_NAME]
