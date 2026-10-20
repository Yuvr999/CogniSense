"""
CogniTwin End-to-End Demonstration Script for Challenge Judges.

Demonstrates the complete Patient Digital Twin lifecycle in sequential steps:
1. Load synthetic patient cohort and baseline EHR.
2. Inspect longitudinal wearable telemetry and compute daily patient states.
3. Observe digital twin state transitions and personal baseline deviations.
4. Generate calibrated 30-day cognitive deterioration prediction.
5. Display SHAP-based feature attributions.
6. Run interactive what-if counterfactual intervention simulation.
7. Ingest simulated Day 8 streaming observation and observe live twin evolution.
"""

import os
import sys
import json
from datetime import datetime, timezone

# Ensure project root is in sys.path and handle Windows console encoding
sys.path.insert(0, os.path.abspath("."))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from src.cognisense.twin.db import (
    init_db,
    get_all_patients,
    get_patient_ehr,
    get_patient_wearables,
    get_patient_state_history,
    ingest_wearable_observation,
)
from src.cognisense.twin.state_engine import DailyPatientStateEngine
from src.cognisense.twin.prediction_pipeline import CogniTwinPredictionPipeline, MODEL_SAVE_PATH
from src.cognisense.twin.simulator import WhatIfInterventionSimulator


def print_banner(text: str):
    print("\n" + "=" * 75)
    print(f" {text}")
    print("=" * 75)


