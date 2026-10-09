setup:
	python -m pip install -r requirements.txt || true

generate-twin-data:
	python -c "import sys; sys.path.insert(0, '.'); from src.cognisense.twin.data_generator import generate_all_twin_datasets; generate_all_twin_datasets()"

train-twin:
	python scripts/train_twin_model.py

demo:
	python scripts/run_twin_demo.py

test:
	python -m pytest tests/test_digital_twin.py tests/test_schemas.py -v

backend:
	python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

frontend-dashboard:
	python -m streamlit run frontend/streamlit/Home.py --server.port 8501

frontend-web:
	cd frontend/react && npm run dev

api: backend
app: frontend-dashboard
web: frontend-web

all: generate-twin-data train-twin test
	@echo "CogniTwin verification and test pipeline complete."
