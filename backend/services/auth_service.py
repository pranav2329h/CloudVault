import bcrypt
from flask_jwt_extended import create_access_token

from config.config import Config
from models.user_model import create_user
from models.user_model import find_user_by_id
from models.user_model import find_user_by_email
from models.user_model import update_user


def _serialize_datetime(value):
    return value.isoformat() if value else None


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "user"),
        "avatar": user.get("avatar", ""),
        "storageLimit": user.get("storageLimit", Config.DEFAULT_STORAGE_LIMIT_BYTES),
        "createdAt": _serialize_datetime(user.get("createdAt")),
    }


def _hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def register_user(name, email, password):
    name = name.strip()
    email = email.strip().lower()

    if len(password) < 6:
        return {
            "success": False,
            "message": "Password must be at least 6 characters",
            "data": None,
        }, 400

    # Check if email already exists
    if find_user_by_email(email):
        return {
            "success": False,
            "message": "Email already exists",
            "data": None,
        }, 409

    user = {
        "name": name,
        "email": email,
        "password": _hash_password(password),
        "role": "user",
        "avatar": "",
        "storageLimit": Config.DEFAULT_STORAGE_LIMIT_BYTES,
    }

    result = create_user(user)
    user["_id"] = result.inserted_id
    token = create_access_token(identity=str(user["_id"]))

    return {
        "success": True,
        "message": "User registered successfully",
        "token": token,
        "user": serialize_user(user),
        "data": {
            "token": token,
            "user": serialize_user(user),
        },
    }, 201


def login_user(email, password):
    email = email.strip().lower()

    user = find_user_by_email(email)

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password",
            "data": None,
        }, 401

    if not _check_password(password, user["password"]):
        return {
            "success": False,
            "message": "Invalid email or password",
            "data": None,
        }, 401

    token = create_access_token(identity=str(user["_id"]))

    return {
        "success": True,
        "message": "Login Successful",
        "token": token,
        "user": serialize_user(user),
        "data": {
            "token": token,
            "user": serialize_user(user),
        },
    }, 200


def verify_user_token(user_id):
    user = find_user_by_id(user_id)

    if not user:
        return {
            "success": False,
            "valid": False,
            "message": "User not found",
            "data": None,
        }, 404

    return {
        "success": True,
        "valid": True,
        "user": serialize_user(user),
        "data": {
            "valid": True,
            "user": serialize_user(user),
        },
    }, 200


def get_user_profile(user_id):

    user = find_user_by_id(user_id)

    if not user:

        return {
            "success": False,
            "message": "User not found",
            "data": None,
        },404

    return {
        "success": True,
        "user": serialize_user(user),
        "data": {
            "user": serialize_user(user),
        },
    }, 200


def update_user_profile(user_id, profile_data):
    allowed_fields = {}

    if "name" in profile_data:
        name = str(profile_data.get("name", "")).strip()
        if not name:
            return {
                "success": False,
                "message": "Name is required",
                "data": None,
            }, 400
        allowed_fields["name"] = name

    if "email" in profile_data:
        email = str(profile_data.get("email", "")).strip().lower()
        if not email:
            return {
                "success": False,
                "message": "Email is required",
                "data": None,
            }, 400

        existing_user = find_user_by_email(email)
        if existing_user and str(existing_user["_id"]) != user_id:
            return {
                "success": False,
                "message": "Email already exists",
                "data": None,
            }, 409

        allowed_fields["email"] = email

    if "avatar" in profile_data:
        allowed_fields["avatar"] = str(profile_data.get("avatar", "")).strip()

    if not allowed_fields:
        return get_user_profile(user_id)

    user = update_user(user_id, allowed_fields)

    if not user:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }, 404

    return {
        "success": True,
        "message": "Profile updated successfully",
        "user": serialize_user(user),
        "data": {
            "user": serialize_user(user),
        },
    }, 200


def change_user_password(user_id, current_password, new_password):
    if not current_password or not new_password:
        return {
            "success": False,
            "message": "Current password and new password are required",
            "data": None,
        }, 400

    if len(new_password) < 6:
        return {
            "success": False,
            "message": "New password must be at least 6 characters",
            "data": None,
        }, 400

    user = find_user_by_id(user_id)

    if not user:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }, 404

    if not _check_password(current_password, user["password"]):
        return {
            "success": False,
            "message": "Current password is incorrect",
            "data": None,
        }, 401

    update_user(user_id, {"password": _hash_password(new_password)})

    return {
        "success": True,
        "message": "Password changed successfully",
        "data": None,
    }, 200
