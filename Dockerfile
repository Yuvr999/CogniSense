FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || pip install --no-cache-dir fastapi uvicorn streamlit scikit-learn pandas numpy shap plotly pydantic joblib matplotlib

# Copy repository
COPY . .

# Initialize digital twin database and models
RUN python -c "import sys; sys.path.insert(0, '.'); from src.cognisense.twin.data_generator import generate_all_twin_datasets; from src.cognisense.twin.db import init_db; generate_all_twin_datasets(); init_db()"

EXPOSE 8000 8501

# Default command starts backend API
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
