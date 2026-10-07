setup:
	poetry install
	poetry run pre-commit install || true

test:
	poetry run pytest

lint:
	poetry run ruff check .

build:
	docker compose build

all: setup lint test build
	@echo "All phases complete. Reported numbers are reproducible via testing and offline demo mocks."
