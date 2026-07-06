from flask import Blueprint
from flask import jsonify
from flask import request
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from services.auth_service import change_user_password
from services.auth_service import get_user_profile
from services.auth_service import update_user_profile

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("", methods=["GET"])
@jwt_required()
def get_profile():
    response, status = get_user_profile(get_jwt_identity())
    return jsonify(response), status


@profile_bp.route("", methods=["PUT"])
@jwt_required()
def update_profile():
    data = request.get_json(silent=True) or {}
    response, status = update_user_profile(get_jwt_identity(), data)
    return jsonify(response), status


@profile_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    data = request.get_json(silent=True) or {}
    response, status = change_user_password(
        get_jwt_identity(),
        data.get("currentPassword"),
        data.get("newPassword"),
    )
    return jsonify(response), status
