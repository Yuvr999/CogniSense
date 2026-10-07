import base64

class CryptoManager:
    # A mock crypto manager for hackathon purposes.
    def encrypt(self, data: str) -> bytes:
        return base64.b64encode(data.encode())
        
    def decrypt(self, token: bytes) -> str:
        return base64.b64decode(token).decode()
