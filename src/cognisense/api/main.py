from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import uuid
import json
import sqlite3
import threading
from datetime import datetime, timezone
import pandas as pd
import numpy as np

from src.cognisense.schemas import (
    RiskResult,
    ModalityResult,
    FeatureContribution,
    TabularRiskInput,
    TabularRiskResult,
)
from src.cognisense.models.screening_model import TabularRiskScreeningModel
from src.cognisense.data.synthetic import generate_tabular_risk_dataset

app = FastAPI(title="CogniSense API", version="0.1.0")


class SessionProxy(dict):
    """
    A dict proxy that automatically persists modifications back to the SQLite store.
    """
    def __init__(self, session_id: str, store: "PersistentSessionStore", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session_id = session_id
        self._store = store

    def __setitem__(self, key: str, value: Any) -> None:
        super().__setitem__(key, value)
        self._store.save_session(self._session_id, dict(self))

    def update(self, *args, **kwargs) -> None:
        super().update(*args, **kwargs)
        self._store.save_session(self._session_id, dict(self))


class PersistentSessionStore:
    """
    Thread-safe, SQLite-backed persistent session store.
    Survives server restarts and multi-worker execution.
    """
    def __init__(self, db_path: str = "data/cognitwin.db"):
        self.db_path = db_path
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        self._lock = threading.Lock()
        self._init_table()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=15.0)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_table(self) -> None:
        with self._lock:
            with self._get_connection() as conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS screening_sessions (
                        session_id TEXT PRIMARY KEY,
                        speech INTEGER NOT NULL DEFAULT 0,
                        cognitive INTEGER NOT NULL DEFAULT 0,
                        persona TEXT NOT NULL DEFAULT 'Low risk',
                        session_data_json TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                """)
                conn.commit()

    def save_session(self, session_id: str, data: Dict[str, Any]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        speech_val = 1 if data.get("speech") else 0
        cog_val = 1 if data.get("cognitive") else 0
        persona_val = str(data.get("persona", "Low risk"))
        data_json = json.dumps(data)
        with self._lock:
            with self._get_connection() as conn:
                conn.execute("""
                    INSERT INTO screening_sessions (session_id, speech, cognitive, persona, session_data_json, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(session_id) DO UPDATE SET
                        speech = excluded.speech,
                        cognitive = excluded.cognitive,
                        persona = excluded.persona,
                        session_data_json = excluded.session_data_json,
                        updated_at = excluded.updated_at
                """, (session_id, speech_val, cog_val, persona_val, data_json, now, now))
                conn.commit()

    def __contains__(self, session_id: str) -> bool:
        with self._lock:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1 FROM screening_sessions WHERE session_id = ?", (session_id,))
                return cursor.fetchone() is not None

    def __getitem__(self, session_id: str) -> SessionProxy:
        with self._lock:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT session_data_json FROM screening_sessions WHERE session_id = ?", (session_id,))
                row = cursor.fetchone()
                if row is None:
                    raise KeyError(session_id)
                data = json.loads(row["session_data_json"])
                return SessionProxy(session_id, self, data)

    def __setitem__(self, session_id: str, value: Dict[str, Any]) -> None:
        self.save_session(session_id, dict(value))

    def __delitem__(self, session_id: str) -> None:
        with self._lock:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM screening_sessions WHERE session_id = ?", (session_id,))
                conn.commit()
                if cursor.rowcount == 0:
                    raise KeyError(session_id)

    def get(self, session_id: str, default: Any = None) -> Any:
        try:
            return self[session_id]
        except KeyError:
            return default


# Persistent session store (replaces volatile in-memory dict)
sessions = PersistentSessionStore()

# Cached screening model + locks for thread safety
_cached_tabular_model: Optional[TabularRiskScreeningModel] = None
_tabular_model_lock = threading.Lock()


def get_tabular_screening_model() -> TabularRiskScreeningModel:
    global _cached_tabular_model
    if _cached_tabular_model is None:
        with _tabular_model_lock:
            if _cached_tabular_model is None:
                model_path = "alzheimers_risk_model.pkl"
                if os.path.exists(model_path):
                    try:
                        _cached_tabular_model = TabularRiskScreeningModel.load(model_path)
                    except Exception:
                        _cached_tabular_model = None
                if _cached_tabular_model is None:
                    # Fit a default model from synthetic data if pkl not present
                    df = generate_tabular_risk_dataset(n_samples=500, seed=42)
                    X = df.drop(columns=["Early_Alzheimer_Risk"])
                    y = df["Early_Alzheimer_Risk"]
                    _cached_tabular_model = TabularRiskScreeningModel(calibrate=True, random_state=42)
                    _cached_tabular_model.fit(X, y)
    return _cached_tabular_model


class SessionCreateResponse(BaseModel):
    session_id: str


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.post("/v1/sessions", response_model=SessionCreateResponse)
def create_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"speech": False, "cognitive": False, "persona": "Low risk"}
    return {"session_id": session_id}


@app.post("/v1/sessions/{session_id}/speech")
async def process_speech(session_id: str, file: UploadFile = File(...)):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Mock processing
    sessions[session_id]["speech"] = True
    return {"status": "processed", "modality": "speech"}


@app.post("/v1/sessions/{session_id}/cognitive")
def process_cognitive(session_id: str, data: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Mock processing, can read persona from data if passed
    if "persona" in data:
        sessions[session_id]["persona"] = data["persona"]
    sessions[session_id]["cognitive"] = True
    return {"status": "processed", "modality": "cognitive"}


@app.post("/v1/screen/tabular-risk", response_model=TabularRiskResult)
def screen_tabular_risk(patient: TabularRiskInput):
    """
    Online inference endpoint for tabular early Alzheimer's risk screening.
    Adheres to clinical decision support guidelines: screening aid, not a diagnosis.
    """
    model = get_tabular_screening_model()
    patient_dict = patient.model_dump()
    result = model.predict_patient_record(patient_dict)
    return TabularRiskResult(**result)


def _get_mock_result(session_id: str, persona: str) -> RiskResult:
    if persona == "Low risk":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.12,
            ci_low=0.05,
            ci_high=0.22,
            tier="low",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.15, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Pause time", value=22.0, reference=20.0, shap=0.01, direction="neutral")]
                ),
                ModalityResult(
                    name="cognitive", probability=0.10, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=8.0, reference=7.5, shap=-0.05, direction="down")]
                )
            ],
            narrative="No significant cognitive impairment detected based on speech and digital tasks. Performance is within age and education adjusted norms.",
            recommended_action="Reassure and rescreen in 12 months.",
            model_version="v0.1.0-demo"
        )
    elif persona == "Elevated – memory":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.65,
            ci_low=0.45,
            ci_high=0.82,
            tier="elevated",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.35, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Pause time", value=25.0, reference=20.0, shap=0.05, direction="up")]
                ),
                ModalityResult(
                    name="cognitive", probability=0.85, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=4.0, reference=7.5, shap=0.3, direction="up")]
                )
            ],
            narrative="Elevated risk driven primarily by reduced delayed word recall (4/10, ~-1.2 SD). Speech features are mostly within normal limits.",
            recommended_action="Clinician reviews explanation. Recommend full cognitive battery (e.g., MoCA).",
            model_version="v0.1.0-demo"
        )
    elif persona == "High – speech+memory":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.92,
            ci_low=0.85,
            ci_high=0.98,
            tier="high",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.88, available=True, qc_flags=[],
                    top_contributions=[
                        FeatureContribution(name="Pause time", value=38.0, reference=22.0, shap=0.25, direction="up"),
                        FeatureContribution(name="Info-unit coverage", value=11.0, reference=20.0, shap=0.15, direction="up")
                    ]
                ),
                ModalityResult(
                    name="cognitive", probability=0.95, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=2.0, reference=7.5, shap=0.35, direction="up")]
                )
            ],
            narrative="High risk driven by multiple factors: (1) longer and more frequent pauses before content words (↑ hesitation), (2) lower coverage of key scene elements (11/25), (3) reduced delayed word recall (2/10, ~−1.6 SD).",
            recommended_action="Expedited pathway: confirmatory testing (blood-based biomarkers) + memory-clinic referral.",
            model_version="v0.1.0-demo"
        )
    elif persona == "Indeterminate – poor audio":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.50,
            ci_low=0.10,
            ci_high=0.90,
            tier="indeterminate",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.5, available=False, qc_flags=["Low SNR", "High clipping"],
                    top_contributions=[]
                ),
                ModalityResult(
                    name="cognitive", probability=0.45, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=6.0, reference=7.5, shap=0.05, direction="neutral")]
                )
            ],
            narrative="Indeterminate result due to missing/poor speech data. Cognitive scores are borderline.",
            recommended_action="Repeat screen / alternative assessment.",
            model_version="v0.1.0-demo"
        )
    else:
        return _get_mock_result(session_id, "Low risk")


@app.get("/v1/sessions/{session_id}/result", response_model=RiskResult)
def get_result(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    persona = sessions[session_id].get("persona", "Low risk")
    return _get_mock_result(session_id, persona)


@app.get("/v1/sessions/{session_id}/report")
def get_report(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    html_content = f"<html><body><h1>Clinical Report for Session {session_id}</h1><p>Demo report content...</p></body></html>"
    return HTMLResponse(content=html_content)


@app.get("/v1/sessions/{session_id}/fhir")
def get_fhir(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return JSONResponse(content={"resourceType": "Bundle", "type": "collection", "entry": []})


@app.delete("/v1/sessions/{session_id}")
def delete_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Session not found")


@app.get("/v1/model/card")
def get_model_card():
    return {
        "version": "1.0.0",
        "models": ["speech_v1", "neuropsych_v1", "tabular_risk_v1", "cognitwin_risk_v1"],
        "metrics_file": "reports/cognitwin_metrics.json",
        "disclaimer": "Screening aid, not a diagnosis."
    }


# =============================================================================
# COGNITWIN PATIENT DIGITAL TWIN ENDPOINTS
# =============================================================================
from src.cognisense.twin.db import (
    init_db,
    get_all_patients,
    get_patient_ehr,
    get_patient_wearables,
    get_patient_state_history,
    get_latest_patient_state,
    ingest_wearable_observation,
    record_prediction,
    get_prediction_history,
)
from src.cognisense.twin.state_engine import DailyPatientStateEngine
from src.cognisense.twin.prediction_pipeline import CogniTwinPredictionPipeline, MODEL_SAVE_PATH
from src.cognisense.twin.simulator import WhatIfInterventionSimulator
from src.cognisense.twin.schemas import (
    WearableObservationInput,
    WhatIfSimulationRequest,
    TwinStateComparisonRequest,
)

_cached_twin_pipeline: Optional[CogniTwinPredictionPipeline] = None
_twin_pipeline_lock = threading.Lock()


def get_twin_pipeline() -> CogniTwinPredictionPipeline:
    global _cached_twin_pipeline
    if _cached_twin_pipeline is None:
        with _twin_pipeline_lock:
            if _cached_twin_pipeline is None:
                if os.path.exists(MODEL_SAVE_PATH):
                    try:
                        _cached_twin_pipeline = CogniTwinPredictionPipeline.load(MODEL_SAVE_PATH)
                    except Exception:
                        _cached_twin_pipeline = None
                if _cached_twin_pipeline is None:
                    init_db()
                    df_fused = pd.read_csv("data/fused_patient_dataset_1000.csv")
                    _cached_twin_pipeline = CogniTwinPredictionPipeline(random_state=42)
                    _cached_twin_pipeline.train_and_evaluate(df_fused)
                    _cached_twin_pipeline.save(MODEL_SAVE_PATH)
    return _cached_twin_pipeline


def _extract_patient_features_at_latest_day(patient_id: str) -> Dict[str, Any]:
    ehr = get_patient_ehr(patient_id)
    if not ehr:
        raise HTTPException(status_code=404, detail=f"Patient {patient_id} not found")
    wearables = get_patient_wearables(patient_id)
    if not wearables:
        raise HTTPException(status_code=400, detail=f"No wearable telemetry found for patient {patient_id}")

    df_w = pd.DataFrame(wearables).sort_values("day")
    n_days = len(df_w)

    mean_hrv = float(df_w["mean_hrv_ms"].mean())
    hrv_slope = float((df_w["mean_hrv_ms"].iloc[-1] - df_w["mean_hrv_ms"].iloc[0]) / max(1, n_days - 1))

    mean_rhr = float(df_w["resting_heart_rate_bpm"].mean())
    rhr_slope = float((df_w["resting_heart_rate_bpm"].iloc[-1] - df_w["resting_heart_rate_bpm"].iloc[0]) / max(1, n_days - 1))

    mean_sleep = float(df_w["sleep_duration_hours"].mean())
    sleep_std = float(df_w["sleep_duration_hours"].std()) if n_days > 1 else 0.0
    mean_deep = float(df_w["deep_sleep_hours"].mean())
    deep_ratio = float(mean_deep / max(0.1, mean_sleep))

    mean_steps = float(df_w["steps"].mean())
    steps_slope = float((df_w["steps"].iloc[-1] - df_w["steps"].iloc[0]) / max(1, n_days - 1))
    mean_activity = float(df_w["activity_minutes"].mean())
    avg_quality = float(df_w["data_quality_score"].mean())

    features = {
        "patient_id": patient_id,
        "age": ehr["age"],
        "education_years": ehr["education_years"],
        "hypertension": ehr["hypertension"],
        "diabetes": ehr["diabetes"],
        "dyslipidemia": ehr["dyslipidemia"],
        "previous_mci": ehr["previous_mci"],
        "vitamin_b12_pg_ml": ehr["vitamin_b12_pg_ml"],
        "tsh_uiu_ml": ehr["tsh_uiu_ml"],
        "cholesterol_mg_dl": ehr["cholesterol_mg_dl"],
        "baseline_cognitive_score": ehr["baseline_cognitive_score"],
        "medication_adherence": ehr["medication_adherence"],
        "family_history_ad": ehr["family_history_ad"],
        "genetic_risk_apoe4": ehr["genetic_risk_apoe4"],
        "mean_hrv_ms": round(mean_hrv, 2),
        "hrv_trend_slope": round(hrv_slope, 2),
        "mean_resting_hr_bpm": round(mean_rhr, 2),
        "resting_hr_trend_slope": round(rhr_slope, 2),
        "mean_sleep_hours": round(mean_sleep, 2),
        "sleep_variability_std": round(sleep_std if not np.isnan(sleep_std) else 0.0, 2),
        "mean_deep_sleep_hours": round(mean_deep, 2),
        "deep_sleep_ratio": round(deep_ratio, 2),
        "mean_daily_steps": round(mean_steps, 1),
        "steps_trend_slope": round(steps_slope, 1),
        "mean_activity_minutes": round(mean_activity, 1),
        "wearable_data_quality_score": round(avg_quality, 2),
    }
    return features


@app.get("/v1/twin/patients")
def list_twin_patients():
    """List synthetic cohort patients with persona tags."""
    return get_all_patients()


@app.get("/v1/twin/patients/{patient_id}/ehr")
def get_patient_ehr_endpoint(patient_id: str):
    """Retrieve patient baseline EHR profile."""
    ehr = get_patient_ehr(patient_id)
    if not ehr:
        raise HTTPException(status_code=404, detail="Patient not found")
    return ehr


@app.get("/v1/twin/patients/{patient_id}/wearables")
def get_patient_wearables_endpoint(patient_id: str):
    """Retrieve daily wearable telemetry time series for patient."""
    return get_patient_wearables(patient_id)


@app.post("/v1/twin/patients/{patient_id}/wearables")
def ingest_wearable_endpoint(patient_id: str, obs: WearableObservationInput):
    """Ingest a single daily wearable observation, validates ranges and updates twin state."""
    try:
        updated_state = ingest_wearable_observation(patient_id, obs.model_dump())
        return {"status": "success", "updated_state": updated_state}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/v1/twin/patients/{patient_id}/state-history")
def get_state_history_endpoint(patient_id: str):
    """Retrieve longitudinal daily state records for time scrubber and replay."""
    return get_patient_state_history(patient_id)


@app.get("/v1/twin/patients/{patient_id}/state")
def get_latest_state_endpoint(patient_id: str):
    """Retrieve current digital twin state snapshot."""
    state = get_latest_patient_state(patient_id)
    if not state:
        raise HTTPException(status_code=404, detail="Digital twin state not found for patient")
    return state


@app.post("/v1/twin/patients/{patient_id}/compare-states")
def compare_states_endpoint(patient_id: str, req: TwinStateComparisonRequest):
    """Compare patient digital twin state across two time points."""
    history = get_patient_state_history(patient_id)
    day_map = {s["day"]: s for s in history}
    if req.day_a not in day_map or req.day_b not in day_map:
        raise HTTPException(status_code=400, detail=f"Specified days {req.day_a} or {req.day_b} not in patient state history")
    return DailyPatientStateEngine.compare_states(day_map[req.day_a], day_map[req.day_b])


@app.get("/v1/twin/patients/{patient_id}/prediction")
def get_twin_prediction_endpoint(patient_id: str):
    """
    Generate calibrated 30-day cognitive deterioration prediction for patient
    using observation window data up to current timestamp.
    """
    pipeline = get_twin_pipeline()
    features = _extract_patient_features_at_latest_day(patient_id)
    prediction = pipeline.predict_patient(features)

    # Record to persistent audit trail
    wearables = get_patient_wearables(patient_id)
    pred_day = wearables[-1]["day"] if wearables else 7
    record_prediction(
        patient_id=patient_id,
        prediction_day=pred_day,
        risk_probability=prediction["risk_probability"],
        risk_tier=prediction["risk_tier"],
        ci_low=prediction["confidence_interval_low"],
        ci_high=prediction["confidence_interval_high"],
        top_features=prediction["top_features"],
        model_version=prediction["model_version"]
    )
    return prediction


@app.get("/v1/twin/patients/{patient_id}/prediction-history")
def get_prediction_history_endpoint(patient_id: str):
    """Retrieve longitudinal model predictions audit trail."""
    return get_prediction_history(patient_id)


@app.post("/v1/twin/patients/{patient_id}/simulate")
def simulate_scenario_endpoint(patient_id: str, req: WhatIfSimulationRequest):
    """
    Run what-if counterfactual scenario simulation on patient's current twin state.
    """
    pipeline = get_twin_pipeline()
    features = _extract_patient_features_at_latest_day(patient_id)
    simulator = WhatIfInterventionSimulator(pipeline)
    adjustments = req.model_dump(exclude_none=True)
    return simulator.simulate_scenario(features, adjustments)


@app.post("/v1/twin/patients/{patient_id}/advance-day")
def advance_day_streaming_endpoint(patient_id: str):
    """
    Simulate streaming ingestion of the next day's observation (Day 8, etc.),
    automatically updating the patient's Digital Twin and generating a new prediction.
    """
    wearables = get_patient_wearables(patient_id)
    if not wearables:
        raise HTTPException(status_code=400, detail="No historical readings found")

    last_obs = wearables[-1]
    next_day = last_obs["day"] + 1

    # Look up persona
    ehr = get_patient_ehr(patient_id)
    persona = ehr.get("demo_persona", "Standard Population")

    # Generate next day observation with subtle trajectory continuity
    if "Progressive" in persona:
        next_hrv = max(18.0, last_obs["mean_hrv_ms"] - 3.5)
        next_rhr = min(105.0, last_obs["resting_heart_rate_bpm"] + 1.5)
        next_sleep = max(4.0, last_obs["sleep_duration_hours"] - 0.3)
        next_deep = max(0.4, last_obs["deep_sleep_hours"] - 0.1)
        next_steps = max(1200, last_obs["steps"] - 450)
        next_act = max(15, last_obs["activity_minutes"] - 5)
        quality = 0.93
    elif "Noisy" in persona:
        next_hrv = last_obs["mean_hrv_ms"] + np.random.normal(0, 3)
        next_rhr = last_obs["resting_heart_rate_bpm"] + np.random.normal(0, 2)
        next_sleep = 4.2  # partial night
        next_deep = 0.8
        next_steps = 2200
        next_act = 25
        quality = 0.40  # sensor dropout
    else:
        # Stable
        next_hrv = round(last_obs["mean_hrv_ms"] + float(np.random.normal(0, 1.5)), 1)
        next_rhr = round(last_obs["resting_heart_rate_bpm"] + float(np.random.normal(0, 1.0)), 1)
        next_sleep = round(last_obs["sleep_duration_hours"] + float(np.random.normal(0, 0.2)), 2)
        next_deep = round(last_obs["deep_sleep_hours"] + float(np.random.normal(0, 0.05)), 2)
        next_steps = int(last_obs["steps"] + np.random.normal(0, 200))
        next_act = int(last_obs["activity_minutes"] + np.random.normal(0, 4))
        quality = 0.97

    new_obs_dict = {
        "day": next_day,
        "date": f"2026-10-{next_day:02d}",
        "mean_hrv_ms": round(float(np.clip(next_hrv, 15.0, 120.0)), 1),
        "resting_heart_rate_bpm": round(float(np.clip(next_rhr, 45.0, 115.0)), 1),
        "sleep_duration_hours": round(float(np.clip(next_sleep, 3.0, 11.0)), 2),
        "deep_sleep_hours": round(float(np.clip(next_deep, 0.2, 3.0)), 2),
        "rem_sleep_hours": 1.4,
        "steps": int(np.clip(next_steps, 500, 25000)),
        "activity_minutes": int(np.clip(next_act, 10, 200)),
        "data_quality_score": round(float(quality), 2),
    }

    updated_state = ingest_wearable_observation(patient_id, new_obs_dict)
    prediction = get_twin_prediction_endpoint(patient_id)

    return {
        "message": f"Successfully ingested Day {next_day} streaming telemetry for {patient_id}",
        "new_observation": new_obs_dict,
        "updated_twin_state": updated_state,
        "updated_prediction": prediction,
    }


@app.post("/v1/twin/reset-demo")
def reset_demo_endpoint():
    """Reset SQLite database to original pristine 7-day state."""
    init_db(force_reload=True)
    return {"status": "success", "message": "CogniTwin database reset to initial 7-day state."}

