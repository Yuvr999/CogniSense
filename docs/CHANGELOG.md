# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Tabular Risk Screening Pipeline**: Integrated a complete, leakage-safe multimodal tabular risk screening pipeline (`src/cognisense/models/screening_pipeline.py` & `src/cognisense/models/screening_model.py`) featuring clinical domain feature engineering, Stratified 5-Fold cross-validation, and Platt scaling probability calibration.
- **Reproducible Training & Audit Reports**: Added `scripts/train_screening_model.py` generating auditable metrics (`reports/screening_metrics.json`) and serialized model artifacts (`alzheimers_risk_model.pkl`).
- **Online FastAPI Screening Endpoint**: Added `/v1/screen/tabular-risk` endpoint to `src/cognisense/api/main.py` with Pydantic validation schemas (`TabularRiskInput`, `TabularRiskResult`) and non-diagnostic clinical decision support guidance.
- **Automated Test Suite**: Added `tests/test_screening_pipeline.py` covering synthetic generation, leakage prevention, domain feature engineering, probability calibration, risk tiering, and API integration.
- **Frontend F0**: Setup Vite + React 18 + Tailwind v4 + MSW with `patient`, `clinic`, and `landing` density modes.
- **Frontend F1**: Built core design system components (RiskTierBadge, IntervalBar, TiltCard, NavPill, DataQualityBanner, etc.) matching calm-variant specs.
- **Frontend F2**: Assembled the Landing Page (`/`) with scroll animations, tabbed previews, and dynamic mock metric evaluation displays.
- **Frontend F3**: Implemented the Patient Screening Flow (`/screen`) powered by a Zustand state machine containing Mic checks, trace tasks, and memory recall, without persisting PHI to storage.
- **Frontend F4**: Built the Clinician Dashboard (`/clinic`) featuring queue list, KPI strips, horizontal contribution charts (SHAP), cognitive domain z-score bars, speech pause timelines, and interactive threshold simulations.
- **Multilingual Support**: Added LanguageSwitcher button and i18next support for English, Hindi (हिन्दी), and Marathi (मराठी) across the patient screening flow, landing page, and clinician dashboard with localized memory word lists.
- **Pune Nearest Clinic Finder & Interactive Map (`/clinics`)**: Integrated a dedicated clinic locator and interactive Leaflet map featuring verified memory clinics, geriatric care units, and tertiary neurology hospitals across Pune (Deenanath Mangeshkar, Ruby Hall, Jehangir, Sahyadri, KEM, Manipal Kharadi/Baner, Bharati Hospital). Supports GPS proximity calculation, Pune Standard Center reference, multilingual hospital details (मराठी, हिन्दी, English), zone filtering, and integrated post-screening recommendation cards.
- **Frontend F5 (Evidence, Fairness, and Privacy Pages)**: Implemented dedicated routes and pages for Evidence (`/evidence`), Fairness Audit (`/evidence/fairness`, `/fairness`), and Privacy & Compliance (`/privacy`) with interactive Recharts visualizations, subgroup audits, proxy probes, GDPR right-to-erasure simulation, and immutable audit logs. Updated `ClinicLayout` and `routes.tsx` with client-side SPA navigation.
- **CogniTwin (Digital Twin Architecture - Happiest Health CRP Challenge 2026)**:
  - **Synthetic Multimodal Datasets**: Implemented generator for `ehr_static_1000.csv`, `wearable_timeseries_7days_7000.csv`, `fused_patient_dataset_1000.csv`, `patient_daily_state.csv`, and `future_events.csv`.
  - **Daily Patient State Engine**: Time-indexed state representation computing 3-day and 7-day rolling means, slopes, personal baseline deviations, and deterministic state transitions (Stable, Physiological Decline, Data Quality Alert, Elevated Cognitive Risk).
  - **Persistent SQLite Storage**: SQLite database (`data/cognitwin.db`) maintaining longitudinal records, observations, states, and prediction audit logs.
  - **Calibrated Future-Event Prediction Pipeline**: 30-day cognitive deterioration prediction (`cognitive_deterioration_30d`) with Platt scaling, 95% Wilson confidence intervals, and SHAP-based feature attributions. Evaluated with 5-fold grouped cross-validation (ROC-AUC 0.982, PR-AUC 0.936, Brier 0.044).
  - **What-If Intervention Simulator**: Real-time counterfactual model sensitivity simulation for sleep duration, physical steps, autonomic HRV, and medication adherence.
  - **Clinician Dashboards**: Upgraded Streamlit dashboard (`app/pages/2_Clinician_Dashboard.py`) with timeline scrubber, interactive Plotly charts, state transition diffs, and export options; created React web portal view (`web/src/pages/DigitalTwin.tsx` at `/twin`).
  - **REST API Endpoints**: Full FastAPI suite (`/v1/twin/...`) supporting patient retrieval, streaming ingestion, state inspection, predictions, and simulation.
  - **Comprehensive Test Suite**: Automated verification in `tests/test_digital_twin.py` (8 passing unit & integration tests) and judge demonstration CLI (`scripts/run_twin_demo.py`).

