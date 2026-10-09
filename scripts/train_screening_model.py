"""
CogniSense - Training & Evaluation Pipeline for Tabular Alzheimer's Screening Model.
====================================================================================
Generates reproducible benchmarks, metrics, and serialized model artifacts.
All metrics are stored under /reports for auditability and governance.
"""

import json
import os
import sys
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    brier_score_loss,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

from src.cognisense.data.synthetic import generate_tabular_risk_dataset
from src.cognisense.models.screening_model import TabularRiskScreeningModel


def train_and_evaluate_screening_model(
    data_csv: str = "alzheimers_early_detection_1000.csv",
    output_model_path: str = "alzheimers_risk_model.pkl",
    metrics_path: str = "reports/screening_metrics.json",
    seed: int = 42,
) -> dict:
    """
    Train, cross-validate, and test the tabular Alzheimer's screening model.
    """
    print(f"Loading/generating dataset (seed={seed})...")
    if os.path.exists(data_csv):
        df = pd.read_csv(data_csv)
    else:
        df = generate_tabular_risk_dataset(n_samples=1000, seed=seed, include_leakage_columns=False)
        df.to_csv(data_csv, index=False)

    # Prevent target leakage
    leakage_cols = ["Person_ID", "Risk_Score", "Early_Alzheimer_Risk"]
    X = df.drop(columns=[c for c in leakage_cols if c in df.columns])
    y = df["Early_Alzheimer_Risk"]

    # Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=seed, stratify=y
    )

    # Initialize model
    model = TabularRiskScreeningModel(calibrate=True, random_state=seed)

    # 1. 5-Fold Stratified Cross-Validation on Training Set
    print("Running Stratified 5-Fold Cross Validation on Train Set...")
    cv_metrics = model.evaluate_cv(X_train, y_train, cv_splits=5)

    # 2. Fit on full training partition
    print("Fitting calibrated pipeline on training partition...")
    model.fit(X_train, y_train)

    # 3. Final Evaluation on untouched test set
    print("Evaluating on untouched test partition...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    test_metrics = {
        "test_accuracy": float(accuracy_score(y_test, y_pred)),
        "test_precision": float(precision_score(y_test, y_pred)),
        "test_recall": float(recall_score(y_test, y_pred)),
        "test_f1": float(f1_score(y_test, y_pred)),
        "test_roc_auc": float(roc_auc_score(y_test, y_prob)),
        "test_brier_score": float(brier_score_loss(y_test, y_prob)),
    }

    # Save Model
    print(f"Saving model to {output_model_path}...")
    model.save(output_model_path)

    # Also save copy in reports/
    reports_model_path = os.path.join("reports", "alzheimers_risk_model.pkl")
    model.save(reports_model_path)

    # Save Metrics Report
    os.makedirs(os.path.dirname(os.path.abspath(metrics_path)), exist_ok=True)
    full_report = {
        "dataset_samples": len(df),
        "n_features": X.shape[1],
        "random_seed": seed,
        "cv_5fold_train_metrics": cv_metrics,
        "test_holdout_metrics": test_metrics,
        "disclaimer": "Screening aid, not a diagnosis. Synthetic research prototype.",
    }

    with open(metrics_path, "w") as f:
        json.dump(full_report, f, indent=4)

    print(f"Metrics saved to {metrics_path}")
    print("\n--- Summary Results ---")
    print(f"Train 5-Fold CV ROC-AUC: {cv_metrics['roc_auc']:.4f} (±{cv_metrics['roc_auc_std']:.4f})")
    print(f"Test Holdout ROC-AUC:    {test_metrics['test_roc_auc']:.4f}")
    print(f"Test Holdout Recall:     {test_metrics['test_recall']:.4f}")
    print(f"Test Holdout Precision:  {test_metrics['test_precision']:.4f}")
    print(f"Test Holdout F1-Score:   {test_metrics['test_f1']:.4f}")

    return full_report


if __name__ == "__main__":
    train_and_evaluate_screening_model()
