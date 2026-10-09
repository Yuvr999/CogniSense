# CogniTwin Frontend Architectures

This directory contains the two user-facing frontend presentation layers for the CogniTwin platform:

## 1. Clinician Digital Twin Dashboard (`frontend/streamlit/`)
* **Framework**: Streamlit + Plotly
* **Target Audience**: Neurologists, geriatricians, and challenge judges
* **Key Features**:
  - Longitudinal physiological telemetry charts (HRV, Resting HR, Sleep architecture, Steps)
  - Time scrubber / historical state replay (inspect what the twin knew at Day 1 through Day 7+)
  - State transition tracking (`STABLE`, `PHYSIOLOGICAL_DECLINE`, `DATA_QUALITY_ALERT`, `COGNITIVE_RISK_ELEVATED`)
  - Calibrated 30-day deterioration risk prediction with SHAP explainability
  - Interactive What-If counterfactual intervention simulator
  - Dynamic streaming ingestion (Day 8+)
  - HL7 FHIR R4 Bundle and JSON clinical exports
* **Run Command**:
  ```bash
  python -m streamlit run frontend/streamlit/Home.py
  ```

---

## 2. React Web Portal (`frontend/react/`)
* **Framework**: Vite + React 18 + Tailwind CSS + Recharts
* **Target Audience**: Primary care clinics and patient self-assessment
* **Key Features**:
  - Patient self-screening battery (speech pause analysis, trail tracing, memory recall)
  - Responsive Digital Twin portal view (`/twin`)
  - Modern card-based UI with interactive Recharts time series
  - Real-time client-side What-If intervention simulation
* **Run Command**:
  ```bash
  cd frontend/react && npm run dev
  ```
