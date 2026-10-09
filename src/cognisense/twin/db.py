"""
CogniTwin Persistent Database & Data Access Layer.

Uses SQLite to maintain persistent state records for patients, daily wearable
telemetry, cognitive assessments, daily state progression, and predictions.
"""

import json
import os
import sqlite3
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import pandas as pd

from src.cognisense.twin.data_generator import (
    generate_all_twin_datasets,
    generate_ehr_static_dataset,
    generate_wearable_timeseries_dataset,
)
from src.cognisense.twin.state_engine import DailyPatientStateEngine

DEFAULT_DB_PATH = os.path.join("data", "cognitwin.db")


def get_db_connection(db_path: str = DEFAULT_DB_PATH) -> sqlite3.Connection:
    """Create and return a SQLite connection with row factory enabled."""
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: str = DEFAULT_DB_PATH, force_reload: bool = False) -> None:
    """
    Initialize SQLite tables and seed with synthetic dataset if empty.
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    # 1. EHR static table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients_ehr (
            patient_id TEXT PRIMARY KEY,
            age INTEGER NOT NULL,
            sex TEXT NOT NULL,
            education_years INTEGER NOT NULL,
            hypertension INTEGER NOT NULL,
            diabetes INTEGER NOT NULL,
            dyslipidemia INTEGER NOT NULL,
            previous_mci INTEGER NOT NULL,
            vitamin_b12_pg_ml REAL NOT NULL,
            tsh_uiu_ml REAL NOT NULL,
            cholesterol_mg_dl REAL NOT NULL,
            baseline_cognitive_score REAL NOT NULL,
            medication_history TEXT NOT NULL,
            medication_adherence REAL NOT NULL,
            family_history_ad INTEGER NOT NULL,
            genetic_risk_apoe4 INTEGER NOT NULL,
            demo_persona TEXT NOT NULL
        )
    """)

    # 2. Daily wearable observations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS wearable_observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            day INTEGER NOT NULL,
            date TEXT NOT NULL,
            mean_hrv_ms REAL NOT NULL,
            resting_heart_rate_bpm REAL NOT NULL,
            sleep_duration_hours REAL NOT NULL,
            deep_sleep_hours REAL NOT NULL,
            rem_sleep_hours REAL NOT NULL,
            steps INTEGER NOT NULL,
            activity_minutes INTEGER NOT NULL,
            data_quality_score REAL NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(patient_id, day),
            FOREIGN KEY(patient_id) REFERENCES patients_ehr(patient_id)
        )
    """)

    # 3. Cognitive assessments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cognitive_assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            day INTEGER NOT NULL,
            date TEXT NOT NULL,
            score REAL NOT NULL,
            memory_recall REAL NOT NULL,
            speech_pause_duration_s REAL NOT NULL,
            trails_time_sec REAL NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(patient_id) REFERENCES patients_ehr(patient_id)
        )
    """)

    # 4. Daily patient states table (time-indexed digital twin state history)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_patient_states (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            day INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            twin_state TEXT NOT NULL,
            state_reason TEXT NOT NULL,
            mean_hrv_ms REAL NOT NULL,
            resting_heart_rate_bpm REAL NOT NULL,
            sleep_duration_hours REAL NOT NULL,
            deep_sleep_hours REAL NOT NULL,
            steps INTEGER NOT NULL,
            activity_minutes INTEGER NOT NULL,
            data_quality_score REAL NOT NULL,
            rolling_3d_json TEXT NOT NULL,
            rolling_7d_json TEXT NOT NULL,
            baseline_diff_json TEXT NOT NULL,
            state_updated_at TEXT NOT NULL,
            UNIQUE(patient_id, day),
            FOREIGN KEY(patient_id) REFERENCES patients_ehr(patient_id)
        )
    """)

    # 5. Twin predictions history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS twin_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            prediction_day INTEGER NOT NULL,
            predicted_outcome TEXT NOT NULL,
            prediction_horizon_days INTEGER NOT NULL,
            risk_probability REAL NOT NULL,
            risk_tier TEXT NOT NULL,
            confidence_interval_low REAL NOT NULL,
            confidence_interval_high REAL NOT NULL,
            top_features_json TEXT NOT NULL,
            model_version TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(patient_id) REFERENCES patients_ehr(patient_id)
        )
    """)

    # 6. Future ground truth events table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS future_events (
            patient_id TEXT PRIMARY KEY,
            cognitive_deterioration_30d INTEGER NOT NULL,
            observation_window_days INTEGER NOT NULL,
            prediction_horizon_days INTEGER NOT NULL,
            FOREIGN KEY(patient_id) REFERENCES patients_ehr(patient_id)
        )
    """)

    conn.commit()

    # Check if empty or force reload
    cursor.execute("SELECT COUNT(*) FROM patients_ehr")
    count = cursor.fetchone()[0]

    if count == 0 or force_reload:
        if force_reload:
            cursor.execute("DELETE FROM wearable_observations")
            cursor.execute("DELETE FROM cognitive_assessments")
            cursor.execute("DELETE FROM daily_patient_states")
            cursor.execute("DELETE FROM twin_predictions")
            cursor.execute("DELETE FROM future_events")
            cursor.execute("DELETE FROM patients_ehr")
            conn.commit()

        # Seed data
        seed_database_from_generators(conn)

    conn.close()


def seed_database_from_generators(conn: sqlite3.Connection) -> None:
    """Generate datasets and populate SQLite tables."""
    print("Seeding CogniTwin SQLite database from synthetic generators...")
    paths = generate_all_twin_datasets(output_dir="data", seed=42)

    df_ehr = pd.read_csv(paths["ehr"], keep_default_na=False)
    df_ehr["medication_history"] = df_ehr["medication_history"].replace({"": "No Medication", "None": "No Medication"}).fillna("No Medication")
    df_wearable = pd.read_csv(paths["wearable"])
    df_events = pd.read_csv(paths["events"])

    # 1. Insert patients_ehr
    df_ehr.to_sql("patients_ehr", conn, if_exists="append", index=False)

    # 2. Insert wearable_observations
    now_str = datetime.now(timezone.utc).isoformat()
    wearable_records = df_wearable.to_dict(orient="records")
    for r in wearable_records:
        r["created_at"] = now_str
    df_wearable_with_time = pd.DataFrame(wearable_records)
    df_wearable_with_time.to_sql("wearable_observations", conn, if_exists="append", index=False)

    # 3. Insert future_events
    events_records = df_events[["patient_id", "cognitive_deterioration_30d", "observation_window_days", "prediction_horizon_days"]]
    events_records.to_sql("future_events", conn, if_exists="append", index=False)

    # 4. Insert baseline cognitive assessment for all patients
    cog_records = []
    for _, row in df_ehr.iterrows():
        p_id = row["patient_id"]
        score = float(row["baseline_cognitive_score"])
        cog_records.append({
            "patient_id": p_id,
            "day": 1,
            "date": "2026-10-01",
            "score": score,
            "memory_recall": round(score * 0.35, 1),
            "speech_pause_duration_s": 1.2 if score >= 26 else 2.1,
            "trails_time_sec": 32.0 if score >= 26 else 55.0,
            "created_at": now_str,
        })
    pd.DataFrame(cog_records).to_sql("cognitive_assessments", conn, if_exists="append", index=False)

    # 5. Pre-compute daily states for all 1,000 patients across Day 1 to 7
    engine = DailyPatientStateEngine()
    cursor = conn.cursor()

    ehr_dict_map = {r["patient_id"]: r for r in df_ehr.to_dict(orient="records")}
    wearable_by_patient = {}
    for w in wearable_records:
        wearable_by_patient.setdefault(w["patient_id"], []).append(w)

    daily_state_inserts = []
    for p_id, p_ehr in ehr_dict_map.items():
        p_wear = wearable_by_patient.get(p_id, [])
        states = engine.compute_daily_state_for_patient(p_ehr, p_wear)
        for s in states:
            daily_state_inserts.append((
                s["patient_id"],
                s["day"],
                s["timestamp"],
                s["twin_state"],
                s["state_reason"],
                s["mean_hrv_ms"],
                s["resting_heart_rate_bpm"],
                s["sleep_duration_hours"],
                s["deep_sleep_hours"],
                s["steps"],
                s["activity_minutes"],
                s["data_quality_score"],
                json.dumps(s["rolling_3day_features"]),
                json.dumps(s["rolling_7day_features"]),
                json.dumps(s["change_from_personal_baseline"]),
                s["state_updated_at"]
            ))

    cursor.executemany("""
        INSERT INTO daily_patient_states (
            patient_id, day, timestamp, twin_state, state_reason,
            mean_hrv_ms, resting_heart_rate_bpm, sleep_duration_hours, deep_sleep_hours,
            steps, activity_minutes, data_quality_score,
            rolling_3d_json, rolling_7d_json, baseline_diff_json, state_updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, daily_state_inserts)

    conn.commit()
    print(f"Successfully seeded {len(ehr_dict_map)} patients and {len(daily_state_inserts)} daily state records.")


