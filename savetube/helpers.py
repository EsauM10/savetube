import os
from datetime import datetime

def clear_symbols(filename: str) -> str:
    for char in ['\\', '/', ':', '*', '"', '?', '<', '>', '|']:
        filename = filename.replace(char, "")
    return filename

def get_valid_filename(filename: str, output_dir: str) -> str:
    clean_filename = clear_symbols(filename)
    
    path = os.path.join(output_dir, clean_filename)

    if(os.path.exists(path)):
        title, extension = os.path.splitext(clean_filename)
        timestamp = int(datetime.now().timestamp())
        return f'{title}_{timestamp}{extension}'

    return clean_filename