from database.db import db
from bson.objectid import ObjectId

files_collection = db["files"]


def create_file(file_data):
    return files_collection.insert_one(file_data)


def get_files_by_owner(owner_id):
    return list(
        files_collection.find(
            {"ownerId": owner_id}
        ).sort("_id", -1)
    )


def get_file_by_id(file_id):
    return files_collection.find_one(
        {"_id": ObjectId(file_id)}
    )


def delete_file(file_id):
    return files_collection.delete_one(
        {"_id": ObjectId(file_id)}
    )