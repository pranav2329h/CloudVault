import os
from dotenv import load_dotenv

load_dotenv()

class Config:

    DEBUG = False

    PRESIGNED_URL_EXPIRY = int(os.getenv("PRESIGNED_URL_EXPIRY", "300"))

    MONGO_URI = os.getenv("MONGO_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME", "cloudvault")
    
    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "104857600"))

    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    
    AWS_REGION = os.getenv("AWS_REGION", "eu-north-1")
    
    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")