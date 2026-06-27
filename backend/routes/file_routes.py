from flask import Blueprint
from flask import jsonify
from flask import request
import os
from services.file_service import remove_file
from flask import send_file
from services.file_service import download_file
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from services.file_service import list_files
from services.file_service import upload_file
from services.file_service import rename_file


file_bp = Blueprint("files",__name__)


@file_bp.route("/upload",methods=["POST"])
@jwt_required()

def upload():

    if "file" not in request.files:

        return jsonify({

            "success":False,

            "message":"File is required"

        }),400


    file = request.files["file"]

    user_id = get_jwt_identity()

    response,status = upload_file(
        file,
        user_id
    )

    return jsonify(response),status 

@file_bp.route("",methods=["GET"])
@jwt_required()

def get_files():

    user_id = get_jwt_identity()

    response,status = list_files(user_id)

    return jsonify(response),status

@file_bp.route("/<file_id>/download", methods=["GET"])
@jwt_required()

def download(file_id):

    user_id = get_jwt_identity()

    file, error, status = download_file(
        file_id,
        user_id
    )

    if error:

        return jsonify(error), status

    return send_file(
        file["path"],
        as_attachment=True,
        download_name=file["originalName"]
    )

@file_bp.route("/<file_id>",methods=["DELETE"])
@jwt_required()

def delete(file_id):

    user_id = get_jwt_identity()

    response,status = remove_file(
        file_id,
        user_id
    )

    return jsonify(response),status

@file_bp.route("/<file_id>/rename", methods=["PUT"])
@jwt_required()

def rename(file_id):

    data = request.get_json()

    filename = data.get("filename")

    if not filename:

        return jsonify({

            "success": False,

            "message": "Filename is required"

        }),400


    user_id = get_jwt_identity()

    response, status = rename_file(

        file_id,

        user_id,

        filename

    )

    return jsonify(response), status