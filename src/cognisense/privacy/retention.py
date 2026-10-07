import os

def delete_audio_file(filepath: str):
    """
    Deletes the raw audio file from the filesystem.
    This simulates the "immediate deletion after feature extraction" requirement.
    """
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            return True
    except Exception:
        pass
    return False
