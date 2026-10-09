"""
CogniSense Tabular Risk Preprocessing & Feature Engineering Pipeline.

Provides leakage-safe domain feature extraction, imputation, and encoding
for multimodal/tabular Alzheimer's risk screening prototypes.
"""

from typing import List, Tuple
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


class ClinicalDomainFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Leakage-safe composite domain feature engineer for cognitive risk screening.
    
    Generates composite scores (cardiovascular risk count, early symptom count,
    lifestyle index, cognitive battery composite, sensory impairment count)
    purely from input features without reference to target or latent scores.
    """

    def __init__(self, add_features: bool = True):
        self.add_features = add_features

    def fit(self, X: pd.DataFrame, y=None):
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        if not self.add_features:
            return X.copy()

        X_out = X.copy()

        # 1. Age groups
        if "Age" in X_out.columns:
            X_out["Age_Group_Elderly"] = (X_out["Age"] >= 70).astype(int)
            X_out["Age_Group_Oldest"] = (X_out["Age"] >= 80).astype(int)

        # 2. Cardiovascular Risk Count
        cardio_cols = [
            "Hypertension", "High_Cholesterol", "Heart_Disease", "Diabetes", "Stroke_History"
        ]
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

        # 6. Lifestyle Index
        lifestyle_req = ["Physical_Activity_Days", "Social_Activity_Days", "Diet_Quality", "Smoking", "Alcohol_Use"]
        if all(k in X_out.columns for k in lifestyle_req):
            X_out["Lifestyle_Index"] = (
                X_out["Physical_Activity_Days"] * 1.0
                + X_out["Social_Activity_Days"] * 0.8
                + X_out["Diet_Quality"] * 0.5
                - X_out["Smoking"] * 2.0
                - X_out["Alcohol_Use"] * 1.5
            )

        return X_out


def build_tabular_preprocessor(X_sample: pd.DataFrame) -> Tuple[ColumnTransformer, List[str], List[str]]:
    """
    Build a ColumnTransformer for numerical and categorical features.

    Args:
        X_sample: A sample DataFrame representing the input schema after feature engineering.

    Returns:
        Tuple of (ColumnTransformer, numerical_feature_names, categorical_feature_names).
    """
    categorical_cols = X_sample.select_dtypes(include=["object", "category", "string", "str"]).columns.tolist()
    numerical_cols = X_sample.select_dtypes(include=["int64", "float64", "int32", "float32", "number"]).columns.tolist()

    num_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    cat_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, numerical_cols),
            ("cat", cat_pipeline, categorical_cols),
        ],
        remainder="drop",
    )

    return preprocessor, numerical_cols, categorical_cols
