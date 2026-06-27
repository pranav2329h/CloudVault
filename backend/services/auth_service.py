import bcrypt
from flask_jwt_extended import create_access_token

from models.user_model import find_user_by_email, create_user


def register_user(name, email, password):

    # Check if email already exists
    if find_user_by_email(email):
        return {
            "success": False,
            "message": "Email already exists"
        }, 409

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user = {
        "name": name,
        "email": email,
        "password": hashed_password.decode("utf-8"),
        "role": "user"
    }

    create_user(user)

    return {
        "success": True,
        "message": "User registered successfully"
    }, 201


def login_user(email, password):

    user = find_user_by_email(email)

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password"
        }, 401

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    ):
        return {
            "success": False,
            "message": "Invalid email or password"
        }, 401

    token = create_access_token(identity=str(user["_id"]))

    return {
        "success": True,
        "message": "Login Successful",
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }, 200