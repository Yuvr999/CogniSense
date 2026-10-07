import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import StratifiedGroupKFold, cross_val_predict
from sklearn.metrics import roc_auc_score, brier_score_loss, classification_report
import json
import os

class NeuropsychModel:
    def __init__(self, random_state=42):
        self.random_state = random_state
        self.pipeline = Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(
                penalty='elasticnet', 
                solver='saga', 
                l1_ratio=0.5, 
                random_state=random_state, 
                max_iter=1000, 
                class_weight='balanced'
            ))
        ])
        # Use sigmoid/Platt scaling for calibration (good for small n)
        self.calibrated_model = CalibratedClassifierCV(
            estimator=self.pipeline, 
            method='sigmoid', 
            cv=5
        )
        self.features = None
        
    def fit(self, X: pd.DataFrame, y: pd.Series, groups=None):
        """
        Fits the model. y should be binary (e.g. 0 for CN, 1 for MCI).
        """
        self.features = X.columns.tolist()
        self.calibrated_model.fit(X, y)
        return self
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.calibrated_model.predict_proba(X)
        
    def predict(self, X: pd.DataFrame, threshold: float = 0.5) -> np.ndarray:
        probs = self.predict_proba(X)[:, 1]
        return (probs >= threshold).astype(int)

    def evaluate(self, X: pd.DataFrame, y: pd.Series, groups: pd.Series) -> dict:
        """
        Evaluates the model using subject-grouped cross-validation to prevent leakage.
        """
        cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=self.random_state)
        
        # We use cross_val_predict to get out-of-fold predictions
        # Note: CalibratedClassifierCV inside cross_val_predict will do nested CV
        # which is correct but might be slow.
        
        preds_proba = cross_val_predict(
            self.calibrated_model, X, y, groups=groups, cv=cv, method='predict_proba'
        )[:, 1]
        
        roc_auc = roc_auc_score(y, preds_proba)
        brier = brier_score_loss(y, preds_proba)
        
        return {
            "roc_auc": float(roc_auc),
            "brier_score": float(brier)
        }

def save_metrics(metrics: dict, path: str = "reports/metrics.json"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(metrics, f, indent=4)
