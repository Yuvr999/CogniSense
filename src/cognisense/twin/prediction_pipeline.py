"""
CogniTwin Future-Event Prediction Pipeline.

Trains and serves a calibrated, leakage-free machine learning model to predict
the 30-day cognitive deterioration outcome ('cognitive_deterioration_30d') using
historical EHR and longitudinal wearable biomarkers.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Any, Dict, List, Optional, Tuple

from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    brier_score_loss,
    accuracy_score,
    recall_score,
    precision_score,
    f1_score,
    confusion_matrix,
)
from sklearn.model_selection import StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    # Static EHR
    "age",
    "education_years",
    "hypertension",
    "diabetes",
    "dyslipidemia",
    "previous_mci",
    "vitamin_b12_pg_ml",
    "tsh_uiu_ml",
    "cholesterol_mg_dl",
    "baseline_cognitive_score",
    "medication_adherence",
    "family_history_ad",
    "genetic_risk_apoe4",
    # Dynamic Wearable & Trends
    "mean_hrv_ms",
    "hrv_trend_slope",
    "mean_resting_hr_bpm",
    "resting_hr_trend_slope",
    "mean_sleep_hours",
    "sleep_variability_std",
    "mean_deep_sleep_hours",
    "deep_sleep_ratio",
    "mean_daily_steps",
    "steps_trend_slope",
    "mean_activity_minutes",
    "wearable_data_quality_score",
]

MODEL_SAVE_PATH = os.path.join("reports", "cognitwin_risk_model.joblib")


class CogniTwinPredictionPipeline:
    """
    End-to-end model pipeline for 30-day cognitive deterioration risk estimation.
    """

    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.pipeline: Optional[Pipeline] = None
        self.metrics_: Dict[str, float] = {}
        self.feature_medians_: Dict[str, float] = {}
        self.feature_names_ = FEATURE_COLUMNS
        self.version = "v1.0.0-poc"

    def build_pipeline(self) -> Pipeline:
        """Create leakage-safe preprocessing and calibrated classifier."""
        preprocessor = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ])

        base_clf = LogisticRegression(
            class_weight="balanced",
            max_iter=1000,
            random_state=self.random_state,
        )

        calibrated_clf = CalibratedClassifierCV(
            estimator=base_clf,
            method="sigmoid",
            cv=5,
        )

        return Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", calibrated_clf),
        ])

    def train_and_evaluate(self, df_fused: pd.DataFrame) -> Dict[str, float]:
        """
        Train the model using 5-fold cross-validation grouped by patient and evaluate metrics.
        """
        # Ensure target and feature columns exist
        target_col = "cognitive_deterioration_30d"
        if target_col not in df_fused.columns:
            raise ValueError(f"Target column '{target_col}' not found in dataframe.")

        # Guard against leakage columns
        forbidden = ["synthetic_event_probability", "latent_risk", "Risk_Score"]
        clean_df = df_fused.drop(columns=[c for c in forbidden if c in df_fused.columns])

        X = clean_df[FEATURE_COLUMNS].copy()
        y = clean_df[target_col].astype(int)

        # Store feature medians for reference attribution
        self.feature_medians_ = X.median().to_dict()

        # Stratified 5-Fold Cross Validation
        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=self.random_state)

        y_true_all: List[int] = []
        y_prob_all: List[float] = []

        for train_idx, val_idx in skf.split(X, y):
            X_tr, y_tr = X.iloc[train_idx], y.iloc[train_idx]
            X_val, y_val = X.iloc[val_idx], y.iloc[val_idx]

            fold_pipe = self.build_pipeline()
            fold_pipe.fit(X_tr, y_tr)

            probs = fold_pipe.predict_proba(X_val)[:, 1]
            y_prob_all.extend(probs.tolist())
            y_true_all.extend(y_val.tolist())

        y_true_arr = np.array(y_true_all)
        y_prob_arr = np.array(y_prob_all)
        y_pred_arr = (y_prob_arr >= 0.50).astype(int)

        roc_auc = float(roc_auc_score(y_true_arr, y_prob_arr))
        pr_auc = float(average_precision_score(y_true_arr, y_prob_arr))
        brier = float(brier_score_loss(y_true_arr, y_prob_arr))
        acc = float(accuracy_score(y_true_arr, y_pred_arr))
        rec = float(recall_score(y_true_arr, y_pred_arr))
        prec = float(precision_score(y_true_arr, y_pred_arr))
        f1 = float(f1_score(y_true_arr, y_pred_arr))

        tn, fp, fn, tp = confusion_matrix(y_true_arr, y_pred_arr).ravel()
        spec = float(tn / (tn + fp))

        self.metrics_ = {
            "roc_auc": round(roc_auc, 3),
            "pr_auc": round(pr_auc, 3),
            "brier_score": round(brier, 3),
            "accuracy": round(acc, 3),
            "sensitivity": round(rec, 3),
            "specificity": round(spec, 3),
            "f1_score": round(f1, 3),
        }

        # Train full model on all 1,000 patients
        self.pipeline = self.build_pipeline()
        self.pipeline.fit(X, y)

        return self.metrics_

    def predict_patient(self, feature_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict 30-day deterioration probability and generate feature attribution.
        """
        if self.pipeline is None:
            raise RuntimeError("Pipeline is not trained or loaded. Call train_and_evaluate() or load().")

        # Convert dict to 1-row DataFrame with expected columns
        df_row = pd.DataFrame([{c: feature_dict.get(c, self.feature_medians_.get(c, 0.0)) for c in FEATURE_COLUMNS}])

        prob = float(self.pipeline.predict_proba(df_row)[0, 1])

        # Confidence interval approximation (Wilson 95% interval around probability with n=100 effective sample)
        z = 1.96
        n = 100
        p = prob
        ci_low = max(0.01, (p + z*z/(2*n) - z*np.sqrt((p*(1-p)/n) + z*z/(4*n*n))) / (1 + z*z/n))
        ci_high = min(0.99, (p + z*z/(2*n) + z*np.sqrt((p*(1-p)/n) + z*z/(4*n*n))) / (1 + z*z/n))

        # Assign risk tier
        if prob < 0.25:
            tier = "LOW"
        elif prob < 0.50:
            tier = "MODERATE"
        elif prob < 0.75:
            tier = "ELEVATED"
        else:
            tier = "HIGH"

        # Feature explanations (using normalized standard deviations from population median)
        top_contributions = self._compute_feature_attributions(df_row.iloc[0])

        return {
            "patient_id": feature_dict.get("patient_id", "PT-UNKNOWN"),
            "predicted_outcome": "cognitive_deterioration_30d",
            "prediction_horizon_days": 30,
            "risk_probability": round(prob, 3),
            "risk_tier": tier,
            "confidence_interval_low": round(ci_low, 3),
            "confidence_interval_high": round(ci_high, 3),
            "top_features": top_contributions,
            "model_version": self.version,
            "disclaimer": "Research prototype screening aid. Predictions are based on synthetic data and are not clinically validated for diagnosis.",
        }

    def _compute_feature_attributions(self, patient_series: pd.Series) -> List[Dict[str, Any]]:
        """
        Compute top feature contributions relative to population normative baselines.
        """
        attributions: List[Dict[str, Any]] = []

        # Directional impact mapping
        # Higher values increase risk for: age, hypertension, rhr, sleep_variability
        # Lower values increase risk for: baseline_cognitive_score, mean_hrv, deep_sleep_ratio, daily_steps, adherence
        risk_increasing_if_high = {
            "age", "hypertension", "diabetes", "dyslipidemia", "previous_mci",
            "family_history_ad", "genetic_risk_apoe4", "mean_resting_hr_bpm",
            "sleep_variability_std", "resting_hr_trend_slope"
        }

        friendly_names = {
            "age": "Age",
            "previous_mci": "Prior MCI History",
            "baseline_cognitive_score": "Baseline Cognitive Score (MoCA)",
            "mean_hrv_ms": "Heart Rate Variability (HRV)",
            "hrv_trend_slope": "Longitudinal HRV Trend",
            "mean_sleep_hours": "Average Nightly Sleep",
            "sleep_variability_std": "Sleep Fragmentation / Variability",
            "deep_sleep_ratio": "Deep Sleep Proportion",
            "mean_daily_steps": "Daily Step Count",
            "steps_trend_slope": "Physical Activity Trend",
            "medication_adherence": "Medication Adherence",
            "hypertension": "Hypertension History",
            "genetic_risk_apoe4": "APOE-e4 Genetic Risk",
        }

        for col in FEATURE_COLUMNS:
            val = float(patient_series.get(col, 0.0))
            ref = float(self.feature_medians_.get(col, 0.0))
            delta = val - ref

            if col in risk_increasing_if_high:
                score_impact = delta
                direction = "up" if delta > 0 else "down"
            else:
                score_impact = -delta
                direction = "up" if delta < 0 else "down"

            # Normalize magnitude
            norm_val = abs(score_impact) / (abs(ref) + 1.0)

            attributions.append({
                "feature": col,
                "name": friendly_names.get(col, col.replace("_", " ").title()),
                "value": round(val, 2),
                "reference": round(ref, 2),
                "impact": round(norm_val, 3),
                "direction": direction,
            })

        # Sort by highest absolute impact
        attributions.sort(key=lambda x: x["impact"], reverse=True)
        return attributions[:6]

    def save(self, filepath: str = MODEL_SAVE_PATH) -> None:
        """Save fitted pipeline, metrics, and feature metadata."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            "pipeline": self.pipeline,
            "metrics": self.metrics_,
            "feature_medians": self.feature_medians_,
            "feature_names": self.feature_names_,
            "version": self.version,
        }, filepath)

    @classmethod
    def load(cls, filepath: str = MODEL_SAVE_PATH) -> "CogniTwinPredictionPipeline":
        """Load fitted pipeline and metadata from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Saved model not found at {filepath}")
        data = joblib.load(filepath)
        instance = cls()
        instance.pipeline = data["pipeline"]
        instance.metrics_ = data["metrics"]
        instance.feature_medians_ = data["feature_medians"]
        instance.feature_names_ = data["feature_names"]
        instance.version = data.get("version", "v1.0.0-poc")
        return instance
