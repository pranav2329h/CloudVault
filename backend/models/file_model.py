from datetime import datetime
from datetime import timezone

from bson.objectid import ObjectId
from pymongo import ASCENDING
from pymongo import DESCENDING
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from database.db import db

files_collection = db["files"]

try:
    files_collection.create_index([("ownerId", ASCENDING), ("updatedAt", DESCENDING)])
except PyMongoError:
    pass


class File:

    def __init__(
        self,
        filename,
        original_name,
        s3_key,
        file_url,
        file_size,
        file_type,
        user_id,
    ):
        self.filename = filename
        self.original_name = original_name
        self.s3_key = s3_key
        self.file_url = file_url
        self.file_size = file_size
        self.file_type = file_type
        self.user_id = user_id
        self.uploaded_at = datetime.utcnow()

    def to_dict(self):
        return {
            "filename": self.filename,
            "original_name": self.original_name,
            "s3_key": self.s3_key,
            "file_url": self.file_url,
            "file_size": self.file_size,
            "file_type": self.file_type,
            "user_id": self.user_id,
            "uploaded_at": self.uploaded_at,
        }


def _now():
    return datetime.now(timezone.utc)


def _object_id(file_id):
    try:
        return ObjectId(file_id)
    except Exception:
        return None


def create_file(file_data):
    now = _now()
    file_data.setdefault("createdAt", now)
    file_data.setdefault("updatedAt", now)
    file_data.setdefault("size", 0)
    return files_collection.insert_one(file_data)


def get_files_by_owner(owner_id, query=None, sort_field="updatedAt", sort_order=-1, skip=0, limit=12):
    mongo_query = {"ownerId": owner_id}
    if query:
        mongo_query.update(query)

    return list(
        files_collection.find(mongo_query)
        .sort(sort_field, DESCENDING if sort_order < 0 else ASCENDING)
        .skip(skip)
        .limit(limit)
    )


def count_files_by_owner(owner_id, query=None):
    mongo_query = {"ownerId": owner_id}
    if query:
        mongo_query.update(query)
    return files_collection.count_documents(mongo_query)


def get_recent_files(owner_id, limit=5):
    return list(
        files_collection.find({"ownerId": owner_id})
        .sort("updatedAt", DESCENDING)
        .limit(limit)
    )


def get_file_by_id(file_id):
    object_id = _object_id(file_id)
    if not object_id:
        return None
    return files_collection.find_one({"_id": object_id})


def update_file_name(file_id, new_name, category):
    object_id = _object_id(file_id)
    if not object_id:
        return None

    return files_collection.find_one_and_update(
        {"_id": object_id},
        {
            "$set": {
                "originalName": new_name,
                "category": category,
                "updatedAt": _now(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )


def delete_file(file_id):
    object_id = _object_id(file_id)
    if not object_id:
        return None
    return files_collection.delete_one({"_id": object_id})


def get_all_files_by_owner(owner_id):
    return list(files_collection.find({"ownerId": owner_id}))


def update_file_share(file_id, shared, share_access, share_token):
    object_id = _object_id(file_id)
    if not object_id:
        return None

    return files_collection.find_one_and_update(
        {"_id": object_id},
        {
            "$set": {
                "shared": bool(shared),
                "shareAccess": share_access,
                "shareToken": share_token,
                "updatedAt": _now(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )


def get_file_by_share_token(share_token):
    if not share_token:
        return None
    return files_collection.find_one({"shareToken": share_token})
