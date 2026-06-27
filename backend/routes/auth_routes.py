from flask import Blueprint, request, jsonify
from services.auth_service import register_user
from services.auth_service import login_user
auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    response, status = register_user(name, email, password)

    return jsonify(response), status

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")

    password = data.get("password")

    if not email or not password:

        return jsonify({

            "success": False,

            "message": "Email and Password are required"

        }), 400

    response, status = login_user(email, password)

    return jsonify(response), status