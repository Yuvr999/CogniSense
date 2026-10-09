"""
CogniSense Tabular Alzheimer's Screening Model.

Encapsulates calibrated model training, cross-validation evaluation,
risk tier categorization, and patient-level risk inference.
"""

import os
from typing import Any, Dict, List, Optional, Union
import joblib
import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    brier_score_loss,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline

from src.cognisense.models.screening_pipeline import (
    ClinicalDomainFeatureEngineer,
    build_tabular_preprocessor,
)


class TabularRiskScreeningModel:
    """
    Production-grade tabular risk screening model for Alzheimer's screening prototype.
    Adheres strictly to clinical screening guidelines (screening aid, not a diagnosis).
    """

    def __init__(
        self,
        base_estimator: Optional[Any] = None,
        calibrate: bool = True,
        random_state: int = 42,
    ):
        self.random_state = random_state
        self.calibrate = calibrate

        if base_estimator is None:
            self.base_estimator = LogisticRegression(
                class_weight="balanced",
                max_iter=1000,
                random_state=random_state,
            )
        else:
            self.base_estimator = base_estimator

        self.full_pipeline: Optional[Pipeline] = None
        self.feature_names_: List[str] = []
        self.is_fitted: bool = False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "TabularRiskScreeningModel":
        """
        Fit the end-to-end preprocessing, feature engineering, and calibrated model pipeline.
        """
        # Exclude leakage features if inadvertently passed
        leakage_cols = ["Person_ID", "Risk_Score", "Early_Alzheimer_Risk"]
        X_clean = X.drop(columns=[c for c in leakage_cols if c in X.columns])
        self.feature_names_ = X_clean.columns.tolist()

        fe = ClinicalDomainFeatureEngineer(add_features=True)
        X_fe_sample = fe.fit_transform(X_clean)
        preprocessor, _, _ = build_tabular_preprocessor(X_fe_sample)

        if self.calibrate:
            # Calibrate the classifier using Platt scaling (sigmoid)
            classifier_step = CalibratedClassifierCV(
                estimator=self.base_estimator,
                method="sigmoid",
                cv=5,
            )
        else:
            classifier_step = self.base_estimator

        self.full_pipeline = Pipeline(
            steps=[
                ("fe", ClinicalDomainFeatureEngineer(add_features=True)),
                ("preprocessor", preprocessor),
                ("classifier", classifier_step),
            ]
        )

        self.full_pipeline.fit(X_clean, y)
        self.is_fitted = True
        return self

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict calibrated probabilities [P(lower_risk), P(higher_risk)].
        """
        if not self.is_fitted or self.full_pipeline is None:
            raise RuntimeError("Model is not fitted. Call fit() or load() first.")

        leakage_cols = ["Person_ID", "Risk_Score", "Early_Alzheimer_Risk"]
        X_clean = X.drop(columns=[c for c in leakage_cols if c in X.columns])
        return self.full_pipeline.predict_proba(X_clean)

    def predict(self, X: pd.DataFrame, threshold: float = 0.5) -> np.ndarray:
        """Predict binary risk label (0=Lower Risk, 1=Higher Risk)."""
        probs = self.predict_proba(X)[:, 1]
        return (probs >= threshold).astype(int)

    def predict_patient_record(self, patient_data: Union[pd.DataFrame, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Inference function for a single patient record with risk categorization
        and clinical disclaimer.
        """
        if isinstance(patient_data, dict):
            df_patient = pd.DataFrame([patient_data])
        else:
            df_patient = patient_data.copy()

        probs = self.predict_proba(df_patient)[0]
        prob_high = float(probs[1])
        prob_low = float(probs[0])
        pred_class = int(prob_high >= 0.5)

        if prob_high < 0.35:
            tier = "low"
            category_label = "Low Risk"
            recommendation = "Reassure patient; schedule routine cognitive check in 12-24 months."
        elif prob_high < 0.65:
            tier = "moderate"
            category_label = "Moderate Risk"
            recommendation = "Recommend closer clinical follow-up, lifestyle interventions, and formal cognitive assessment (e.g. MoCA)."
        else:
            tier = "high"
            category_label = "Higher Risk"
            recommendation = "Recommend comprehensive neuropsychological evaluation and specialist referral."

        return {
            "predicted_class": pred_class,
            "probability_higher_risk": round(prob_high, 4),
            "probability_lower_risk": round(prob_low, 4),
            "tier": tier,
            "category_label": category_label,
            "recommendation": recommendation,
            "disclaimer": "Screening aid, not a diagnosis. Intended for clinical decision support.",
        }

    def evaluate_cv(
        self, X: pd.DataFrame, y: pd.Series, cv_splits: int = 5
    ) -> Dict[str, float]:
        """
        Evaluate performance across Stratified K-Fold CV.
        """
        leakage_cols = ["Person_ID", "Risk_Score", "Early_Alzheimer_Risk"]
        X_clean = X.drop(columns=[c for c in leakage_cols if c in X.columns])

        skf = StratifiedKFold(n_splits=cv_splits, shuffle=True, random_state=self.random_state)
        scoring = {
            "accuracy": "accuracy",
            "precision": "precision",
            "recall": "recall",
            "f1": "f1",
            "roc_auc": "roc_auc",
        }

        # Build a temporary pipeline to cross-validate
        fe = ClinicalDomainFeatureEngineer(add_features=True)
        X_fe_sample = fe.fit_transform(X_clean)
        preprocessor, _, _ = build_tabular_preprocessor(X_fe_sample)

        pipeline = Pipeline(
            steps=[
                ("fe", ClinicalDomainFeatureEngineer(add_features=True)),
                ("preprocessor", preprocessor),
                ("classifier", self.base_estimator),
            ]
        )

        cv_results = cross_validate(pipeline, X_clean, y, cv=skf, scoring=scoring, n_jobs=-1)

        return {
            "accuracy": float(np.mean(cv_results["test_accuracy"])),
            "precision": float(np.mean(cv_results["test_precision"])),
            "recall": float(np.mean(cv_results["test_recall"])),
            "f1": float(np.mean(cv_results["test_f1"])),
            "roc_auc": float(np.mean(cv_results["test_roc_auc"])),
            "roc_auc_std": float(np.std(cv_results["test_roc_auc"])),
        }

    def save(self, filepath: str) -> None:
        """Save fitted model and metadata to disk."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        payload = {
            "full_pipeline": self.full_pipeline,
            "feature_names": self.feature_names_,
            "calibrate": self.calibrate,
            "random_state": self.random_state,
            "metadata": {
                "version": "1.0.0",
                "type": "CogniSense Tabular Risk Screening Model",
                "disclaimer": "Screening aid, not a diagnosis.",
            },
        }
        joblib.dump(payload, filepath)

    @classmethod
    def load(cls, filepath: str) -> "TabularRiskScreeningModel":
        """Load a saved model pipeline from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        payload = joblib.load(filepath)
        instance = cls(
            calibrate=payload.get("calibrate", True),
            random_state=payload.get("random_state", 42),
        )
        instance.full_pipeline = payload["full_pipeline"]
        instance.feature_names_ = payload.get("feature_names", [])
        instance.is_fitted = True
        return instance