def run_demo():
    print_banner("HAPPIEST HEALTH CRP CHALLENGE 2026: COGNITWIN DEMONSTRATION")
    print("Initializing persistent Digital Twin database & ML pipeline...")
    init_db()

    # Load ML Model
    if os.path.exists(MODEL_SAVE_PATH):
        pipeline = CogniTwinPredictionPipeline.load(MODEL_SAVE_PATH)
    else:
        import pandas as pd
        df_fused = pd.read_csv("data/fused_patient_dataset_1000.csv")
        pipeline = CogniTwinPredictionPipeline(random_state=42)
        pipeline.train_and_evaluate(df_fused)
        pipeline.save(MODEL_SAVE_PATH)

    simulator = WhatIfInterventionSimulator(pipeline)

    # STEP 1: Select Demo Patient (PT-0002: Progressive Physiological Decline)
    demo_pid = "PT-0002"
    ehr = get_patient_ehr(demo_pid)
    print_banner(f"STEP 1: Load Patient Record — {demo_pid}")
    print(f"Patient ID             : {ehr['patient_id']}")
    print(f"Cohort Persona         : {ehr['demo_persona']}")
    print(f"Demographics           : {ehr['sex']}, {ehr['age']} years old, Education: {ehr['education_years']} yrs")
    print(f"Cardiometabolic Status : Hypertension={ehr['hypertension']}, Diabetes={ehr['diabetes']}, Dyslipidemia={ehr['dyslipidemia']}")
    print(f"Prior MCI Status       : {'Yes' if ehr['previous_mci'] else 'No'}")
    print(f"Laboratory Biomarkers  : Vit B12={ehr['vitamin_b12_pg_ml']} pg/mL, TSH={ehr['tsh_uiu_ml']} uIU/mL, Chol={ehr['cholesterol_mg_dl']} mg/dL")
    print(f"Baseline MoCA Score    : {ehr['baseline_cognitive_score']} / 30")
    print(f"Medication History     : {ehr['medication_history']} (Adherence: {int(ehr['medication_adherence']*100)}%)")

    # STEP 2: Wearable Telemetry & Daily State History
    wearables = get_patient_wearables(demo_pid)
    states = get_patient_state_history(demo_pid)
    print_banner(f"STEP 2 & 3: Longitudinal Daily Telemetry & Digital Twin State Evolution")
    print(f"{'Day':4s} | {'HRV (ms)':8s} | {'Resting HR':10s} | {'Sleep (h)':9s} | {'Deep (h)':8s} | {'Steps':6s} | {'Quality':7s} | {'Digital Twin State':26s}")
    print("-" * 105)
    for s in states:
        print(f"Day {s['day']:<2d} | {s['mean_hrv_ms']:<8.1f} | {s['resting_heart_rate_bpm']:<10.1f} | {s['sleep_duration_hours']:<9.2f} | {s['deep_sleep_hours']:<8.2f} | {s['steps']:<6d} | {s['data_quality_score']:<7.2f} | {s['twin_state']:<26s}")

    # STEP 4: State Transition Diff
    print_banner(f"STEP 4: Detection of Meaningful Deviation (Day 3 vs Day 7 State Diff)")
    diff = DailyPatientStateEngine.compare_states(states[2], states[6])
    print(f"State Shift: {diff['state_transition'].replace('→', '->')}")
    print("Biomarker Shifts from Day 3 to Day 7:")
    for feat, delta_info in diff["changed_features"].items():
        print(f"  * {feat:25s}: {delta_info['from']:>6} -> {delta_info['to']:>6}  (Delta: {delta_info['delta']:+})")
    print(f"\nCurrent Twin Rationale:\n  \"{diff['current_reason']}\"")

    # STEP 5: Calibrated 30-Day Deterioration Prediction
    print_banner("STEP 5: Calibrated Future-Event Prediction (30-Day Horizon)")
    import pandas as pd
    import numpy as np
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
        "patient_id": demo_pid,
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

    pred = pipeline.predict_patient(features)
    print(f"Target Outcome         : {pred['predicted_outcome']}")
    print(f"Prediction Horizon     : {pred['prediction_horizon_days']} Days")
    print(f"Calibrated Probability : {pred['risk_probability']*100:.1f}%")
    print(f"Risk Tier              : {pred['risk_tier']}")
    print(f"95% Confidence Interval: [{pred['confidence_interval_low']*100:.1f}%, {pred['confidence_interval_high']*100:.1f}%]")
    print(f"Model Version          : {pred['model_version']}")

    # STEP 6: Model Explainability (SHAP attributions)
    print_banner("STEP 6: Explainability & Biomarker Attribution (SHAP)")
    print(f"{'Biomarker':35s} | {'Patient Value':14s} | {'Cohort Ref':10s} | {'Attribution Impact':18s} | {'Direction'}")
    print("-" * 95)
    for feat in pred["top_features"]:
        dir_str = "[+] Increases Risk" if feat["direction"] == "up" else "[-] Protective"
        print(f"{feat['name']:35s} | {feat['value']:<14.2f} | {feat['reference']:<10.2f} | {feat['impact']:<18.3f} | {dir_str}")

    # STEP 7: What-If Counterfactual Intervention Simulator
    print_banner("STEP 7: What-If Counterfactual Intervention Simulation")
    hypo_adjustments = {
        "sleep_duration_delta": +1.5,
        "daily_steps_delta": +3000,
        "hrv_ms_delta": +10.0,
        "medication_adherence": 0.95,
    }
    print("Hypothetical Clinician Adjustments Applied:")
    for k, v in hypo_adjustments.items():
        print(f"  * {k}: {v}")

    sim_res = simulator.simulate_scenario(features, hypo_adjustments)
    print(f"\nBaseline Deterioration Risk : {sim_res['baseline']['risk_probability']*100:.1f}% ({sim_res['baseline']['risk_tier']})")
    print(f"Scenario Counterfactual Risk: {sim_res['scenario']['risk_probability']*100:.1f}% ({sim_res['scenario']['risk_tier']})")
    print(f"Risk Probability Delta      : {sim_res['probability_delta']*100:+.1f}%")
    print(f"Tier Transition             : {sim_res['tier_transition']}")
    print(f"\nSensitivity Disclaimer:\n  \"{sim_res['disclaimer']}\"")

    # STEP 8: Streaming Ingestion of Day 8 Telemetry
    print_banner("STEP 8: Dynamic Ingestion of Day 8 Telemetry (Streaming Simulation)")
    day_8_reading = {
        "day": 8,
        "date": "2026-10-08",
        "mean_hrv_ms": 22.5,
        "resting_heart_rate_bpm": 81.2,
        "sleep_duration_hours": 4.0,
        "deep_sleep_hours": 0.4,
        "rem_sleep_hours": 0.9,
        "steps": 1900,
        "activity_minutes": 15,
        "data_quality_score": 0.95,
    }
    print(f"Ingesting Day 8 sensor observation for {demo_pid}...")
    updated_state = ingest_wearable_observation(demo_pid, day_8_reading)
    print(f"Observation persisted successfully!")
    print(f"Updated Digital Twin State : {updated_state['twin_state']}")
    print(f"Updated State Reason       : \"{updated_state['state_reason']}\"")
    print(f"Total Available States Now : {len(get_patient_state_history(demo_pid))} days")

    print_banner("DEMO COMPLETED SUCCESSFULLY")
    print("You can explore the interactive visual UI at:")
    print("  • Streamlit Dashboard: streamlit run frontend/streamlit/Home.py (or app/Home.py)")
    print("  • React Web Portal   : cd frontend/react && npm run dev (or cd web && npm run dev)")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    run_demo()
