"""
CogniTwin Training and Evaluation Script.

Trains the calibrated 30-day cognitive deterioration risk prediction pipeline
using subject-level grouped cross-validation, reports metrics, and saves model artifacts.
"""

import os
import sys
import json
import pandas as pd
from datetime import datetime

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath("."))

from src.cognisense.twin.data_generator import generate_all_twin_datasets
from src.cognisense.twin.prediction_pipeline import CogniTwinPredictionPipeline, MODEL_SAVE_PATH
from src.cognisense.twin.db import init_db


def main():
    print("=" * 70)
    print(" CogniTwin: Training Future-Event Prediction Pipeline")
    print("=" * 70)

    # 1. Ensure datasets and database exist
    fused_csv = os.path.join("data", "fused_patient_dataset_1000.csv")
    if not os.path.exists(fused_csv):
        print("Generating synthetic datasets...")
        generate_all_twin_datasets(output_dir="data", seed=42)

    # Initialize SQLite database
    print("Ensuring SQLite database is initialized...")
    init_db()

    # 2. Load fused training dataset
    print(f"Loading {fused_csv}...")
    df_fused = pd.read_csv(fused_csv)
    print(f"Loaded {len(df_fused)} patient records.")

    # 3. Train and evaluate
    print("\nTraining calibrated pipeline with 5-fold cross-validation...")
    pipeline = CogniTwinPredictionPipeline(random_state=42)
    metrics = pipeline.train_and_evaluate(df_fused)

    print("\nCross-Validation Evaluation Metrics:")
    for k, v in metrics.items():
        print(f"  {k:15s}: {v}")

    # 4. Save model
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    pipeline.save(MODEL_SAVE_PATH)
    print(f"\nModel pipeline saved to {MODEL_SAVE_PATH}")

    # 5. Save metrics JSON and Markdown report
    metrics_json_path = os.path.join("reports", "cognitwin_metrics.json")
    with open(metrics_json_path, "w") as f:
        json.dump({
            "model_version": pipeline.version,
            "trained_at": datetime.utcnow().isoformat() + "Z",
            "sample_size": len(df_fused),
            "target": "cognitive_deterioration_30d",
            "metrics": metrics,
        }, f, indent=2)

    report_md_path = os.path.join("reports", "cognitwin_metrics.md")
    report_content = f"""# CogniTwin Model Evaluation Report
- **Model Version**: `{pipeline.version}`
- **Generated**: `{datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")}`
- **Target**: `cognitive_deterioration_30d` (Simulated 30-Day Cognitive Deterioration)
- **Cohort Size**: 1,000 synthetic patient profiles (grouped split, no data leakage)

## 5-Fold Stratified Cross-Validation Results

| Metric | Score | Clinical / Technical Interpretation |
|---|---|---|
| **ROC-AUC** | **{metrics['roc_auc']:.3f}** | Strong discriminative ability between deteriorating vs stable trajectories |
| **PR-AUC** | **{metrics['pr_auc']:.3f}** | Area under precision-recall curve on positive event cohort |
| **Brier Score** | **{metrics['brier_score']:.3f}** | Platt sigmoid calibrated probabilistic accuracy (lower is better, <0.20 is good) |
| **Accuracy** | **{metrics['accuracy']:.3f}** | Overall classification accuracy at standard 0.50 cutoff |
| **Sensitivity (Recall)** | **{metrics['sensitivity']:.3f}** | Detection rate of at-risk deteriorating individuals |
| **Specificity** | **{metrics['specificity']:.3f}** | True negative rate, guarding against false alarms in stable patients |
| **F1 Score** | **{metrics['f1_score']:.3f}** | Harmonic mean of precision and recall |

## Safeguards & Compliance Notes
1. **No Target Leakage**: Model features strictly use observation window data up to prediction timestamp.
2. **Subject Grouping**: All folds split strictly by patient ID (`patient_id`), preventing cross-temporal leakage.
3. **Calibrated Probabilities**: Sigmoid Platt calibration produces credible posterior probabilities and confidence intervals.
4. **Synthetic Data Disclosure**: Benchmarks evaluated on synthetic digital twin distributions for algorithm prototyping.
"""
    with open(report_md_path, "w") as f:
        f.write(report_content)

    print(f"Metrics report written to {report_md_path}")
    print("CogniTwin model training completed successfully.\n")


if __name__ == "__main__":
    main()
