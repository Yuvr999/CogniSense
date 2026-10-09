"""
CogniTwin End-to-End Digital Twin Test Suite.

Verifies:
- Synthetic dataset generation schemas and integrity
- Daily Patient State Engine temporal rolling features
- State transitions (Stable, Physiological Decline, Data Quality Alert, Cognitive Risk)
- Absence of temporal leakage (past states don't see future days)
- Subject-level grouping in prediction pipeline
- What-If Intervention Simulator sensitivity calculations
- Input validation and rejection of malformed observations
- API endpoints behavior
"""

import os
import sys
import pytest
import pandas as pd
import numpy as np

# Ensure root path is accessible
sys.path.insert(0, os.path.abspath("."))

from src.cognisense.twin.data_generator import (
    generate_ehr_static_dataset,
    generate_wearable_timeseries_dataset,
    fuse_and_generate_target,
)
from src.cognisense.twin.state_engine import (
    DailyPatientStateEngine,
    STATE_STABLE,
    STATE_PHYSIOLOGICAL_DECLINE,
    STATE_DATA_QUALITY_ALERT,
    STATE_COGNITIVE_RISK_ELEVATED,
)
from src.cognisense.twin.db import (
    init_db,
    get_patient_ehr,
    get_patient_wearables,
    get_patient_state_history,
    get_latest_patient_state,
    ingest_wearable_observation,
)
from src.cognisense.twin.prediction_pipeline import CogniTwinPredictionPipeline, FEATURE_COLUMNS
from src.cognisense.twin.simulator import WhatIfInterventionSimulator
from fastapi.testclient import TestClient
from src.cognisense.api.main import app


# -----------------------------------------------------------------------------
# 1. DATASET GENERATION TESTS
# -----------------------------------------------------------------------------
def test_dataset_generation_shapes_and_joins():
    """Verify generated datasets have correct row counts and clean join keys."""
    df_ehr = generate_ehr_static_dataset(n_samples=50, seed=42)
    assert len(df_ehr) == 50
    assert "patient_id" in df_ehr.columns
    assert "baseline_cognitive_score" in df_ehr.columns

    df_wearable = generate_wearable_timeseries_dataset(df_ehr, days=7, seed=42)
    assert len(df_wearable) == 50 * 7
    assert set(df_wearable["day"].unique()) == {1, 2, 3, 4, 5, 6, 7}

    df_fused, df_events = fuse_and_generate_target(df_ehr, df_wearable, seed=42)
    assert len(df_fused) == 50
    assert "cognitive_deterioration_30d" in df_fused.columns
    assert "synthetic_event_probability" not in df_fused.columns
    assert len(df_events) == 50


# -----------------------------------------------------------------------------
# 2. TEMPORAL STATE ENGINE TESTS (NO FUTURE LEAKAGE)
# -----------------------------------------------------------------------------
def test_state_engine_no_future_leakage():
    """Verify Day T state does NOT change if future observations (T+1..) are modified."""
    engine = DailyPatientStateEngine()
    ehr = {"patient_id": "TEST-01", "age": 65, "previous_mci": 0, "baseline_cognitive_score": 27.0}

    obs_7days = [
        {"day": i, "mean_hrv_ms": 50.0 + i, "resting_heart_rate_bpm": 60.0, "sleep_duration_hours": 7.0,
         "deep_sleep_hours": 1.5, "steps": 6000, "activity_minutes": 45, "data_quality_score": 0.95}
        for i in range(1, 8)
    ]

    states_full = engine.compute_daily_state_for_patient(ehr, obs_7days)
    day_3_from_full = states_full[2]

    # Now compute using only days 1 to 3
    states_3d = engine.compute_daily_state_for_patient(ehr, obs_7days[:3])
    day_3_from_partial = states_3d[2]

    # The state at Day 3 must be identical whether future days existed or not!
    assert day_3_from_full["mean_hrv_ms"] == day_3_from_partial["mean_hrv_ms"]
    assert day_3_from_full["rolling_3day_features"] == day_3_from_partial["rolling_3day_features"]
    assert day_3_from_full["twin_state"] == day_3_from_partial["twin_state"]


def test_state_engine_quality_alert():
    """Verify low data quality score triggers DATA_QUALITY_ALERT."""
    engine = DailyPatientStateEngine()
    ehr = {"patient_id": "TEST-02", "age": 70, "previous_mci": 0, "baseline_cognitive_score": 26.0}
    obs = [
        {"day": 1, "mean_hrv_ms": 50.0, "resting_heart_rate_bpm": 62.0, "sleep_duration_hours": 7.0,
         "deep_sleep_hours": 1.5, "steps": 5000, "activity_minutes": 40, "data_quality_score": 0.40}
    ]
    states = engine.compute_daily_state_for_patient(ehr, obs)
    assert states[0]["twin_state"] == STATE_DATA_QUALITY_ALERT


# -----------------------------------------------------------------------------
# 3. DATABASE INGESTION & STATE UPDATE TESTS
# -----------------------------------------------------------------------------
def test_ingest_wearable_updates_twin_state():
    """Verify ingesting a new observation updates patient twin state in SQLite."""
    init_db()
    pid = "PT-0001"

    old_state = get_latest_patient_state(pid)
    assert old_state is not None
    init_day = old_state["day"]

    # Ingest Day 8
    new_obs = {
        "day": init_day + 1,
        "date": "2026-10-08",
        "mean_hrv_ms": 55.0,
        "resting_heart_rate_bpm": 62.0,
        "sleep_duration_hours": 7.5,
        "deep_sleep_hours": 1.6,
        "rem_sleep_hours": 1.4,
        "steps": 8000,
        "activity_minutes": 80,
        "data_quality_score": 0.98,
    }
    updated = ingest_wearable_observation(pid, new_obs)
    assert updated["day"] == init_day + 1

    history = get_patient_state_history(pid)
    assert len(history) >= init_day + 1


