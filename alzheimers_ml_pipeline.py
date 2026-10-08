"""
CogniSense - Synthetic Early Alzheimer's Risk Screening ML Pipeline
===================================================================
A complete, production-grade Machine Learning pipeline for synthetic
early Alzheimer's risk screening and research prototyping.

DISCLAIMER:
This model was trained and evaluated on synthetic data and is intended
for ML research/prototyping. It is a screening aid, NOT a clinical diagnosis.
It has not been clinically validated and must not be used for diagnosis.
"""

import sys
import os
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib

# Suppress non-critical warnings
warnings.filterwarnings("ignore")

# Scikit-Learn Imports
from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_validate,
    RandomizedSearchCV,
    GridSearchCV,
)
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    precision_recall_curve,
    average_precision_score,
    ConfusionMatrixDisplay,
)
from sklearn.inspection import permutation_importance

# ML Classifiers
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import (
    RandomForestClassifier,
    ExtraTreesClassifier,
    GradientBoostingClassifier,
    HistGradientBoostingClassifier,
)

# Optional libraries with graceful fallbacks
try:
    import xgboost as xgb
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

try:
    import lightgbm as lgb
    HAS_LGB = True
except ImportError:
    HAS_LGB = False

try:
    import catboost as cb
    HAS_CAT = True
except ImportError:
    HAS_CAT = False

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

try:
    from imblearn.over_sampling import SMOTE
    from imblearn.pipeline import Pipeline as ImbPipeline
    HAS_IMBLEARN = True
except ImportError:
    HAS_IMBLEARN = False


# =============================================================================
# 1. LOAD AND INSPECT DATASET (EDA)
# =============================================================================
def load_and_inspect_data(csv_path: str) -> pd.DataFrame:
    """Load dataset and perform initial Exploratory Data Analysis (EDA)."""
    print("\n" + "=" * 70)
    print(" 1. LOAD AND INSPECT DATASET (EDA)")
    print("=" * 70)
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")
        
    df = pd.read_csv(csv_path)
    print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    
    print("\n--- Column Names & Data Types ---")
    dtypes_summary = pd.DataFrame({
        "Data_Type": df.dtypes,
        "Null_Count": df.isnull().sum(),
        "Unique_Values": df.nunique()
    })
    print(dtypes_summary.head(15))
    print(f"... and {len(dtypes_summary) - 15} more columns.")
    
    print(f"\nTotal Missing Values: {df.isnull().sum().sum()}")
    print(f"Duplicate Rows: {df.duplicated().sum()}")
    
    print("\n--- Target Class Distribution ---")
    target_counts = df["Early_Alzheimer_Risk"].value_counts()
    target_props = df["Early_Alzheimer_Risk"].value_counts(normalize=True) * 100
    for cls in target_counts.index:
        print(f"  Class {cls}: {target_counts[cls]} cases ({target_props[cls]:.2f}%)")
        
    print("\n--- Key Numerical Statistics (Sample) ---")
    sample_num_cols = ["Age", "Education_Years", "MMSE_Score", "MoCA_Score", "Systolic_BP", "Blood_Glucose"]
    print(df[sample_num_cols].describe().round(2))
    
    # Outlier detection using IQR
    print("\n--- Outlier Detection Summary (IQR Method on Key Metrics) ---")
    for col in sample_num_cols:
        q25, q75 = np.percentile(df[col], 25), np.percentile(df[col], 75)
        iqr = q75 - q25
        lower_bound = q25 - 1.5 * iqr
        upper_bound = q75 + 1.5 * iqr
        outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)][col]
        print(f"  {col}: {len(outliers)} outliers detected outside [{lower_bound:.1f}, {upper_bound:.1f}]")
        
    return df


