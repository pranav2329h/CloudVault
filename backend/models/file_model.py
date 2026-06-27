from database.db import db

files_collection = db["files"]


def create_file(file_data):
    return files_collection.insert_one(file_data)


def get_files_by_owner(owner_id):
    return list(files_collection.find({"ownerId": owner_id}))