from datetime import datetime, timezone

from bson.objectid import ObjectId
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from database.db import db

users_collection = db["users"]

try:
    users_collection.create_index("email", unique=True)
except PyMongoError:
    pass


def _now():
    return datetime.now(timezone.utc)


def create_user(user_data):
    user_data.setdefault("createdAt", _now())
    user_data.setdefault("updatedAt", _now())
    return users_collection.insert_one(user_data)


def find_user_by_email(email):
    return users_collection.find_one({"email": email.strip().lower()})


def find_user_by_id(user_id):
    try:
        return users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None


def update_user(user_id, update_data):
    try:
        update_data["updatedAt"] = _now()
        return users_collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )
    except Exception:
        return None
