import logging

import boto3
from botocore.exceptions import ClientError

from config.config import Config

logger = logging.getLogger(__name__)

s3_client = boto3.client(
    service_name="s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION,
)


def upload_to_s3(file, object_key):
    """
    Upload a file object to AWS S3.
    Returns the S3 object key on success.
    """

    try:
        s3_client.upload_fileobj(
            Fileobj=file,
            Bucket=Config.AWS_BUCKET_NAME,
            Key=object_key,
        )

        logger.info(f"File uploaded successfully: {object_key}")

        return object_key

    except ClientError as e:
        logger.error(f"S3 Upload Error: {e}")
        raise

    except Exception as e:
        logger.exception(f"Unexpected Upload Error: {e}")
        raise


def delete_from_s3(object_key):
    """
    Delete an object from AWS S3.
    """

    try:
        s3_client.delete_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=object_key,
        )

        logger.info(f"Deleted object: {object_key}")

        return True

    except ClientError as e:
        logger.error(f"S3 Delete Error: {e}")
        raise

    except Exception as e:
        logger.exception(f"Unexpected Delete Error: {e}")
        raise


def download_from_s3(object_key):
    """
    Download an object from AWS S3.
    """

    try:
        response = s3_client.get_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=object_key,
        )

        return response

    except ClientError as e:
        logger.error(f"S3 Download Error: {e}")
        raise

    except Exception as e:
        logger.exception(f"Unexpected Download Error: {e}")
        raise


def generate_download_url(object_key, expiration=300):
    """
    Generate a pre-signed download URL.
    Default expiry: 5 minutes.
    """

    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": Config.AWS_BUCKET_NAME,
                "Key": object_key,
            },
            ExpiresIn=expiration,
        )

        return url

    except ClientError as e:
        logger.error(f"Pre-signed URL Error: {e}")
        raise

    except Exception as e:
        logger.exception(f"Unexpected URL Generation Error: {e}")
        raise


def object_exists(object_key):
    """
    Check whether an object exists in S3.
    Returns True or False.
    """

    try:
        s3_client.head_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=object_key,
        )

        return True

    except ClientError:
        return False


def get_file_metadata(object_key):
    """
    Get metadata of an S3 object.
    """

    try:
        response = s3_client.head_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=object_key,
        )

        return response

    except ClientError as e:
        logger.error(f"S3 Metadata Error: {e}")
        raise

    except Exception as e:
        logger.exception(f"Unexpected Metadata Error: {e}")
        raise