# Model Card (Phase 4 Synthetic Prototype)

## Model Details
- **Architecture:** Explainable Boosting Machine (EBM) / Logistic Regression Fusion Model.
- **Intended Use:** Screening aid for early detection of MCI (design alignment), **NOT a diagnosis**.
- **Data:** Trained and evaluated strictly on **SYNTHETIC DATA** for Phase 4 pipeline verification.

## Quantitative Analysis
All metrics below are derived from synthetic pipeline tests and are not indicative of real-world clinical performance.
- **Subgroup Fairness Metrics:** Evaluated across Age, Sex, and Education. Refer to `FAIRNESS_REPORT.md` for specific AUROC and indeterminate rate breakdowns. 
- **Overall Synthetic Pipeline AUROC:** (Refer to `reports/metrics.json` when real data is integrated).

## Ethical Considerations
- **Bias Mitigation:** Education-adjusted scoring is used to mitigate known systemic differences in cognitive test performance.
- **Explainability:** Models were chosen for being glass-box (EBM), generating per-feature SHAP attributions rather than relying on opaque deep embeddings.

*Disclaimer: This is a research prototype.*
