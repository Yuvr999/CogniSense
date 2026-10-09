"""
CogniTwin Backend Service Package.
Exposes the FastAPI application, REST endpoints, and Digital Twin API server.
"""

from src.cognisense.api.main import app

__all__ = ["app"]
