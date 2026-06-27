import os
import uuid

from werkzeug.utils import secure_filename

from models.file_model import create_file

from config.config import Config

from utils.helper import format_file_size


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


def upload_file(file,user_id):

    if file.filename == "":

        return {
            "success":False,
            "message":"No file selected"
        },400


    if not allowed_file(file.filename):

        return {
            "success":False,
            "message":"Unsupported file type"
        },400


    original_name = secure_filename(file.filename)

    unique_filename = f"{uuid.uuid4()}_{original_name}"

    upload_path = os.path.join(
        Config.UPLOAD_FOLDER,
        unique_filename
    )

    file.save(upload_path)

    metadata = {

        "filename":unique_filename,

        "originalName":original_name,

        "ownerId":user_id,

        "size":os.path.getsize(upload_path),

        "type":file.content_type,

        "path":upload_path

    }

    create_file(metadata)

    return {

        "success":True,

        "message":"File uploaded successfully"

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