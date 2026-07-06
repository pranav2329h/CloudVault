from flask import Blueprint
from flask import jsonify
from flask import request
from flask import send_file
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from services.file_service import download_file
from services.file_service import list_files
from services.file_service import list_recent_files
from services.file_service import remove_file
from services.file_service import rename_file
from services.file_service import upload_file
from services.file_service import share_file
from services.file_service import get_shared_file_info
from services.file_service import download_shared_file


file_bp = Blueprint("files", __name__)


@file_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload():

    if "file" not in request.files:

        return jsonify({

            "success":False,

            "message":"File is required",

            "data": None

        }),400


    file = request.files["file"]

    user_id = get_jwt_identity()

    response, status = upload_file(
        file,
        user_id
    )

    return jsonify(response), status


@file_bp.route("", methods=["GET"])
@jwt_required()
def get_files():

    user_id = get_jwt_identity()

    response, status = list_files(user_id, request.args)

    return jsonify(response), status


@file_bp.route("/recent", methods=["GET"])
@jwt_required()
def get_recent_uploads():
    response, status = list_recent_files(
        get_jwt_identity(),
        request.args.get("limit", 5),
    )
    return jsonify(response), status


@file_bp.route("/<file_id>/download", methods=["GET"])
@jwt_required()
def download(file_id):

    user_id = get_jwt_identity()

    download_payload, error, status = download_file(
        file_id,
        user_id
    )

    if error:

        return jsonify(error), status

    return send_file(
        download_payload["stream"],
        as_attachment=True,
        download_name=download_payload["download_name"],
        mimetype=download_payload["mimetype"],
    )


@file_bp.route("/<file_id>", methods=["DELETE"])
@jwt_required()
def delete(file_id):

    user_id = get_jwt_identity()

    response, status = remove_file(
        file_id,
        user_id
    )

    return jsonify(response), status


@file_bp.route("/<file_id>", methods=["PUT"])
@jwt_required()
def rename(file_id):

    data = request.get_json(silent=True) or {}

    filename = data.get("name") or data.get("filename")

    if not filename:

        return jsonify({

            "success": False,

            "message": "Filename is required",

            "data": None

        }), 400


    user_id = get_jwt_identity()

    response, status = rename_file(
        file_id,
        user_id,
        filename
    )

    return jsonify(response), status


@file_bp.route("/<file_id>/rename", methods=["PUT"])
@jwt_required()
def rename_legacy(file_id):
    return rename(file_id)


@file_bp.route("/<file_id>/share", methods=["PUT"])
@jwt_required()
def share(file_id):
    data = request.get_json(silent=True) or {}
    shared = data.get("shared", False)
    share_access = data.get("shareAccess", "private")
    user_id = get_jwt_identity()

    response, status = share_file(file_id, user_id, shared, share_access)
    return jsonify(response), status


@file_bp.route("/share/<share_token>", methods=["GET"])
def get_shared(share_token):
    response, status = get_shared_file_info(share_token)
    return jsonify(response), status


@file_bp.route("/share/<share_token>/download", methods=["GET"])
def download_shared(share_token):
    download_payload, error, status = download_shared_file(share_token)
    if error:
        return jsonify(error), status

    return send_file(
        download_payload["stream"],
        as_attachment=True,
        download_name=download_payload["download_name"],
        mimetype=download_payload["mimetype"],
    )