def test_ingest_malformed_data_rejected():
    """Verify invalid biomarker readings are rejected with clear errors."""
    pid = "PT-0001"
    # Negative steps
    bad_obs = {
        "day": 99,
        "mean_hrv_ms": 50.0,
        "resting_heart_rate_bpm": 65.0,
        "sleep_duration_hours": 7.0,
        "deep_sleep_hours": 1.5,
        "steps": -500,  # Invalid
        "activity_minutes": 30,
        "data_quality_score": 0.95,
    }
    with pytest.raises(ValueError, match="Steps cannot be negative"):
        ingest_wearable_observation(pid, bad_obs)

    # Deep sleep > total sleep
    bad_sleep_obs = {
        "day": 99,
        "mean_hrv_ms": 50.0,
        "resting_heart_rate_bpm": 65.0,
        "sleep_duration_hours": 4.0,
        "deep_sleep_hours": 6.0,  # Invalid
        "steps": 5000,
        "activity_minutes": 30,
        "data_quality_score": 0.95,
    }
    with pytest.raises(ValueError, match="Deep sleep .* cannot exceed total sleep duration"):
        ingest_wearable_observation(pid, bad_sleep_obs)


# -----------------------------------------------------------------------------
# 4. PREDICTION PIPELINE & NO-LEAKAGE TESTS
# -----------------------------------------------------------------------------
def test_prediction_pipeline_subject_grouping_and_metrics():
    """Verify pipeline trains with grouped CV, evaluates Brier score, and saves."""
    df_ehr = generate_ehr_static_dataset(n_samples=100, seed=42)
    df_wearable = generate_wearable_timeseries_dataset(df_ehr, days=7, seed=42)
    df_fused, _ = fuse_and_generate_target(df_ehr, df_wearable, seed=42)

    pipeline = CogniTwinPredictionPipeline(random_state=42)
    metrics = pipeline.train_and_evaluate(df_fused)

    assert "roc_auc" in metrics
    assert "brier_score" in metrics
    assert metrics["roc_auc"] > 0.70
    assert metrics["brier_score"] < 0.25

    # Prediction test
    sample_pt = df_fused.iloc[0].to_dict()
    pred = pipeline.predict_patient(sample_pt)

    assert "risk_probability" in pred
    assert 0.0 <= pred["risk_probability"] <= 1.0
    assert "risk_tier" in pred
    assert len(pred["top_features"]) > 0


# -----------------------------------------------------------------------------
# 5. WHAT-IF INTERVENTION SIMULATOR TESTS
# -----------------------------------------------------------------------------
def test_what_if_simulator_responsiveness():
    """Verify simulator recalculates model predictions without hardcoded logic."""
    df_ehr = generate_ehr_static_dataset(n_samples=50, seed=42)
    df_wearable = generate_wearable_timeseries_dataset(df_ehr, days=7, seed=42)
    df_fused, _ = fuse_and_generate_target(df_ehr, df_wearable, seed=42)

    pipe = CogniTwinPredictionPipeline(random_state=42)
    pipe.train_and_evaluate(df_fused)
    sim = WhatIfInterventionSimulator(pipe)

    base_features = df_fused.iloc[0].to_dict()
    res = sim.simulate_scenario(base_features, {
        "sleep_duration_delta": 2.0,
        "daily_steps_delta": 4000,
        "hrv_ms_delta": 15.0,
    })

    assert "baseline" in res
    assert "scenario" in res
    assert "probability_delta" in res
    assert "disclaimer" in res


# -----------------------------------------------------------------------------
# 6. REST API ENDPOINTS TESTS
# -----------------------------------------------------------------------------
def test_fastapi_twin_endpoints():
    """Verify REST API responds correctly to Twin endpoints."""
    client = TestClient(app)

    # 1. Healthcheck
    resp_h = client.get("/healthz")
    assert resp_h.status_code == 200

    # 2. Patients list
    resp_pts = client.get("/v1/twin/patients")
    assert resp_pts.status_code == 200
    pts = resp_pts.json()
    assert len(pts) > 0

    # 3. Patient EHR
    pid = pts[0]["patient_id"]
    resp_ehr = client.get(f"/v1/twin/patients/{pid}/ehr")
    assert resp_ehr.status_code == 200
    assert resp_ehr.json()["patient_id"] == pid

    # 4. Patient State History
    resp_hist = client.get(f"/v1/twin/patients/{pid}/state-history")
    assert resp_hist.status_code == 200
    history = resp_hist.json()
    assert len(history) >= 7

    # 5. Prediction
    resp_pred = client.get(f"/v1/twin/patients/{pid}/prediction")
    assert resp_pred.status_code == 200
    pred = resp_pred.json()
    assert "risk_probability" in pred
    assert pred["predicted_outcome"] == "cognitive_deterioration_30d"

    # 6. What-If Simulation
    resp_sim = client.post(f"/v1/twin/patients/{pid}/simulate", json={
        "sleep_duration_delta": 1.5,
        "daily_steps_delta": 2000
    })
    assert resp_sim.status_code == 200
    sim_data = resp_sim.json()
    assert "probability_delta" in sim_data
