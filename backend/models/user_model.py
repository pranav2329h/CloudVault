from database.db import db

users_collection = db["users"]


def find_user_by_email(email):
    return users_collection.find_one({"email": email})



def create_user(user_data):
    return users_collection.insert_one(user_data)