from datetime import datetime


class File:

    def __init__(
        self,
        filename,
        original_name,
        s3_key,
        file_url,
        file_size,
        file_type,
        user_id,
    ):
        self.filename = filename
        self.original_name = original_name
        self.s3_key = s3_key
        self.file_url = file_url
        self.file_size = file_size
        self.file_type = file_type
        self.user_id = user_id
        self.uploaded_at = datetime.utcnow()

    def to_dict(self):
        return {
            "filename": self.filename,
            "original_name": self.original_name,
            "s3_key": self.s3_key,
            "file_url": self.file_url,
            "file_size": self.file_size,
            "file_type": self.file_type,
            "user_id": self.user_id,
            "uploaded_at": self.uploaded_at,
        }