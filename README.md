# CogniTwin: Patient Digital Twin for Early Cognitive Deterioration

**Challenge**: Happiest Health CRP Digital Twin Challenge 2026  
**Prototype**: Multimodal longitudinal patient digital twin fusing continuous smartwatch telemetry, EHR clinical baselines, and cognitive screenings to predict 30-day cognitive deterioration with explainable what-if counterfactual simulation.

> **Disclaimer**: Research prototype using synthetic data. Predictions are not clinically validated and must not be used for diagnosis or treatment. Screening aid only.

---

## Repository Structure (Segregated Architecture)

```
hopeful-shannon/
├── backend/                       # 🔌 BACKEND SERVICE (FastAPI REST API)
│   ├── main.py                    # Server entrypoint (uvicorn backend.main:app)
│   ├── README.md                  # API documentation & endpoint index
│   └── __init__.py                # Module exports
│
├── frontend/                      # 🖥️ FRONTEND INTERFACES
│   ├── streamlit/                 # Clinician Digital Twin Dashboard (Streamlit)
│   │   ├── Home.py                # Platform portal & architecture overview
│   │   └── pages/                 # Multi-page views (2_Clinician_Dashboard.py, etc.)
│   ├── react/                     # Patient & Clinic Web Portal (React 18 + Vite)
│   │   ├── src/pages/DigitalTwin.tsx # React Digital Twin interface (/twin)
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── README.md                  # Frontend guide & run instructions
│
├── src/                           # 🧠 CORE SOURCE CODE & ALGORITHMIC ENGINE
│   ├── cognisense/
│   │   ├── twin/                  # Digital Twin Subsystem
│   │   │   ├── state_engine.py    # Daily Patient State Engine (temporal trends)
│   │   │   ├── prediction_pipeline.py # Calibrated 30-day deterioration ML model
│   │   │   ├── simulator.py       # What-If counterfactual intervention simulator
│   │   │   ├── db.py              # Persistent SQLite database & ingestion
│   │   │   ├── data_generator.py  # Synthetic EHR + 7-day wearable generator
│   │   │   └── schemas.py         # Pydantic validation schemas
│   │   ├── models/                # Baseline ML classifiers & calibration
│   │   ├── data/                  # Feature extractors
│   │   ├── explain/               # SHAP feature attributions & narrative
│   │   ├── fairness/              # Subgroup fairness audit & proxy checks
│   │   └── privacy/               # Cryptographic pseudonymization & retention
│   └── README.md                  # Core library package index
│
├── data/                          # 📊 PERSISTENT DATA & ARTIFACTS
│   ├── cognitwin.db               # SQLite database (EHR, wearables, state history)
│   ├── ehr_static_1000.csv        # 1,000 synthetic patient EHR profiles
│   ├── wearable_timeseries_7days_7000.csv # 7,000 daily wearable readings
│   ├── fused_patient_dataset_1000.csv     # Fused features for model training
│   ├── patient_daily_state.csv    # Exported time-indexed daily states
│   └── future_events.csv          # 30-day ground truth outcomes
│
├── reports/                       # 📈 EVALUATION METRICS & ARTIFACTS
│   ├── cognitwin_metrics.md       # 5-fold CV evaluation report
│   ├── cognitwin_metrics.json     # Machine-readable evaluation metrics
│   └── cognitwin_risk_model.joblib# Serialized calibrated ML model
│
├── scripts/                       # ⚙️ EXECUTION & DEMO SCRIPTS
│   ├── train_twin_model.py        # Reproducible model training script
│   └── run_twin_demo.py           # 1-click judge demonstration CLI
│
├── tests/                         # 🧪 AUTOMATED TESTS
│   ├── test_digital_twin.py       # 8 unit & integration tests (0 leakage, DB, API)
│   └── test_schemas.py            # Pydantic schema validation tests
│
├── Dockerfile                     # Container definition
├── docker-compose.yml             # Orchestration for backend & frontend services
├── Makefile                       # Reproducible CLI targets
└── requirements.txt               # Python package dependencies
```

---

## Quick Start (How to Run)

### 1. Run Automated Judge CLI Demo (15 seconds)
```bash
python scripts/run_twin_demo.py
```

### 2. Run Backend API
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
# Interactive API documentation: http://localhost:8000/docs
```

### 3. Run Clinician Digital Twin Dashboard (Streamlit)
```bash
python -m streamlit run frontend/streamlit/Home.py
# Open: http://localhost:8501 (Navigate to "2 Clinician Dashboard")
```

### 4. Run React Web Portal
```bash
cd frontend/react
npm run dev
# Open: http://localhost:5173/twin
```

### 5. Run Automated Tests
```bash
python -m pytest tests/test_digital_twin.py tests/test_schemas.py -v
```

---

## 5-Fold Cross-Validation Metrics (`reports/cognitwin_metrics.md`)

| Metric | Score | Clinical / Technical Interpretation |
|---|---|---|
| **ROC-AUC** | **0.982** | High separation between deteriorating vs stable trajectories |
| **PR-AUC** | **0.936** | High precision across full recall range on positive event cases |
| **Brier Score** | **0.044** | Platt sigmoid calibrated probabilistic accuracy |
| **Accuracy** | **0.949** | Classification accuracy at 0.50 cutoff |
| **Sensitivity (Recall)** | **0.847** | Detection of individuals at true risk of deterioration |
| **Specificity** | **0.980** | Protection against false positives in stable individuals |
| **F1 Score** | **0.886** | Harmonic balance between sensitivity and precision |
