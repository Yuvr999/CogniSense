# 📊 CogniSense / CogniTwin Datasets

This directory contains the synthetic multimodal longitudinal datasets, persistent SQLite database, and intermediate observation tables supporting the Patient Digital Twin prototype.

## 📋 Dataset Catalog

| File | Description | Cohort Size | Schema Highlights |
| :--- | :--- | :--- | :--- |
| **`ehr_static_1000.csv`** | Static Electronic Health Records | 1,000 synthetic patient profiles | 13 features: Age, Education, Hypertension, Diabetes, Dyslipidemia, Prior MCI, Vitamin B12, TSH, Cholesterol, Baseline MoCA, Medication Adherence, Family History, APOE-e4. |
| **`wearable_timeseries_7days_7000.csv`** | Longitudinal Smartwatch Telemetry | 7,000 daily observations (7 days/patient) | 12 features: Day, Mean HRV (ms), Resting Heart Rate (bpm), Total Sleep (hrs), Deep Sleep (hrs), REM Sleep (hrs), Steps, Activity Minutes, Sensor Data Quality Score. |
| **`fused_patient_dataset_1000.csv`** | Multimodal Fused Training Dataset | 1,000 joined patient feature vectors | Fused 13 static EHR features + 12 dynamic rolling/slope wearable features + target outcome. |
| **`future_events.csv`** | Future Deterioration Event Labels | 1,000 patient records | Target: `cognitive_deterioration_30d` (binary indicator for $\ge 2$-point MoCA decline within 30 days). |
| **`patient_daily_state.csv`** | Daily Computational Twin States | 7,000 time-indexed records | Rolling 3-day/7-day means, slopes, baseline deviations, and deterministic state classifications. |
| **`twin_state_history.csv`** | State Transition Audit Trail | Historical state timeline | Time-indexed state transitions and qualifying physiological trigger flags. |
| **`alzheimers_early_detection_1000.csv`** | Tabular Screening Cohort | 1,000 synthetic patient records | 47 demographic, lifestyle, and cognitive screening features. |
| **`cognitwin.db`** | Persistent SQLite Store | Production database | Relational tables for patients, observations, states, predictions, and audit events. |

## 🔒 Data Privacy & Compliance Safeguards
1. **Zero Real Patient Data**: All records are generated synthetically using statistically calibrated clinical distributions for research and prototyping.
2. **License Adherence**: Raw datasets from ADReSS, ADNI, and DementiaBank are strictly excluded and ignored via `.gitignore` (`data/raw/`, `data/interim/`).
3. **No Target Leakage**: Latent generator variables (`synthetic_event_probability`, `latent_risk`, `Risk_Score`) are explicitly dropped before cross-validation.
4. **Subject Grouping**: All machine learning splits strictly partition by `patient_id` to prevent cross-temporal leakage.

> **Regulatory Disclaimer**: Screening aid, not a diagnosis. Synthetic research prototype for algorithm benchmarking.
