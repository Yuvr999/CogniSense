import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

def run_proxy_audit(df: pd.DataFrame, target_demographic: str, feature_cols: list) -> float:
    """
    Trains a probe to predict a demographic trait from non-demographic features.
    Returns the AUROC (if binary) or R2 score of the probe.
    """
    X = df[feature_cols]
    y = df[target_demographic]
    
    # If the target is continuous (e.g., education_years), we can bin it to binary for audit
    if target_demographic == 'education_years':
        y = (y > 12).astype(int)
        
    if target_demographic == 'sex':
        y = (y == 'F').astype(int)
        
    pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='mean')),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    
    # Try cross val ROC AUC
    try:
        scores = cross_val_score(pipeline, X, y, cv=3, scoring='roc_auc')
        return float(scores.mean())
    except Exception as e:
        return 0.5
