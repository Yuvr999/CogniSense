import pandas as pd
import numpy as np
from sklearn.metrics import roc_auc_score, confusion_matrix, brier_score_loss

def compute_subgroup_metrics(df: pd.DataFrame, group_col: str, y_true_col: str = 'label', y_pred_col: str = 'y_pred_proba', threshold: float = 0.5) -> pd.DataFrame:
    """
    Computes fairness metrics per subgroup.
    """
    results = []
    groups = df[group_col].unique()
    
    for g in groups:
        sub_df = df[df[group_col] == g]
        if len(sub_df) < 2:
            continue
        
        y_true = sub_df[y_true_col]
        y_pred = sub_df[y_pred_col]
        y_pred_bin = (y_pred >= threshold).astype(int)
        
        try:
            auroc = roc_auc_score(y_true, y_pred)
        except ValueError:
            auroc = np.nan
            
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred_bin, labels=[0, 1]).ravel()
        sensitivity = tp / (tp + fn) if (tp + fn) > 0 else np.nan
        specificity = tn / (tn + fp) if (tn + fp) > 0 else np.nan
        
        # simulated indeterminate rate based on probability range e.g., 0.4 to 0.6
        indet = sub_df[(y_pred >= 0.4) & (y_pred <= 0.6)].shape[0] / sub_df.shape[0] if sub_df.shape[0] > 0 else 0
        
        results.append({
            'Subgroup': g,
            'N': len(sub_df),
            'AUROC': auroc,
            'Sensitivity': sensitivity,
            'Specificity': specificity,
            'Indeterminate Rate': indet
        })
        
    return pd.DataFrame(results)
