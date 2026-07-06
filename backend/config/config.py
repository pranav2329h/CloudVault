import os
from dotenv import load_dotenv

load_dotenv()


def _csv_env(name, default):
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


class Config:

    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    PORT = int(os.getenv("PORT", "5000"))

    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)

    CORS_ORIGINS = _csv_env(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,https://cloudvault-pranav.duckdns.org",
    )

    PRESIGNED_URL_EXPIRY = int(os.getenv("PRESIGNED_URL_EXPIRY", "300"))

    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://admin:password@mongodb:27017/?authSource=admin",
    )

    DATABASE_NAME = os.getenv("DATABASE_NAME", "cloudvault")

    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "104857600"))

    MAX_CONTENT_LENGTH = MAX_FILE_SIZE

    DEFAULT_STORAGE_LIMIT_BYTES = int(
        os.getenv("DEFAULT_STORAGE_LIMIT_BYTES", str(15 * 1024 * 1024 * 1024))
    )

    STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "s3").lower()

    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")

    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

    AWS_REGION = os.getenv("AWS_REGION", "eu-north-1")

    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