def get_all_patients(db_path: str = DEFAULT_DB_PATH) -> List[Dict[str, Any]]:
    """Get summarized list of all patients."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT patient_id, age, sex, education_years, previous_mci, baseline_cognitive_score, demo_persona
        FROM patients_ehr
        ORDER BY patient_id ASC
    """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_patient_ehr(patient_id: str, db_path: str = DEFAULT_DB_PATH) -> Optional[Dict[str, Any]]:
    """Get full EHR record for a single patient."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients_ehr WHERE patient_id = ?", (patient_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_patient_wearables(patient_id: str, db_path: str = DEFAULT_DB_PATH) -> List[Dict[str, Any]]:
    """Get all wearable observations for a patient sorted by day."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wearable_observations WHERE patient_id = ? ORDER BY day ASC", (patient_id,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_patient_state_history(patient_id: str, db_path: str = DEFAULT_DB_PATH) -> List[Dict[str, Any]]:
    """Get all historical daily states for a patient."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM daily_patient_states WHERE patient_id = ? ORDER BY day ASC", (patient_id,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        d["rolling_3day_features"] = json.loads(d["rolling_3d_json"])
        d["rolling_7day_features"] = json.loads(d["rolling_7d_json"])
        d["change_from_personal_baseline"] = json.loads(d["baseline_diff_json"])
        result.append(d)
    return result


def get_latest_patient_state(patient_id: str, db_path: str = DEFAULT_DB_PATH) -> Optional[Dict[str, Any]]:
    """Get the most recent daily state for a patient."""
    history = get_patient_state_history(patient_id, db_path)
    return history[-1] if history else None


def ingest_wearable_observation(
    patient_id: str,
    observation: Dict[str, Any],
    db_path: str = DEFAULT_DB_PATH
) -> Dict[str, Any]:
    """
    Ingest a new daily wearable observation, validate ranges, update daily states,
    and persist new twin state.
    """
    # 1. Validation
    day = int(observation["day"])
    mean_hrv = float(observation["mean_hrv_ms"])
    resting_hr = float(observation["resting_heart_rate_bpm"])
    sleep_dur = float(observation["sleep_duration_hours"])
    deep_sleep = float(observation["deep_sleep_hours"])
    rem_sleep = float(observation.get("rem_sleep_hours", 1.2))
    steps = int(observation["steps"])
    activity_min = int(observation["activity_minutes"])
    data_quality = float(observation.get("data_quality_score", 0.95))
    date_str = str(observation.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d")))

    if not (5.0 <= mean_hrv <= 250.0):
        raise ValueError(f"Invalid mean_hrv_ms: {mean_hrv}. Expected between 5 and 250 ms.")
    if not (30.0 <= resting_hr <= 220.0):
        raise ValueError(f"Invalid resting_heart_rate_bpm: {resting_hr}. Expected between 30 and 220 bpm.")
    if not (0.0 <= sleep_dur <= 24.0):
        raise ValueError(f"Invalid sleep_duration_hours: {sleep_dur}. Expected between 0 and 24 hours.")
    if not (0.0 <= deep_sleep <= sleep_dur):
        raise ValueError(f"Deep sleep ({deep_sleep}) cannot exceed total sleep duration ({sleep_dur}).")
    if steps < 0:
        raise ValueError(f"Steps cannot be negative: {steps}.")

    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    # Check patient exists
    cursor.execute("SELECT * FROM patients_ehr WHERE patient_id = ?", (patient_id,))
    patient_ehr = cursor.fetchone()
    if not patient_ehr:
        conn.close()
        raise ValueError(f"Patient ID {patient_id} not found in database.")

    now_str = datetime.now(timezone.utc).isoformat()

    # Insert or update wearable observation
    cursor.execute("""
        INSERT INTO wearable_observations (
            patient_id, day, date, mean_hrv_ms, resting_heart_rate_bpm,
            sleep_duration_hours, deep_sleep_hours, rem_sleep_hours,
            steps, activity_minutes, data_quality_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(patient_id, day) DO UPDATE SET
            mean_hrv_ms = excluded.mean_hrv_ms,
            resting_heart_rate_bpm = excluded.resting_heart_rate_bpm,
            sleep_duration_hours = excluded.sleep_duration_hours,
            deep_sleep_hours = excluded.deep_sleep_hours,
            rem_sleep_hours = excluded.rem_sleep_hours,
            steps = excluded.steps,
            activity_minutes = excluded.activity_minutes,
            data_quality_score = excluded.data_quality_score,
            created_at = excluded.created_at
    """, (
        patient_id, day, date_str, mean_hrv, resting_hr,
        sleep_dur, deep_sleep, rem_sleep, steps, activity_min,
        data_quality, now_str
    ))
    conn.commit()

    # 2. Re-compute daily states for this patient
    cursor.execute("SELECT * FROM wearable_observations WHERE patient_id = ? ORDER BY day ASC", (patient_id,))
    all_wearables = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM cognitive_assessments WHERE patient_id = ? ORDER BY day ASC", (patient_id,))
    all_cog = [dict(r) for r in cursor.fetchall()]

    engine = DailyPatientStateEngine()
    states = engine.compute_daily_state_for_patient(dict(patient_ehr), all_wearables, all_cog)

    for s in states:
        cursor.execute("""
            INSERT INTO daily_patient_states (
                patient_id, day, timestamp, twin_state, state_reason,
                mean_hrv_ms, resting_heart_rate_bpm, sleep_duration_hours, deep_sleep_hours,
                steps, activity_minutes, data_quality_score,
                rolling_3d_json, rolling_7d_json, baseline_diff_json, state_updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(patient_id, day) DO UPDATE SET
                twin_state = excluded.twin_state,
                state_reason = excluded.state_reason,
                mean_hrv_ms = excluded.mean_hrv_ms,
                resting_heart_rate_bpm = excluded.resting_heart_rate_bpm,
                sleep_duration_hours = excluded.sleep_duration_hours,
                deep_sleep_hours = excluded.deep_sleep_hours,
                steps = excluded.steps,
                activity_minutes = excluded.activity_minutes,
                data_quality_score = excluded.data_quality_score,
                rolling_3d_json = excluded.rolling_3d_json,
                rolling_7d_json = excluded.rolling_7d_json,
                baseline_diff_json = excluded.baseline_diff_json,
                state_updated_at = excluded.state_updated_at
        """, (
            s["patient_id"], s["day"], s["timestamp"], s["twin_state"], s["state_reason"],
            s["mean_hrv_ms"], s["resting_heart_rate_bpm"], s["sleep_duration_hours"], s["deep_sleep_hours"],
            s["steps"], s["activity_minutes"], s["data_quality_score"],
            json.dumps(s["rolling_3day_features"]),
            json.dumps(s["rolling_7day_features"]),
            json.dumps(s["change_from_personal_baseline"]),
            s["state_updated_at"]
        ))

    conn.commit()
    conn.close()

    return states[-1]


def record_prediction(
    patient_id: str,
    prediction_day: int,
    risk_probability: float,
    risk_tier: str,
    ci_low: float,
    ci_high: float,
    top_features: List[Dict[str, Any]],
    model_version: str = "v1.0.0-poc",
    db_path: str = DEFAULT_DB_PATH
) -> None:
    """Save a patient-level prediction to audit trail."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    now_str = datetime.now(timezone.utc).isoformat()
    cursor.execute("""
        INSERT INTO twin_predictions (
            patient_id, prediction_day, predicted_outcome, prediction_horizon_days,
            risk_probability, risk_tier, confidence_interval_low, confidence_interval_high,
            top_features_json, model_version, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        patient_id,
        prediction_day,
        "cognitive_deterioration_30d",
        30,
        risk_probability,
        risk_tier,
        ci_low,
        ci_high,
        json.dumps(top_features),
        model_version,
        now_str
    ))
    conn.commit()
    conn.close()


def get_prediction_history(patient_id: str, db_path: str = DEFAULT_DB_PATH) -> List[Dict[str, Any]]:
    """Retrieve prediction audit history for a patient."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM twin_predictions WHERE patient_id = ? ORDER BY prediction_day ASC, created_at ASC
    """, (patient_id,))
    rows = cursor.fetchall()
    conn.close()
    res = []
    for r in rows:
        d = dict(r)
        d["top_features"] = json.loads(d["top_features_json"])
        res.append(d)
    return res


def export_twin_tables_to_csv(output_dir: str = "data", db_path: str = DEFAULT_DB_PATH) -> Dict[str, str]:
    """Export daily state and history tables to CSV files."""
    os.makedirs(output_dir, exist_ok=True)
    conn = get_db_connection(db_path)

    df_daily = pd.read_sql_query("SELECT * FROM daily_patient_states", conn)
    daily_csv = os.path.join(output_dir, "patient_daily_state.csv")
    df_daily.to_csv(daily_csv, index=False)

    history_csv = os.path.join(output_dir, "twin_state_history.csv")
    df_daily[["patient_id", "day", "timestamp", "twin_state", "state_reason", "state_updated_at"]].to_csv(history_csv, index=False)

    df_preds = pd.read_sql_query("SELECT * FROM twin_predictions", conn)
    preds_csv = os.path.join(output_dir, "prediction_history.csv")
    df_preds.to_csv(preds_csv, index=False)

    conn.close()
    return {
        "daily_state": daily_csv,
        "state_history": history_csv,
        "prediction_history": preds_csv,
    }
