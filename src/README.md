# CogniTwin Source Library (`src/cognisense/`)

This directory contains the core algorithmic modules, state engines, machine learning pipelines, and data access layers.

## Package Structure

```
src/cognisense/
├── twin/                      # Patient Digital Twin Architecture
│   ├── data_generator.py      # Synthetic EHR, 7-day wearables, and fused datasets
│   ├── db.py                  # Persistent SQLite data access layer
│   ├── state_engine.py        # Daily Patient State Engine & temporal trends
│   ├── prediction_pipeline.py # Calibrated 30-day deterioration ML pipeline
│   ├── simulator.py           # What-If counterfactual intervention simulator
│   └── schemas.py             # Pydantic request and response schemas
├── models/                    # Baseline screening models & fusion
│   ├── screening_model.py     # Tabular screening classifier
│   ├── screening_pipeline.py  # Domain feature engineering & preprocessing
│   ├── calibration.py         # Platt / Isotonic probability calibration
│   └── conformal.py           # Conformal prediction uncertainty sets
├── data/                      # Synthetic data generators & loaders
│   └── synthetic.py           # Static tabular & speech feature generators
├── explain/                   # Explainable AI (XAI)
│   ├── shap_utils.py          # SHAP attribution computations
│   └── narrative.py           # Clinician plain-language narratives
├── fairness/                  # Fairness & bias auditing
│   ├── subgroup_metrics.py    # Demographic parity & equalized odds
│   └── proxy_audit.py         # Protected attribute proxy detection
└── privacy/                   # Privacy-by-design & SaMD compliance
    ├── pseudonym.py           # Cryptographic patient pseudonymization
    └── retention.py           # GDPR data retention & right-to-erasure
```
