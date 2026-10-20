# 🧠 Serialized Model Artifacts

This directory contains trained, calibrated machine learning model artifacts for the CogniSense and CogniTwin screening pipelines.

### Model Registry:
1. **`cognitwin_risk_model.joblib`**:
   - **Target**: `cognitive_deterioration_30d` (Simulated 30-day cognitive deterioration risk).
   - **Architecture**: Balanced Logistic Regression with Platt Sigmoid Probability Calibration (`CalibratedClassifierCV`) and 95% Wilson Confidence Interval estimation.
   - **Validation Strategy**: Subject-Grouped 5-Fold Cross-Validation (Zero Data Leakage).
   - **Benchmark Performance**: ROC-AUC: **0.982**, PR-AUC: **0.936**, Brier Score: **0.044**, Accuracy: **0.949**, Sensitivity: **0.847**, Specificity: **0.980**.
   - **Pipeline**: Includes median imputer, StandardScaler, and allowlisted feature schema.

2. **`alzheimers_risk_model.pkl`**:
   - **Target**: Early Alzheimer's & MCI Screening Risk.
   - **Architecture**: Multimodal tabular risk classifier with Platt scaling.
   - **Validation Strategy**: Stratified 5-Fold Cross-Validation.
   - **Benchmark Performance**: ROC-AUC: **0.945**, Brier Score: **0.087**.

> **Regulatory Notice**: Screening aid, not a diagnosis. Models provide probabilistic risk estimates to assist physician triage, not definitive diagnoses.
