def format_file_size(size):
    
    if size < 1024:

        return f"{size} Bytes"

    elif size < 1024 * 1024:

        return f"{round(size / 1024,2)} KB"

    elif size < 1024 * 1024 * 1024:

        return f"{round(size / (1024*1024),2)} MB"

    else:

        return f"{round(size / (1024*1024*1024),2)} GB"