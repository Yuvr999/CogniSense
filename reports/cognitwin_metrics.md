# CogniTwin Model Evaluation Report
- **Model Version**: `v1.0.0-poc`
- **Generated**: `2026-10-09 07:56:34 UTC`
- **Target**: `cognitive_deterioration_30d` (Simulated 30-Day Cognitive Deterioration)
- **Cohort Size**: 1,000 synthetic patient profiles (grouped split, no data leakage)

## 5-Fold Stratified Cross-Validation Results

| Metric | Score | Clinical / Technical Interpretation |
|---|---|---|
| **ROC-AUC** | **0.982** | Strong discriminative ability between deteriorating vs stable trajectories |
| **PR-AUC** | **0.936** | Area under precision-recall curve on positive event cohort |
| **Brier Score** | **0.044** | Platt sigmoid calibrated probabilistic accuracy (lower is better, <0.20 is good) |
| **Accuracy** | **0.949** | Overall classification accuracy at standard 0.50 cutoff |
| **Sensitivity (Recall)** | **0.847** | Detection rate of at-risk deteriorating individuals |
| **Specificity** | **0.980** | True negative rate, guarding against false alarms in stable patients |
| **F1 Score** | **0.886** | Harmonic mean of precision and recall |

## Safeguards & Compliance Notes
1. **No Target Leakage**: Model features strictly use observation window data up to prediction timestamp.
2. **Subject Grouping**: All folds split strictly by patient ID (`patient_id`), preventing cross-temporal leakage.
3. **Calibrated Probabilities**: Sigmoid Platt calibration produces credible posterior probabilities and confidence intervals.
4. **Synthetic Data Disclosure**: Benchmarks evaluated on synthetic digital twin distributions for algorithm prototyping.
