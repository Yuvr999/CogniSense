# CogniTwin Backend Service

This directory contains the backend server and REST API for the CogniTwin platform.

## Architecture
* **Framework**: FastAPI + Uvicorn + Pydantic v2
* **Storage**: Persistent SQLite database (`data/cognitwin.db`)
* **Core Modules**: Integrates with the algorithmic engine in `src/cognisense/`

## Available Endpoints

### 1. Digital Twin Operations (`/v1/twin/...`)
* `GET /v1/twin/patients`: List synthetic cohort patients with persona tags
* `GET /v1/twin/patients/{id}/ehr`: Retrieve patient baseline EHR profile
* `GET /v1/twin/patients/{id}/wearables`: Chronological daily wearable telemetry
* `POST /v1/twin/patients/{id}/wearables`: Ingest a new observation with range validation
* `GET /v1/twin/patients/{id}/state-history`: Longitudinal daily states for time replay
* `GET /v1/twin/patients/{id}/state`: Current digital twin computational state
* `POST /v1/twin/patients/{id}/compare-states`: Compare state between Day A and Day B
* `GET /v1/twin/patients/{id}/prediction`: Calibrated 30-day deterioration prediction + SHAP
* `GET /v1/twin/patients/{id}/prediction-history`: Prediction audit trail
* `POST /v1/twin/patients/{id}/simulate`: Run what-if counterfactual scenario simulation
* `POST /v1/twin/patients/{id}/advance-day`: Ingest streaming Day 8+ observation
* `POST /v1/twin/reset-demo`: Reset SQLite database to clean 7-day state

### 2. General Screening & Health
* `GET /healthz`: Healthcheck
* `POST /v1/screen/tabular-risk`: Tabular risk screening inference
* `GET /v1/model/card`: Model version and fairness metadata

## How to Run
```bash
# Start backend server
python -m backend.main
# Or via uvicorn directly
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API documentation is accessible at: `http://localhost:8000/docs`
