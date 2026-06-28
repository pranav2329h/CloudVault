import boto3
from config.config import Config

s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION
)


def upload_to_s3(file, object_key):

    s3_client.upload_fileobj(
        file,
        Config.AWS_BUCKET_NAME,
        object_key
    )

    return object_key


def delete_from_s3(object_key):

    s3_client.delete_object(
        Bucket=Config.AWS_BUCKET_NAME,
        Key=object_key
    )


def download_from_s3(object_key):

    return s3_client.get_object(
        Bucket=Config.AWS_BUCKET_NAME,
        Key=object_key
    )


def generate_download_url(object_key):

    return s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": Config.AWS_BUCKET_NAME,
            "Key": object_key
        },
        ExpiresIn=300
    )