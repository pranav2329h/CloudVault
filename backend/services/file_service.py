import os
import uuid
from io import BytesIO
from pathlib import Path

from werkzeug.utils import secure_filename

from config.config import Config
from models.file_model import count_files_by_owner
from models.file_model import create_file
from models.file_model import delete_file
from models.file_model import get_all_files_by_owner
from models.file_model import get_file_by_id
from models.file_model import get_files_by_owner
from models.file_model import get_recent_files
from models.file_model import update_file_name
from models.file_model import update_file_share
from models.file_model import get_file_by_share_token
from services.s3_service import delete_from_s3
from services.s3_service import download_from_s3
from services.s3_service import upload_to_s3
from services.s3_service import generate_download_url

FILE_CATEGORIES = {
    "IMAGE": {"jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"},
    "VIDEO": {"mp4", "mov", "avi", "mkv", "webm", "flv"},
    "AUDIO": {"mp3", "wav", "ogg", "flac", "aac"},
    "DOCUMENT": {"pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "csv", "md"},
    "ARCHIVE": {"zip", "rar", "7z", "tar", "gz"},
    "CODE": {"js", "jsx", "ts", "tsx", "html", "css", "json", "py", "java", "c", "cpp", "sql", "sh"},
}

CATEGORY_META = {
    "VIDEO": {"label": "Videos", "color": "#EC4899"},
    "IMAGE": {"label": "Images", "color": "#A855F7"},
    "DOCUMENT": {"label": "Documents", "color": "#2563EB"},
    "ARCHIVE": {"label": "Archives", "color": "#F59E0B"},
    "AUDIO": {"label": "Audio", "color": "#EAB308"},
    "CODE": {"label": "Code", "color": "#22C55E"},
    "OTHER": {"label": "Other", "color": "#64748B"},
}


def get_file_category(filename):
    if not filename or "." not in filename:
        return "OTHER"

    extension = filename.rsplit(".", 1)[1].lower()
    for category, extensions in FILE_CATEGORIES.items():
        if extension in extensions:
            return category
    return "OTHER"


def _datetime_to_iso(value):
    return value.isoformat() if value else None


def serialize_file(file):
    name = file.get("originalName") or file.get("filename") or "untitled"

    url = file.get("url")
    if not url and file.get("s3Key") and Config.STORAGE_BACKEND == "s3":
        try:
            url = generate_download_url(file["s3Key"], getattr(Config, "PRESIGNED_URL_EXPIRY", 3600))
        except Exception:
            url = f"/api/files/{file['_id']}/download"
    elif not url:
        url = f"/api/files/{file['_id']}/download"

    return {
        "id": str(file["_id"]),
        "name": name,
        "filename": name,
        "originalName": name,
        "size": int(file.get("size", 0)),
        "type": file.get("type") or "application/octet-stream",
        "category": file.get("category") or get_file_category(name),
        "updatedAt": _datetime_to_iso(file.get("updatedAt") or file.get("createdAt")),
        "createdAt": _datetime_to_iso(file.get("createdAt")),
        "starred": bool(file.get("starred", False)),
        "shared": bool(file.get("shared", False)),
        "shareAccess": file.get("shareAccess", "private"),
        "shareToken": file.get("shareToken"),
        "url": url,
    }


def _get_file_size(file):
    current_position = file.stream.tell()
    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(current_position)
    return size


def _save_local_file(file, user_id, unique_name):
    upload_root = Path(Config.UPLOAD_FOLDER)
    if not upload_root.is_absolute():
        upload_root = Path.cwd() / upload_root

    upload_dir = upload_root / "users" / user_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / unique_name
    file.save(file_path)
    return str(file_path.resolve())


def _build_list_query(params):
    query = {}

    search = (params.get("search") or "").strip()
    if search:
        query["$or"] = [
            {"originalName": {"$regex": search, "$options": "i"}},
            {"filename": {"$regex": search, "$options": "i"}},
        ]

    category = (params.get("category") or "").strip().upper()
    if category and category != "ALL":
        query["category"] = category

    return query


def _pagination_params(params):
    try:
        page = max(int(params.get("page", 1)), 1)
    except (TypeError, ValueError):
        page = 1

    try:
        limit = min(max(int(params.get("limit", 12)), 1), 100)
    except (TypeError, ValueError):
        limit = 12

    return page, limit


def _sort_params(params):
    sort_map = {
        "name": "originalName",
        "size": "size",
        "updatedAt": "updatedAt",
        "createdAt": "createdAt",
    }

    requested_sort = params.get("sort", "updatedAt")
    sort_field = sort_map.get(requested_sort, "updatedAt")
    sort_order = 1 if params.get("order") == "asc" else -1

    return sort_field, sort_order


def upload_file(file, user_id):
    if not file or not file.filename:
        return {
            "success": False,
            "message": "File is required",
            "data": None,
        }, 400

    original_name = secure_filename(file.filename)
    if not original_name:
        return {
            "success": False,
            "message": "Invalid file name",
            "data": None,
        }, 400

    file_size = _get_file_size(file)
    if file_size > Config.MAX_FILE_SIZE:
        return {
            "success": False,
            "message": "File exceeds the maximum upload size",
            "data": None,
        }, 413

    unique_name = f"{uuid.uuid4()}_{original_name}"
    category = get_file_category(original_name)
    s3_key = f"users/{user_id}/{unique_name}"

    metadata = {
        "filename": unique_name,
        "originalName": original_name,
        "ownerId": user_id,
        "type": file.content_type or "application/octet-stream",
        "size": file_size,
        "category": category,
        "storageBackend": Config.STORAGE_BACKEND,
        "s3Key": s3_key,
    }

    try:
        file.stream.seek(0)
        if Config.STORAGE_BACKEND == "local":
            metadata["path"] = _save_local_file(file, user_id, unique_name)
        else:
            if not Config.AWS_BUCKET_NAME:
                return {
                    "success": False,
                    "message": "AWS_BUCKET_NAME is required for S3 uploads",
                    "data": None,
                }, 500
            upload_to_s3(file, s3_key)
    except Exception:
        return {
            "success": False,
            "message": "File upload failed",
            "data": None,
        }, 500

    result = create_file(metadata)
    metadata["_id"] = result.inserted_id

    return {
        "success": True,
        "message": "Uploaded successfully",
        "file": serialize_file(metadata),
        "data": {
            "file": serialize_file(metadata),
        },
    }, 201


def list_files(user_id, params=None):
    params = params or {}
    query = _build_list_query(params)
    page, limit = _pagination_params(params)
    sort_field, sort_order = _sort_params(params)
    skip = (page - 1) * limit

    files = get_files_by_owner(user_id, query, sort_field, sort_order, skip, limit)
    total = count_files_by_owner(user_id, query)
    total_pages = max((total + limit - 1) // limit, 1)

    res_data = {
        "count": len(files),
        "files": [serialize_file(file) for file in files],
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": total_pages,
        },
    }
    return {
        "success": True,
        **res_data,
        "data": res_data,
    }, 200


def list_recent_files(user_id, limit=5):
    try:
        limit = min(max(int(limit), 1), 25)
    except (TypeError, ValueError):
        limit = 5

    recent_files = [serialize_file(file) for file in get_recent_files(user_id, limit)]
    return {
        "success": True,
        "files": recent_files,
        "data": {
            "files": recent_files,
        },
    }, 200


def download_file(file_id, user_id):
    file = get_file_by_id(file_id)

    if not file:
        return None, {
            "success": False,
            "message": "File not found",
            "data": None,
        }, 404

    if file["ownerId"] != user_id:
        return None, {
            "success": False,
            "message": "Access denied",
            "data": None,
        }, 403

    if file.get("storageBackend") == "local":
        file_path = file.get("path")
        if not file_path or not os.path.exists(file_path):
            return None, {
                "success": False,
                "message": "Stored file is missing",
                "data": None,
            }, 404

        with open(file_path, "rb") as stored_file:
            stream = BytesIO(stored_file.read())
        stream.seek(0)

        return {
            "stream": stream,
            "download_name": file["originalName"],
            "mimetype": file.get("type") or "application/octet-stream",
        }, None, 200

    try:
        response = download_from_s3(file["s3Key"])
        stream = BytesIO(response["Body"].read())
        stream.seek(0)
        return {
            "stream": stream,
            "download_name": file["originalName"],
            "mimetype": file.get("type") or response.get("ContentType") or "application/octet-stream",
        }, None, 200
    except Exception:
        return None, {
            "success": False,
            "message": "File download failed",
            "data": None,
        }, 500


def remove_file(file_id, user_id):
    file = get_file_by_id(file_id)

    if not file:
        return {
            "success": False,
            "message": "File not found",
            "data": None,
        }, 404

    if file["ownerId"] != user_id:
        return {
            "success": False,
            "message": "Access denied",
            "data": None,
        }, 403

    try:
        if file.get("storageBackend") == "local":
            file_path = file.get("path")
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
        elif file.get("s3Key"):
            delete_from_s3(file["s3Key"])
    except Exception:
        return {
            "success": False,
            "message": "File deletion failed",
            "data": None,
        }, 500

    delete_file(file_id)

    return {
        "success": True,
        "message": "File deleted successfully",
        "id": file_id,
        "data": {
            "id": file_id,
        },
    }, 200


def rename_file(file_id, user_id, new_name):
    file = get_file_by_id(file_id)

    if not file:
        return {
            "success": False,
            "message": "File not found",
            "data": None,
        }, 404

    if file["ownerId"] != user_id:
        return {
            "success": False,
            "message": "Access denied",
            "data": None,
        }, 403

    clean_name = secure_filename(str(new_name).strip())
    if not clean_name:
        return {
            "success": False,
            "message": "Filename is required",
            "data": None,
        }, 400

    updated = update_file_name(file_id, clean_name, get_file_category(clean_name))

    updated_ser = serialize_file(updated)
    return {
        "success": True,
        "message": "File renamed successfully",
        "file": updated_ser,
        "data": {
            "file": updated_ser,
        },
    }, 200


def get_storage_metrics(user_id):
    files = get_all_files_by_owner(user_id)
    total_bytes = Config.DEFAULT_STORAGE_LIMIT_BYTES
    used_bytes = sum(int(file.get("size", 0)) for file in files)
    remaining_bytes = max(total_bytes - used_bytes, 0)
    percentage = round((used_bytes / total_bytes) * 100, 1) if total_bytes else 0

    categories = {}
    for file in files:
        category = file.get("category") or get_file_category(file.get("originalName", ""))
        meta = CATEGORY_META.get(category, CATEGORY_META["OTHER"])
        if category not in categories:
            categories[category] = {
                "bytes": 0,
                "count": 0,
                "label": meta["label"],
                "color": meta["color"],
            }

        categories[category]["bytes"] += int(file.get("size", 0))
        categories[category]["count"] += 1

    metrics_data = {
        "totalBytes": total_bytes,
        "usedBytes": used_bytes,
        "remainingBytes": remaining_bytes,
        "percentage": percentage,
        "totalFiles": len(files),
        "categories": categories,
    }
    return {
        "success": True,
        **metrics_data,
        "data": metrics_data,
    }, 200


def share_file(file_id, user_id, shared, share_access):
    file = get_file_by_id(file_id)
    if not file:
        return {
            "success": False,
            "message": "File not found",
            "data": None,
        }, 404

    if file["ownerId"] != user_id:
        return {
            "success": False,
            "message": "Access denied",
            "data": None,
        }, 403

    share_token = file.get("shareToken") or uuid.uuid4().hex
    updated = update_file_share(file_id, shared, share_access, share_token)
    updated_ser = serialize_file(updated)
    return {
        "success": True,
        "message": "Share settings updated",
        "file": updated_ser,
        "data": {
            "file": updated_ser,
        },
    }, 200


def get_shared_file_info(share_token):
    file = get_file_by_share_token(share_token)
    if not file or not file.get("shared") or file.get("shareAccess") != "public":
        return {
            "success": False,
            "message": "File not found or access is restricted",
            "data": None,
        }, 404

    ser = serialize_file(file)
    return {
        "success": True,
        "file": ser,
        "data": {
            "file": ser,
        },
    }, 200


def download_shared_file(share_token):
    file = get_file_by_share_token(share_token)
    if not file or not file.get("shared") or file.get("shareAccess") != "public":
        return None, {
            "success": False,
            "message": "File not found or access is restricted",
            "data": None,
        }, 404

    if file.get("storageBackend") == "local":
        file_path = file.get("path")
        if not file_path or not os.path.exists(file_path):
            return None, {
                "success": False,
                "message": "Stored file is missing",
                "data": None,
            }, 404

        with open(file_path, "rb") as stored_file:
            stream = BytesIO(stored_file.read())
        stream.seek(0)

        return {
            "stream": stream,
            "download_name": file["originalName"],
            "mimetype": file.get("type") or "application/octet-stream",
        }, None, 200

    try:
        response = download_from_s3(file["s3Key"])
        stream = BytesIO(response["Body"].read())
        stream.seek(0)
        return {
            "stream": stream,
            "download_name": file["originalName"],
            "mimetype": file.get("type") or response.get("ContentType") or "application/octet-stream",
        }, None, 200
    except Exception:
        return None, {
            "success": False,
            "message": "File download failed",
            "data": None,
        }, 500
