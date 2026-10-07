import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, average_precision_score, confusion_matrix, brier_score_loss, f1_score
from typing import Dict, Any, Tuple
import logging

try:
    from interpret.glassbox import ExplainableBoostingClassifier
except ImportError:
    ExplainableBoostingClassifier = None

def get_pipeline(model_type="lr"):
    if model_type == "lr":
        model = LogisticRegression(penalty='elasticnet', solver='saga', l1_ratio=0.5, random_state=42, max_iter=1000)
    elif model_type == "ebm" and ExplainableBoostingClassifier is not None:
        model = ExplainableBoostingClassifier(random_state=42)
    else:
        # fallback
        model = LogisticRegression(penalty='l2', random_state=42)
        
    return Pipeline([
        ('scaler', StandardScaler()),
        ('model', model)
    ])

def train_and_evaluate(df: pd.DataFrame, target_col: str, group_col: str, feature_cols: list) -> Dict[str, Any]:
    """
    Train with StratifiedGroupKFold, in-fold preprocessing and calibration.
    Computes metrics with bootstrap CIs and flags suspected leakage.
    """
    X = df[feature_cols].values
    y = df[target_col].values
    groups = df[group_col].values
    
    cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
    
    oof_preds = np.zeros(len(y))
    oof_probas = np.zeros(len(y))
    
    # Store models for explanations
    models = []
    
    for train_idx, val_idx in cv.split(X, y, groups):
        X_train, y_train = X[train_idx], y[train_idx]
        X_val, y_val = X[val_idx], y[val_idx]
        
        base_pipeline = get_pipeline(model_type="lr")
        
        # Nested calibration
        calibrated_model = CalibratedClassifierCV(base_pipeline, method='sigmoid', cv=3)
        calibrated_model.fit(X_train, y_train)
        
        probas = calibrated_model.predict_proba(X_val)[:, 1]
        oof_probas[val_idx] = probas
        models.append(calibrated_model)
        
    # Fixed-sensitivity threshold (>= 90%)
    # Sort probas and find threshold that gives 90% sensitivity
    thresholds = np.linspace(0, 1, 100)
    best_thresh = 0.5
    for thresh in thresholds:
        preds = (oof_probas >= thresh).astype(int)
        tn, fp, fn, tp = confusion_matrix(y, preds).ravel()
        sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
        if sensitivity >= 0.90:
            best_thresh = thresh
    
    # Final preds based on threshold
    oof_preds = (oof_probas >= best_thresh).astype(int)
    
    auroc = roc_auc_score(y, oof_probas)
    auprc = average_precision_score(y, oof_probas)
    tn, fp, fn, tp = confusion_matrix(y, oof_preds).ravel()
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    brier = brier_score_loss(y, oof_probas)
    
    # Check leakage
    leakage_flag = auroc > 0.95
    if leakage_flag:
        logging.warning("Suspected data leakage: AUROC > 0.95!")
        
    # Bootstrap CI for AUROC (simple implementation)
    n_bootstraps = 1000
    bootstrapped_aurocs = []
    rng = np.random.RandomState(42)
    for _ in range(n_bootstraps):
        indices = rng.randint(0, len(y), len(y))
        if len(np.unique(y[indices])) < 2:
            continue
        score = roc_auc_score(y[indices], oof_probas[indices])
        bootstrapped_aurocs.append(score)
        
    ci_lower = np.percentile(bootstrapped_aurocs, 2.5) if bootstrapped_aurocs else auroc
    ci_upper = np.percentile(bootstrapped_aurocs, 97.5) if bootstrapped_aurocs else auroc
    
    metrics = {
        "auroc": auroc,
        "auroc_ci": (ci_lower, ci_upper),
        "auprc": auprc,
        "sensitivity_at_operating_point": sensitivity,
        "specificity_at_operating_point": specificity,
        "brier_score": brier,
        "best_threshold": best_thresh,
        "leakage_flag": leakage_flag
    }
    
    return metrics, models, best_thresh

def generate_local_explanation(features: dict, reference_means: dict) -> dict:
    """
    Generate deterministic narrative explanation.
    """
    contributions = []
    # Mocking SHAP/EBM logic for explanation
    for k, v in features.items():
        ref = reference_means.get(k, 0)
        diff = v - ref
        contributions.append({"feature": k, "value": v, "reference": ref, "diff": diff})
        
    # Sort by absolute difference
    contributions.sort(key=lambda x: abs(x["diff"]), reverse=True)
    top_5 = contributions[:5]
    
    narrative_parts = []
    for item in top_5:
        direction = "higher" if item["diff"] > 0 else "lower"
        narrative_parts.append(f"{item['feature']} is {direction} than typical ({item['value']:.2f} vs {item['reference']:.2f})")
        
    narrative = "Elevated risk driven by: " + ", ".join(narrative_parts) + "."
    
    return {
        "top_contributions": top_5,
        "narrative": narrative
    }
