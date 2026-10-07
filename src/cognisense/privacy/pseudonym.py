import uuid
import hashlib

def generate_pseudonym(real_id: str, salt: str = "cognisense_salt") -> str:
    """
    Generates a consistent pseudonym for a given real ID (one-way).
    """
    m = hashlib.sha256()
    m.update((real_id + salt).encode())
    return m.hexdigest()[:16]

def generate_session_id() -> str:
    """
    Generates a new random session ID.
    """
    return str(uuid.uuid4())
