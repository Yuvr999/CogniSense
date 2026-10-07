# Datasheet (Phase 4 Synthetic Prototype)

## Motivation
This synthetic dataset was generated exclusively for pipeline testing (Phase 4), allowing parallel development of the Fairness and Privacy modules before receiving access to clinical datasets.

## Composition
- **Total Samples:** N=500 (synthetic)
- **Features:** Simulates linguistic, acoustic, and cognitive features mapped to the digital tasks in the 8-minute protocol.
- **Demographics:** Age, Sex, and Education distributions randomly sampled for fairness auditing.

## Collection Process
- **Data Source:** `src/cognisense/data/synthetic.py`
- **Privacy:** As synthetic data, it contains no Personally Identifiable Information (PII) and no protected health information (PHI).

## Uses
- **Intended Use:** CI/CD testing, module integration (API/Streamlit/Fairness modules), and UI placeholder rendering.
- **Prohibited Uses:** Clinical validation, model performance claims, or diagnostic inference.
