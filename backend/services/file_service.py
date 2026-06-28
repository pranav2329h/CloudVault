import os
import uuid

from werkzeug.utils import secure_filename

from models.file_model import create_file

from config.config import Config

from utils.helper import format_file_size

from models.file_model import update_file_name

ALLOWED_EXTENSIONS = {
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "docx",
    "pptx",
    "zip",
    "txt"
}


def allowed_file(filename):

    return "." in filename and \
           filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS


import uuid

from werkzeug.utils import secure_filename

from services.s3_service import upload_to_s3

from models.file_model import create_file


def upload_file(file, user_id):

    original_name = secure_filename(file.filename)

    unique_name = f"{uuid.uuid4()}_{original_name}"

    s3_key = f"users/{user_id}/{unique_name}"

    upload_to_s3(
        file,
        s3_key
    )

    metadata = {

        "filename": unique_name,

        "originalName": original_name,

        "ownerId": user_id,

        "type": file.content_type,

        "s3Key": s3_key

    }

    create_file(metadata)

    return {

        "success": True,

        "message": "Uploaded Successfully"

    },201

from models.file_model import get_files_by_owner


def list_files(user_id):

    files = get_files_by_owner(user_id)

    result = []

    for file in files:

        result.append({

            "id":str(file["_id"]),

            "filename":file["originalName"],

            "size":format_file_size(file["size"]),

            "type":file["type"]

        })

    return {

        "success":True,

        "count":len(result),

        "files":result

    },200
from models.file_model import get_file_by_id


def download_file(file_id, user_id):

    file = get_file_by_id(file_id)

    if not file:

        return None, {
            "success": False,
            "message": "File not found"
        }, 404

    if file["ownerId"] != user_id:

        return None, {
            "success": False,
            "message": "Access denied"
        }, 403

    return file, None, 200

import os

from models.file_model import (
    get_file_by_id,
    delete_file
)


def remove_file(file_id, user_id):

    file = get_file_by_id(file_id)

    if not file:

        return {

            "success": False,

            "message": "File not found"

        },404


    if file["ownerId"] != user_id:

        return {

            "success": False,

            "message": "Access denied"

        },403


    if os.path.exists(file["path"]):

        os.remove(file["path"])


    delete_file(file_id)

    return {

        "success": True,

        "message": "File deleted successfully"

    },200

def rename_file(file_id, user_id, new_name):
    
    file = get_file_by_id(file_id)

    if not file:

        return {

            "success": False,

            "message": "File not found"

        },404


    if file["ownerId"] != user_id:

        return {

            "success": False,

            "message": "Access denied"

        },403


    update_file_name(
        file_id,
        new_name
    )

    return {

        "success": True,

        "message": "File renamed successfully"

    },200