# =============================================================================
# 2. FEATURE ENGINEERING TRANSFORMER (Leakage-Safe)
# =============================================================================
class ClinicalDomainFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Creates composite domain features safely without using target or leakage features.
    Can be seamlessly embedded inside a Scikit-Learn Pipeline.
    """
    def __init__(self, add_features: bool = True):
        self.add_features = add_features
        
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        if not self.add_features:
            return X.copy()
            
        X_out = X.copy()
        
        # 1. Age groups binned
        if "Age" in X_out.columns:
            X_out["Age_Group_Elderly"] = (X_out["Age"] >= 70).astype(int)
            X_out["Age_Group_Oldest"] = (X_out["Age"] >= 80).astype(int)
            
        # 2. Cardiovascular Risk Count
        cardio_cols = ["Hypertension", "High_Cholesterol", "Heart_Disease", "Diabetes", "Stroke_History"]
        avail_cardio = [c for c in cardio_cols if c in X_out.columns]
        if avail_cardio:
            X_out["Cardio_Risk_Count"] = X_out[avail_cardio].sum(axis=1)
            
        # 3. Early Cognitive Symptom Count
        symptom_cols = [
            "Memory_Loss", "Confusion", "Difficulty_Planning",
            "Language_Difficulty", "Disorientation", "Difficulty_Daily_Tasks", "Mood_Changes"
        ]
        avail_symptoms = [c for c in symptom_cols if c in X_out.columns]
        if avail_symptoms:
            X_out["Symptom_Count"] = X_out[avail_symptoms].sum(axis=1)
            
        # 4. Cognitive Test Composite Average
        cog_score_cols = ["Memory_Test_Score", "Attention_Score", "Executive_Function_Score"]
        avail_cog = [c for c in cog_score_cols if c in X_out.columns]
        if avail_cog:
            X_out["Cognitive_Test_Composite"] = X_out[avail_cog].mean(axis=1)
            
        # 5. Sensory Impairment Count
        sensory_cols = ["Hearing_Loss", "Vision_Problems", "Sleep_Apnea"]
        avail_sensory = [c for c in sensory_cols if c in X_out.columns]
        if avail_sensory:
            X_out["Sensory_Risk_Count"] = X_out[avail_sensory].sum(axis=1)
            
        # 6. Overall Lifestyle Composite Score
        if all(k in X_out.columns for k in ["Physical_Activity_Days", "Social_Activity_Days", "Diet_Quality", "Smoking", "Alcohol_Use"]):
            X_out["Lifestyle_Index"] = (
                X_out["Physical_Activity_Days"] * 1.0 +
                X_out["Social_Activity_Days"] * 0.8 +
                X_out["Diet_Quality"] * 0.5 -
                X_out["Smoking"] * 2.0 -
                X_out["Alcohol_Use"] * 1.5
            )
            
        return X_out


# =============================================================================
# 3. DATA PREPROCESSING PIPELINE BUILDER
# =============================================================================
def build_preprocessor(X_sample: pd.DataFrame) -> tuple[ColumnTransformer, list, list]:
    """
    Builds a ColumnTransformer for preprocessing numerical and categorical features.
    """
    categorical_cols = X_sample.select_dtypes(include=["object", "category"]).columns.tolist()
    numerical_cols = X_sample.select_dtypes(include=["int64", "float64", "int32", "float32"]).columns.tolist()
    
    num_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    
    cat_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, numerical_cols),
            ("cat", cat_pipeline, categorical_cols)
        ],
        remainder="drop"
    )
    
    return preprocessor, numerical_cols, categorical_cols


# =============================================================================
# 4. CROSS-VALIDATION MODEL BENCHMARKING
# =============================================================================
def evaluate_models_cv(X_train: pd.DataFrame, y_train: pd.Series, cv_folds=5, add_fe: bool = True) -> pd.DataFrame:
    """
    Cross-validates multiple candidate classifiers on the training data.
    """
    print("\n" + "=" * 70)
    print(f" 5 & 6. CROSS-VALIDATION BENCHMARK (Stratified {cv_folds}-Fold, Feature Engineering={add_fe})")
    print("=" * 70)
    
    fe = ClinicalDomainFeatureEngineer(add_features=add_fe)
    X_fe_sample = fe.fit_transform(X_train)
    preprocessor, _, _ = build_preprocessor(X_fe_sample)
    
    # Models dictionary
    models = {
        "Logistic Regression (Balanced)": LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=200, max_depth=8, class_weight="balanced", random_state=42, n_jobs=-1),
        "Extra Trees": ExtraTreesClassifier(n_estimators=200, max_depth=8, class_weight="balanced", random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=150, learning_rate=0.08, max_depth=4, random_state=42),
        "HistGradientBoosting": HistGradientBoostingClassifier(max_iter=150, learning_rate=0.08, class_weight="balanced", random_state=42),
    }
    
    if HAS_XGB:
        scale_pos_weight = (len(y_train) - sum(y_train)) / sum(y_train)
        models["XGBoost"] = xgb.XGBClassifier(
            n_estimators=150, learning_rate=0.08, max_depth=4, scale_pos_weight=scale_pos_weight,
            random_state=42, eval_metric="logloss", n_jobs=-1
        )
    if HAS_LGB:
        models["LightGBM"] = lgb.LGBMClassifier(
            n_estimators=150, learning_rate=0.08, class_weight="balanced", random_state=42, n_jobs=-1, verbose=-1
        )
    if HAS_CAT:
        models["CatBoost"] = cb.CatBoostClassifier(
            iterations=150, learning_rate=0.08, auto_class_weights="Balanced", random_seed=42, verbose=0
        )
        
    skf = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=42)
    scoring = {
        "accuracy": "accuracy",
        "precision": "precision",
        "recall": "recall",
        "f1": "f1",
        "roc_auc": "roc_auc"
    }
    
    results = []
    for name, clf in models.items():
        full_pipe = Pipeline(steps=[
            ("fe", ClinicalDomainFeatureEngineer(add_features=add_fe)),
            ("preprocessor", preprocessor),
            ("classifier", clf)
        ])
        
        cv_res = cross_validate(full_pipe, X_train, y_train, cv=skf, scoring=scoring, n_jobs=-1)
        
        results.append({
            "Model": name,
            "Accuracy": np.mean(cv_res["test_accuracy"]),
            "Precision": np.mean(cv_res["test_precision"]),
            "Recall": np.mean(cv_res["test_recall"]),
            "F1": np.mean(cv_res["test_f1"]),
            "ROC-AUC": np.mean(cv_res["test_roc_auc"]),
            "ROC-AUC_Std": np.std(cv_res["test_roc_auc"])
        })
        
    results_df = pd.DataFrame(results).sort_values(by=["ROC-AUC", "Recall"], ascending=False).reset_index(drop=True)
    
    # Display Markdown Table
    print("\n--- Cross-Validation Model Comparison Table ---")
    formatted_table = results_df.copy()
    for col in ["Accuracy", "Precision", "Recall", "F1", "ROC-AUC", "ROC-AUC_Std"]:
        formatted_table[col] = formatted_table[col].map("{:.4f}".format)
    print(formatted_table.to_markdown(index=False))
    
    return results_df


# =============================================================================
# 5. HYPERPARAMETER TUNING
# =============================================================================
def tune_best_model(X_train: pd.DataFrame, y_train: pd.Series) -> Pipeline:
    """
    Performs RandomizedSearchCV on the top performing pipeline optimizing for ROC-AUC.
    """
    print("\n" + "=" * 70)
    print(" 7. HYPERPARAMETER OPTIMIZATION (Optimizing ROC-AUC via 5-Fold CV)")
    print("=" * 70)
    
    fe = ClinicalDomainFeatureEngineer(add_features=True)
    X_fe_sample = fe.fit_transform(X_train)
    preprocessor, _, _ = build_preprocessor(X_fe_sample)
    
    pipeline = Pipeline(steps=[
        ("fe", ClinicalDomainFeatureEngineer(add_features=True)),
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(random_state=42, class_weight="balanced"))
    ])
    
    param_grid = {
        "classifier__n_estimators": [100, 200, 300, 400],
        "classifier__max_depth": [5, 8, 12, 16, None],
        "classifier__min_samples_split": [2, 5, 10],
        "classifier__min_samples_leaf": [1, 2, 4],
        "classifier__max_features": ["sqrt", "log2", 0.3, 0.5]
    }
    
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    search = RandomizedSearchCV(
        pipeline,
        param_distributions=param_grid,
        n_iter=25,
        scoring="roc_auc",
        cv=skf,
        random_state=42,
        n_jobs=-1,
        verbose=0
    )
    
    print("Searching hyperparameter space for Random Forest...")
    search.fit(X_train, y_train)
    
    print(f"Best CV ROC-AUC Score: {search.best_score_:.4f}")
    print("Best Hyperparameters:")
    for k, v in search.best_params_.items():
        print(f"  {k.replace('classifier__', '')}: {v}")
        
    return search.best_estimator_


# =============================================================================
# 6. FINAL TEST SET EVALUATION AND VISUALIZATIONS
# =============================================================================
def evaluate_and_plot_final_model(model: Pipeline, X_test: pd.DataFrame, y_test: pd.Series, output_dir: str = "."):
    """
    Evaluates the final pipeline ONCE on the untouched test set and plots performance curves.
    """
    print("\n" + "=" * 70)
    print(" 11. FINAL EVALUATION ON UNTOUCHED TEST SET")
    print("=" * 70)
    
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    avg_prec = average_precision_score(y_test, y_prob)
    
    print(f"Test Accuracy:          {acc:.4f}")
    print(f"Test Precision:         {prec:.4f}")
    print(f"Test Recall:            {rec:.4f}")
    print(f"Test F1-Score:          {f1:.4f}")
    print(f"Test ROC-AUC:           {roc_auc:.4f}")
    print(f"Test Average Precision: {avg_prec:.4f}")
    
    print("\n--- Classification Report ---")
    print(classification_report(y_test, y_pred, target_names=["Lower Risk (0)", "Higher Risk (1)"]))
    
    # 3-Panel Evaluation Figure
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    
    # 1. Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["Lower Risk (0)", "Higher Risk (1)"])
    disp.plot(ax=axes[0], cmap="Blues", colorbar=False)
    axes[0].set_title(f"Confusion Matrix (Acc={acc:.2%}, Rec={rec:.2%})", fontsize=12, fontweight="bold")
    axes[0].grid(False)
    
    # 2. ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    axes[1].plot(fpr, tpr, color="#1f77b4", lw=2.5, label=f"ROC Curve (AUC = {roc_auc:.3f})")
    axes[1].plot([0, 1], [0, 1], color="gray", lw=1.5, linestyle="--", label="Chance (AUC = 0.50)")
    axes[1].set_xlabel("False Positive Rate (1 - Specificity)", fontsize=11)
    axes[1].set_ylabel("True Positive Rate (Sensitivity / Recall)", fontsize=11)
    axes[1].set_title("Receiver Operating Characteristic (ROC)", fontsize=12, fontweight="bold")
    axes[1].legend(loc="lower right")
    axes[1].grid(True, alpha=0.3)
    
    # 3. Precision-Recall Curve
    p_curve, r_curve, _ = precision_recall_curve(y_test, y_prob)
    axes[2].plot(r_curve, p_curve, color="#2ca02c", lw=2.5, label=f"PR Curve (AP = {avg_prec:.3f})")
    axes[2].axhline(y=np.mean(y_test), color="gray", lw=1.5, linestyle="--", label=f"Baseline ({np.mean(y_test):.1%})")
    axes[2].set_xlabel("Recall (Sensitivity)", fontsize=11)
    axes[2].set_ylabel("Precision (PPV)", fontsize=11)
    axes[2].set_title("Precision-Recall (PR) Curve", fontsize=12, fontweight="bold")
    axes[2].legend(loc="upper right")
    axes[2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "model_evaluation_metrics.png")
    plt.savefig(plot_path, dpi=300)
    print(f"\nEvaluation plots saved to: {plot_path}")
    plt.close()


# =============================================================================
# 7. MODEL EXPLAINABILITY & FEATURE IMPORTANCE
# =============================================================================
def explain_model(model: Pipeline, X_train: pd.DataFrame, y_train: pd.Series, output_dir: str = "."):
    """
    Computes feature importance and Permutation Importance for the top 15 features.
    """
    print("\n" + "=" * 70)
    print(" 12. MODEL EXPLAINABILITY & FEATURE IMPORTANCE")
    print("=" * 70)
    
    # Extract feature names after FE and ColumnTransformer
    fe_step = model.named_steps["fe"]
    preprocessor_step = model.named_steps["preprocessor"]
    clf = model.named_steps["classifier"]
    
    X_fe_train = fe_step.transform(X_train)
    
    # Get feature names from ColumnTransformer
    feature_names = []
    for name, trans, cols in preprocessor_step.transformers_:
        if name == "remainder" or trans == "drop":
            continue
        if hasattr(trans, "named_steps") and "encoder" in trans.named_steps:
            enc = trans.named_steps["encoder"]
            cat_names = enc.get_feature_names_out(cols).tolist()
            feature_names.extend(cat_names)
        else:
            feature_names.extend(cols)
            
    # Calculate Gini importances if tree-based
    if hasattr(clf, "feature_importances_"):
        importances = clf.feature_importances_
        imp_df = pd.DataFrame({
            "Feature": feature_names,
            "Importance": importances
        }).sort_values(by="Importance", ascending=False).reset_index(drop=True)
        
        print("\n--- Top 15 Most Influential Features (Tree Gini Importance) ---")
        for idx, row in imp_df.head(15).iterrows():
            print(f"  {idx+1:2d}. {row['Feature']:<30} : {row['Importance']:.4f}")
            
        # Plot top 15 features
        plt.figure(figsize=(10, 6))
        top_15 = imp_df.head(15).iloc[::-1]
        plt.barh(top_15["Feature"], top_15["Importance"], color="#3b528b")
        plt.xlabel("Relative Feature Importance (MDI / Gini)", fontsize=11)
        plt.title("Top 15 Predictive Features Influencing Early Risk Probability", fontsize=12, fontweight="bold")
        plt.grid(axis="x", alpha=0.3)
        plt.tight_layout()
        
        feat_plot_path = os.path.join(output_dir, "feature_importance_top15.png")
        plt.savefig(feat_plot_path, dpi=300)
        print(f"Feature importance plot saved to: {feat_plot_path}")
        plt.close()
        
    print("\n" + ">" * 70)
    print("CLINICAL ASSOCIATION NOTE:")
    print("Feature importance indicates statistical correlation within this synthetic ML dataset.")
    print("It is NOT clinical proof that any specific factor causes Alzheimer's disease.")
    print(">" * 70)


# =============================================================================
# 8. PATIENT PREDICTION FUNCTION
# =============================================================================
def predict_alzheimer_risk(patient_data: pd.DataFrame | dict, model: Pipeline) -> dict:
    """
    Accepts raw patient feature values and outputs predicted risk probabilities,
    stratified risk categories, and non-diagnostic screening guidance.
    """
    if isinstance(patient_data, dict):
        patient_df = pd.DataFrame([patient_data])
    else:
        patient_df = patient_data.copy()
        
    # Guard against accidental inclusion of ID or leakage column
    for drop_col in ["Person_ID", "Risk_Score", "Early_Alzheimer_Risk"]:
        if drop_col in patient_df.columns:
            patient_df = patient_df.drop(columns=[drop_col])
            
    prob_high_risk = float(model.predict_proba(patient_df)[:, 1][0])
    prob_low_risk = 1.0 - prob_high_risk
    pred_class = int(model.predict(patient_df)[0])
    
    # Categorize Risk
    if prob_high_risk < 0.35:
        risk_category = "Low Risk"
    elif prob_high_risk < 0.65:
        risk_category = "Moderate Risk"
    else:
        risk_category = "Higher Risk"
        
    return {
        "predicted_class": pred_class,
        "probability_higher_risk": round(prob_high_risk, 4),
        "probability_lower_risk": round(prob_low_risk, 4),
        "risk_category": risk_category,
        "clinical_disclaimer": "Screening aid only, not a clinical diagnosis. Consult a qualified medical practitioner."
    }


# =============================================================================
# 9. MAIN PIPELINE EXECUTION
# =============================================================================
def main():
    csv_file = "alzheimers_early_detection_1000.csv"
    
    # Step 1: Load and inspect
    df = load_and_inspect_data(csv_file)
    
    # Step 2 & 3: Leakage Prevention
    print("\n" + "=" * 70)
    print(" 3. LEAKAGE PREVENTION & TARGET EXTRACTION")
    print("=" * 70)
    
    leakage_cols = ["Person_ID", "Risk_Score"]
    target_col = "Early_Alzheimer_Risk"
    
    features_to_drop = [c for c in leakage_cols + [target_col] if c in df.columns]
    X = df.drop(columns=features_to_drop)
    y = df[target_col]
    
    print(f"Features explicitly dropped: {leakage_cols}")
    print(f"Target variable extracted:   '{target_col}'")
    print(f"Final Model Feature Matrix:  {X.shape[1]} input features across {X.shape[0]} patient records")
    
    # Step 4: Train / Test Split
    print("\n" + "=" * 70)
    print(" 4. TRAIN / TEST SPLIT (80% Train, 20% Test, Stratified)")
    print("=" * 70)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {X_train.shape[0]} samples (Positives: {y_train.sum()} | {y_train.mean():.1%})")
    print(f"Testing set:  {X_test.shape[0]} samples (Positives: {y_test.sum()} | {y_test.mean():.1%})")
    
    # Step 5 & 6 & 8: Baseline Models Cross-Validation Comparison
    print("\n--- Comparing Before vs After Feature Engineering ---")
    cv_baseline_raw = evaluate_models_cv(X_train, y_train, cv_folds=5, add_fe=False)
    cv_baseline_fe = evaluate_models_cv(X_train, y_train, cv_folds=5, add_fe=True)
    
    # Step 7: Hyperparameter Tuning of the top model
    best_pipeline = tune_best_model(X_train, y_train)
    
    # Step 8: Fit tuned pipeline on the entire training set
    print("\nFitting final tuned pipeline on the full training partition...")
    best_pipeline.fit(X_train, y_train)
    
    # Step 11: Final Evaluation on untouched test set
    evaluate_and_plot_final_model(best_pipeline, X_test, y_test)
    
    # Step 12: Explainability
    explain_model(best_pipeline, X_train, y_train)
    
    # Step 14: Save Final Model and Feature List
    print("\n" + "=" * 70)
    print(" 14. SAVE FINAL MODEL PIPELINE")
    print("=" * 70)
    
    model_filename = "alzheimers_risk_model.pkl"
    joblib.dump({
        "pipeline": best_pipeline,
        "feature_names": X.columns.tolist(),
        "target_col": target_col,
        "metadata": {
            "dataset": csv_file,
            "version": "1.0.0",
            "type": "Synthetic Screening Prototype",
            "date": "2026-10-08"
        }
    }, model_filename)
    print(f"Model pipeline & metadata successfully saved to: {model_filename}")
    
    # Step 15: Sample Patient Prediction Demonstration
    print("\n" + "=" * 70)
    print(" 15. SAMPLE PATIENT INFERENCE DEMONSTRATION")
    print("=" * 70)
    
    sample_patient_high_risk = X_test.iloc[0:1].to_dict(orient="records")[0]
    result_1 = predict_alzheimer_risk(sample_patient_high_risk, best_pipeline)
    
    print("\n[Patient Case Evaluation 1]")
    print(f"  Input Age:                 {sample_patient_high_risk['Age']}")
    print(f"  MMSE Score:                {sample_patient_high_risk['MMSE_Score']}")
    print(f"  Memory Loss Reported:      {sample_patient_high_risk['Memory_Loss']}")
    print(f"  Predicted Class:           {result_1['predicted_class']}")
    print(f"  Probability Higher Risk:   {result_1['probability_higher_risk']:.2%}")
    print(f"  Probability Lower Risk:    {result_1['probability_lower_risk']:.2%}")
    print(f"  Risk Category:             {result_1['risk_category']}")
    print(f"  Clinical Notice:           {result_1['clinical_disclaimer']}")
    
    # Step 16: Final Disclaimer
    print("\n" + "=" * 70)
    print(" 16. FINAL STATEMENT & CLINICAL ETHICS NOTICE")
    print("=" * 70)
    print("This model was trained and evaluated on synthetic data and is intended")
    print("for ML research/prototyping. It has not been clinically validated and")
    print("must not be used for diagnosis. UI/User copy must state 'screening aid, not a diagnosis'.")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
