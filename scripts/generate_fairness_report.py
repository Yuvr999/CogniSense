import os
import pandas as pd
import matplotlib.pyplot as plt
from src.cognisense.data.synthetic import generate_synthetic_features
from src.cognisense.fairness.subgroup_metrics import compute_subgroup_metrics
from src.cognisense.fairness.proxy_audit import run_proxy_audit
import numpy as np

def generate_fairness_report():
    os.makedirs('reports', exist_ok=True)
    
    # 1. Generate data
    df = generate_synthetic_features(n_samples=500, seed=42)
    
    # Mock model predictions
    # Let's say our model relies heavily on pause_count_per_min and recall_immediate
    logits = (df['pause_count_per_min'] * 0.1) - (df['recall_immediate'] * 0.5)
    # Add some bias based on education to show in audit
    logits += (df['education_years'] < 12).astype(int) * 0.5
    
    probs = 1 / (1 + np.exp(-logits))
    df['y_pred_proba'] = probs
    
    # Define groups
    df['age_group'] = pd.cut(df['age'], bins=[0, 65, 75, 100], labels=['<65', '65-74', '>=75'])
    df['education_group'] = pd.cut(df['education_years'], bins=[0, 12, 100], labels=['<=12', '>12'])
    
    # Compute metrics
    metrics_age = compute_subgroup_metrics(df, 'age_group')
    metrics_sex = compute_subgroup_metrics(df, 'sex')
    metrics_edu = compute_subgroup_metrics(df, 'education_group')
    
    # Compute proxy audits
    feature_cols = ['pause_count_per_min', 'mean_pause_s', 'f0_mean', 'mean_log_word_freq', 
                    'pronoun_noun_ratio', 'filler_per_100w', 'recall_immediate', 'recall_delayed', 'animal_count']
    audit_sex = run_proxy_audit(df, 'sex', feature_cols)
    audit_edu = run_proxy_audit(df, 'education_years', feature_cols)
    
    # Save markdown report
    with open('reports/fairness_metrics.md', 'w') as f:
        f.write("# Fairness Audit Metrics (Synthetic Data)\n\n")
        f.write("## Subgroup: Age\n")
        f.write(metrics_age.to_markdown(index=False) + "\n\n")
        f.write("## Subgroup: Sex\n")
        f.write(metrics_sex.to_markdown(index=False) + "\n\n")
        f.write("## Subgroup: Education\n")
        f.write(metrics_edu.to_markdown(index=False) + "\n\n")
        
        f.write("## Proxy Audit (AUROC of predicting demographic from features)\n")
        f.write(f"- Sex Proxy AUROC: {audit_sex:.3f}\n")
        f.write(f"- Education Proxy AUROC: {audit_edu:.3f}\n")
        
    # Generate Plot
    fig, ax = plt.subplots(figsize=(8, 5))
    metrics_edu.set_index('Subgroup')[['Sensitivity', 'Specificity']].plot(kind='bar', ax=ax)
    plt.title("Sensitivity and Specificity by Education Level")
    plt.ylabel("Score")
    plt.ylim(0, 1)
    plt.tight_layout()
    plt.savefig('reports/fairness_edu_plot.png')
    plt.close()

if __name__ == "__main__":
    generate_fairness_report()
