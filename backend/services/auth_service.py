import bcrypt
from models.user_model import find_user_by_email, create_user


def register_user(name, email, password):

    # Check if email already exists
    if find_user_by_email(email):
        return {
            "success": False,
            "message": "Email already exists"
        }, 409

    # Hash the password
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