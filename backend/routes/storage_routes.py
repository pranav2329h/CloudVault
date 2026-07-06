from flask import Blueprint
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from services.file_service import get_storage_metrics

storage_bp = Blueprint("storage", __name__)


@storage_bp.route("/metrics", methods=["GET"])
@jwt_required()
def metrics():
    response, status = get_storage_metrics(get_jwt_identity())
    return jsonify(response), status
