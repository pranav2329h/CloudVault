from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from services.auth_service import get_user_profile
from services.auth_service import register_user
from services.auth_service import login_user
from services.auth_service import verify_user_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required",
            "data": None
        }), 400

    response, status = register_user(name, email, password)

    return jsonify(response), status

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or {}

    email = data.get("email")

    password = data.get("password")

    if not email or not password:

        return jsonify({

            "success": False,

            "message": "Email and Password are required",

            "data": None

        }), 400

    response, status = login_user(email, password)

    return jsonify(response), status


@auth_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify():
    user_id = get_jwt_identity()
    response, status = verify_user_token(user_id)
    return jsonify(response), status


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    response, status = get_user_profile(user_id)

    return jsonify(response), status
