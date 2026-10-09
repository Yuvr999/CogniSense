"""
Tests for CogniSense Tabular Risk Screening Pipeline.
"""

import os
import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient

from src.cognisense.api.main import app
from src.cognisense.data.synthetic import generate_tabular_risk_dataset
from src.cognisense.models.screening_model import TabularRiskScreeningModel
from src.cognisense.models.screening_pipeline import (
    ClinicalDomainFeatureEngineer,
    build_tabular_preprocessor,
)


def test_synthetic_tabular_dataset_generation():
    """Test synthetic tabular dataset generation and schema integrity."""
    df = generate_tabular_risk_dataset(n_samples=200, seed=42, include_leakage_columns=False)
    assert len(df) == 200
    assert "Early_Alzheimer_Risk" in df.columns
    assert "Person_ID" not in df.columns
    assert "Risk_Score" not in df.columns
    assert df["Early_Alzheimer_Risk"].isin([0, 1]).all()
    # Check reproducible seed
    df2 = generate_tabular_risk_dataset(n_samples=200, seed=42, include_leakage_columns=False)
    pd.testing.assert_frame_equal(df, df2)


def test_feature_engineering_no_leakage():
    """Test domain feature engineer works and does not introduce target leakage."""
    df = generate_tabular_risk_dataset(n_samples=100, seed=42, include_leakage_columns=False)
    X = df.drop(columns=["Early_Alzheimer_Risk"])

    fe = ClinicalDomainFeatureEngineer(add_features=True)
    X_fe = fe.fit_transform(X)

    assert "Cardio_Risk_Count" in X_fe.columns
    assert "Symptom_Count" in X_fe.columns
    assert "Cognitive_Test_Composite" in X_fe.columns
    assert "Lifestyle_Index" in X_fe.columns
    assert "Early_Alzheimer_Risk" not in X_fe.columns
    assert "Risk_Score" not in X_fe.columns


def test_tabular_screening_model_training_and_calibration():
    """Test model training, calibration, CV evaluation, and prediction."""
    df = generate_tabular_risk_dataset(n_samples=200, seed=42)
    X = df.drop(columns=["Early_Alzheimer_Risk"])
    y = df["Early_Alzheimer_Risk"]

    model = TabularRiskScreeningModel(calibrate=True, random_state=42)
    cv_res = model.evaluate_cv(X, y, cv_splits=3)

    assert "roc_auc" in cv_res
    assert cv_res["roc_auc"] > 0.70

    # Fit model
    model.fit(X, y)
    probs = model.predict_proba(X)
    assert probs.shape == (200, 2)
    assert np.allclose(probs.sum(axis=1), 1.0)

    # Test single patient inference
    sample_patient = X.iloc[0].to_dict()
    res = model.predict_patient_record(sample_patient)
    assert "tier" in res
    assert res["tier"] in ["low", "moderate", "high"]
    assert "screening aid" in res["disclaimer"].lower()


def test_model_save_and_load(tmp_path):
    """Test serializing and loading the pipeline."""
    df = generate_tabular_risk_dataset(n_samples=100, seed=42)
    X = df.drop(columns=["Early_Alzheimer_Risk"])
    y = df["Early_Alzheimer_Risk"]

    model = TabularRiskScreeningModel(calibrate=True, random_state=42)
    model.fit(X, y)

    save_file = str(tmp_path / "test_model.pkl")
    model.save(save_file)

    loaded_model = TabularRiskScreeningModel.load(save_file)
    probs_orig = model.predict_proba(X)
    probs_loaded = loaded_model.predict_proba(X)

    np.testing.assert_allclose(probs_orig, probs_loaded)


def test_api_tabular_risk_endpoint():
    """Test the FastAPI /v1/screen/tabular-risk endpoint."""
    client = TestClient(app)

    patient_payload = {
        "Age": 68,
        "Gender": "Female",
        "Education_Years": 14,
        "Occupation": "Retired",
        "Family_History_Alzheimer": 1,
        "Previous_Cognitive_Decline": 0,
        "Diabetes": 0,
        "Hypertension": 1,
        "High_Cholesterol": 1,
        "Heart_Disease": 0,
        "Stroke_History": 0,
        "Head_Injury_History": 0,
        "Hearing_Loss": 0,
        "Vision_Problems": 0,
        "Sleep_Apnea": 0,
        "Smoking": 0,
        "Alcohol_Use": 0,
        "Physical_Activity_Days": 4,
        "Social_Activity_Days": 3,
        "Sleep_Hours": 7.0,
        "Diet_Quality": 7,
        "Stress_Level": 4,
        "Depression": 0,
        "Anxiety": 0,
        "Memory_Loss": 0,
        "Confusion": 0,
        "Difficulty_Planning": 0,
        "Language_Difficulty": 0,
        "Disorientation": 0,
        "Mood_Changes": 0,
        "Difficulty_Daily_Tasks": 0,
        "Memory_Test_Score": 82.0,
        "Attention_Score": 80.0,
        "Executive_Function_Score": 78.0,
        "MMSE_Score": 28.5,
        "MoCA_Score": 27.0,
        "Functional_Independence": 9,
        "BMI": 24.2,
        "Systolic_BP": 122.0,
        "Diastolic_BP": 78.0,
        "LDL_Cholesterol": 115.0,
        "HDL_Cholesterol": 55.0,
        "Blood_Glucose": 98.0,
        "Vitamin_D": 35.0,
        "Vitamin_B12": 450.0,
        "Medication_Count": 2,
        "Genetic_Risk": 0,
    }

    response = client.post("/v1/screen/tabular-risk", json=patient_payload)
    assert response.status_code == 200
    data = response.json()
    assert "probability_higher_risk" in data
    assert "tier" in data
    assert data["tier"] in ["low", "moderate", "high"]
    assert "disclaimer" in data
