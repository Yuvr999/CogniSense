"""
CogniTwin Backend Server Entrypoint.

Starts the FastAPI server serving the Patient Digital Twin API endpoints.
Usage:
    python -m backend.main
    uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import sys
import uvicorn

# Ensure repository root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.cognisense.api.main import app

def start_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = True):
    """Start uvicorn server with the CogniTwin FastAPI application."""
    print(f"Starting CogniTwin Backend API on http://{host}:{port} ...")
    uvicorn.run("backend.main:app", host=host, port=port, reload=reload)


if __name__ == "__main__":
    start_server()
