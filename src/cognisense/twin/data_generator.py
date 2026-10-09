"""
CogniTwin Synthetic Dataset Generator.

Generates realistic, synthetic multimodal datasets for the Patient Digital Twin:
- ehr_static_1000.csv: Demographics, comorbidities, lab values, baseline cognitive scores.
- wearable_timeseries_7days_7000.csv: 7-day longitudinal physiological wearable telemetry.
- fused_patient_dataset_1000.csv: Fused features for future-event prediction.
- future_events.csv: Ground-truth simulated 30-day outcomes.

DISCLAIMER: All generated data is purely synthetic for research and algorithm prototyping.
It must never be presented as real patient data or clinical diagnostic evidence.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd


def generate_ehr_static_dataset(n_samples: int = 1000, seed: int = 42) -> pd.DataFrame:
    """
    Generate synthetic EHR static dataset for 1,000 patients.

    Includes demographics, comorbidities, laboratory values, previous MCI status,
    baseline cognitive scores, medication history, and persona tags for demonstration.
    """
    np.random.seed(seed)
    n = n_samples

    patient_ids = [f"PT-{i:04d}" for i in range(1, n + 1)]
    age = np.random.randint(52, 89, n)
    sex = np.random.choice(["Male", "Female"], n, p=[0.48, 0.52])
    education_years = np.random.randint(6, 21, n)

    # Comorbidities
    hypertension = np.random.choice([0, 1], n, p=[0.60, 0.40])
    diabetes = np.random.choice([0, 1], n, p=[0.75, 0.25])
    dyslipidemia = np.random.choice([0, 1], n, p=[0.68, 0.32])
    previous_mci = np.random.choice([0, 1], n, p=[0.82, 0.18])

    # Laboratory Biomarkers
    vitamin_b12 = np.round(np.random.normal(420, 130, n).clip(150, 950), 1)
    tsh = np.round(np.random.normal(2.4, 1.1, n).clip(0.4, 7.5), 2)
    cholesterol = np.round(np.random.normal(195, 38, n).clip(130, 310), 1)

    # Baseline Cognitive Score (MoCA scale: 10-30, normal >= 26)
    # MCI patients start with lower baseline cognitive score
    base_moca = 26.5 - (previous_mci * 3.8) - ((age - 60) * 0.05) + np.random.normal(0, 2.0, n)
    baseline_cognitive_score = np.round(base_moca.clip(12.0, 30.0), 1)

    # Medication History & Adherence
    med_options = ["No Medication", "Antihypertensive", "Statin", "Antihypertensive+Statin", "Metformin+Statin", "Antihypertensive+Metformin+Statin"]
    medication_history = np.random.choice(med_options, n, p=[0.15, 0.25, 0.20, 0.20, 0.10, 0.10])
    medication_adherence = np.round(np.random.beta(8, 2, n).clip(0.35, 1.0), 2)

    family_history_ad = np.random.choice([0, 1], n, p=[0.75, 0.25])
    genetic_risk_apoe4 = np.random.choice([0, 1], n, p=[0.80, 0.20])

    # Demonstration Personas for judges
    persona = ["Standard Population"] * n
    # PT-0001: Stable Normal
    persona[0] = "Persona 1: Stable Benchmark"
    age[0], sex[0], previous_mci[0], baseline_cognitive_score[0] = 62, "Female", 0, 28.5
    hypertension[0], diabetes[0], dyslipidemia[0] = 0, 0, 0

    # PT-0002: Progressive Physiological Decline
    persona[1] = "Persona 2: Progressive Physiological Decline"
    age[1], sex[1], previous_mci[1], baseline_cognitive_score[1] = 73, "Male", 0, 25.0
    hypertension[1], diabetes[1], dyslipidemia[1] = 1, 0, 1

    # PT-0003: Noisy / Incomplete Wearables
    persona[2] = "Persona 3: Incomplete/Noisy Wearable Telemetry"
    age[2], sex[2], previous_mci[2], baseline_cognitive_score[2] = 68, "Female", 0, 26.0

    # PT-0004: Multi-Domain Elevated Deterioration Risk
    persona[3] = "Persona 4: Multi-Domain Deterioration Risk"
    age[3], sex[3], previous_mci[3], baseline_cognitive_score[3] = 79, "Male", 1, 21.0
    hypertension[3], diabetes[3], dyslipidemia[3] = 1, 1, 1

    df_ehr = pd.DataFrame({
        "patient_id": patient_ids,
        "age": age,
        "sex": sex,
        "education_years": education_years,
        "hypertension": hypertension,
        "diabetes": diabetes,
        "dyslipidemia": dyslipidemia,
        "previous_mci": previous_mci,
        "vitamin_b12_pg_ml": vitamin_b12,
        "tsh_uiu_ml": tsh,
        "cholesterol_mg_dl": cholesterol,
        "baseline_cognitive_score": baseline_cognitive_score,
        "medication_history": medication_history,
        "medication_adherence": medication_adherence,
        "family_history_ad": family_history_ad,
        "genetic_risk_apoe4": genetic_risk_apoe4,
        "demo_persona": persona,
    })

    return df_ehr


def generate_wearable_timeseries_dataset(
    df_ehr: pd.DataFrame,
    days: int = 7,
    start_date: str = "2026-10-01",
    seed: int = 42
) -> pd.DataFrame:
    """
    Generate 7 days of daily wearable readings for each patient (total 7,000 rows).

    Simulates:
    - Mean HRV (ms)
    - Resting Heart Rate (bpm)
    - Sleep Duration (hours)
    - Deep Sleep (hours)
    - REM Sleep (hours)
    - Daily Steps
    - Activity Minutes
    - Data Quality Score (0.0 to 1.0)
    """
    np.random.seed(seed)
    base_dt = datetime.strptime(start_date, "%Y-%m-%d")

    records: List[Dict] = []

    for _, row in df_ehr.iterrows():
        p_id = row["patient_id"]
        persona = row["demo_persona"]
        age = row["age"]
        mci = row["previous_mci"]

        # Base personal baselines
        base_hrv = 60.0 - (age * 0.3) - (mci * 5.0) + np.random.normal(0, 5)
        base_hrv = float(np.clip(base_hrv, 25.0, 75.0))

        base_rhr = 64.0 + (age * 0.08) + (row["hypertension"] * 4.0) + np.random.normal(0, 3)
        base_rhr = float(np.clip(base_rhr, 54.0, 88.0))

        base_sleep = 7.2 - (mci * 0.5) + np.random.normal(0, 0.4)
        base_sleep = float(np.clip(base_sleep, 5.0, 8.8))

        base_steps = 7500 - (age * 45) - (mci * 1000) + np.random.normal(0, 600)
        base_steps = float(np.clip(base_steps, 2500, 11500))

        base_activity = base_steps / 85.0 + np.random.normal(0, 10)
        base_activity = float(np.clip(base_activity, 20, 120))

        for d in range(1, days + 1):
            dt_str = (base_dt + timedelta(days=d - 1)).strftime("%Y-%m-%d")

            # Default variations
            d_hrv = base_hrv + np.random.normal(0, 3.5)
            d_rhr = base_rhr + np.random.normal(0, 2.0)
            d_sleep = base_sleep + np.random.normal(0, 0.4)
            d_steps = base_steps + np.random.normal(0, 500)
            d_activity = base_activity + np.random.normal(0, 8)
            quality = np.random.uniform(0.88, 0.99)

            # Targeted persona trajectory dynamics
            if persona == "Persona 1: Stable Benchmark":
                # Very stable, high quality
                d_hrv = 56.0 + np.random.normal(0, 2)
                d_rhr = 62.0 + np.random.normal(0, 1.5)
                d_sleep = 7.6 + np.random.normal(0, 0.2)
                d_steps = 8200 + np.random.normal(0, 300)
                d_activity = 85.0 + np.random.normal(0, 5)
                quality = 0.98

            elif persona == "Persona 2: Progressive Physiological Decline":
                # Gradual degradation from Day 4 to Day 7
                decline_factor = max(0, d - 3)
                d_hrv = base_hrv - (decline_factor * 6.5) + np.random.normal(0, 1.5)
                d_rhr = base_rhr + (decline_factor * 3.0) + np.random.normal(0, 1.5)
                d_sleep = base_sleep - (decline_factor * 0.7) + np.random.normal(0, 0.2)
                d_steps = base_steps - (decline_factor * 1200) + np.random.normal(0, 200)
                d_activity = base_activity - (decline_factor * 15) + np.random.normal(0, 4)
                quality = 0.94

            elif persona == "Persona 3: Incomplete/Noisy Wearable Telemetry":
                # Sensor dropouts, irregular records, lower quality
                quality = 0.45 if d in [2, 5, 6] else 0.72
                if d in [2, 5]:
                    d_steps = d_steps * 0.35  # partial wearing
                    d_sleep = d_sleep * 0.5   # off wrist during night

            elif persona == "Persona 4: Multi-Domain Deterioration Risk":
                # Chronically low HRV, poor fragmented sleep, low activity
                d_hrv = 28.0 + np.random.normal(0, 2.0)
                d_rhr = 78.0 + np.random.normal(0, 2.0)
                d_sleep = 5.1 + np.random.normal(0, 0.4)
                d_steps = 2900 + np.random.normal(0, 300)
                d_activity = 25.0 + np.random.normal(0, 5)
                quality = 0.90

            # Clip values to physiological ranges
            final_hrv = round(float(np.clip(d_hrv, 15.0, 110.0)), 1)
            final_rhr = round(float(np.clip(d_rhr, 45.0, 115.0)), 1)
            final_sleep = round(float(np.clip(d_sleep, 2.5, 11.5)), 2)

            # Deep sleep (~18-25% of total sleep) and REM sleep (~20-25%)
            deep_ratio = 0.22 if persona != "Persona 2: Progressive Physiological Decline" else max(0.08, 0.22 - (max(0, d - 3) * 0.04))
            rem_ratio = 0.23 if persona != "Persona 4: Multi-Domain Deterioration Risk" else 0.14

            deep_sleep = round(float(np.clip(final_sleep * deep_ratio + np.random.normal(0, 0.05), 0.2, 3.5)), 2)
            rem_sleep = round(float(np.clip(final_sleep * rem_ratio + np.random.normal(0, 0.05), 0.3, 3.5)), 2)
            final_steps = int(np.clip(d_steps, 500, 25000))
            final_activity = int(np.clip(d_activity, 5, 240))
            final_quality = round(float(np.clip(quality, 0.2, 1.0)), 2)

            records.append({
                "patient_id": p_id,
                "day": d,
                "date": dt_str,
                "mean_hrv_ms": final_hrv,
                "resting_heart_rate_bpm": final_rhr,
                "sleep_duration_hours": final_sleep,
                "deep_sleep_hours": deep_sleep,
                "rem_sleep_hours": rem_sleep,
                "steps": final_steps,
                "activity_minutes": final_activity,
                "data_quality_score": final_quality,
            })

    return pd.DataFrame(records)


def fuse_and_generate_target(
    df_ehr: pd.DataFrame,
    df_wearable: pd.DataFrame,
    seed: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Fuse historical EHR features with aggregated 7-day wearable features.
    Computes temporal wearable trends (slope, std) and creates synthetic
    binary ground truth: 'cognitive_deterioration_30d'.

    Returns:
        df_fused: 1,000 rows feature table.
        df_events: 1,000 rows ground truth target table.
    """
    np.random.seed(seed)

    # Aggregate wearable features per patient
    wearable_stats = []
    for p_id, group in df_wearable.groupby("patient_id"):
        grp = group.sort_values("day")
        n_days = len(grp)

        mean_hrv = grp["mean_hrv_ms"].mean()
        hrv_trend = (grp["mean_hrv_ms"].iloc[-1] - grp["mean_hrv_ms"].iloc[0]) / max(1, n_days - 1)

        mean_rhr = grp["resting_heart_rate_bpm"].mean()
        rhr_trend = (grp["resting_heart_rate_bpm"].iloc[-1] - grp["resting_heart_rate_bpm"].iloc[0]) / max(1, n_days - 1)

        mean_sleep = grp["sleep_duration_hours"].mean()
        sleep_std = grp["sleep_duration_hours"].std() if n_days > 1 else 0.0
        mean_deep = grp["deep_sleep_hours"].mean()
        deep_sleep_ratio = mean_deep / max(0.1, mean_sleep)

        mean_steps = grp["steps"].mean()
        steps_trend = (grp["steps"].iloc[-1] - grp["steps"].iloc[0]) / max(1, n_days - 1)
        mean_activity = grp["activity_minutes"].mean()
        avg_quality = grp["data_quality_score"].mean()

        wearable_stats.append({
            "patient_id": p_id,
            "mean_hrv_ms": round(mean_hrv, 2),
            "hrv_trend_slope": round(hrv_trend, 2),
            "mean_resting_hr_bpm": round(mean_rhr, 2),
            "resting_hr_trend_slope": round(rhr_trend, 2),
            "mean_sleep_hours": round(mean_sleep, 2),
            "sleep_variability_std": round(sleep_std if not np.isnan(sleep_std) else 0.0, 2),
            "mean_deep_sleep_hours": round(mean_deep, 2),
            "deep_sleep_ratio": round(deep_sleep_ratio, 2),
            "mean_daily_steps": round(mean_steps, 1),
            "steps_trend_slope": round(steps_trend, 1),
            "mean_activity_minutes": round(mean_activity, 1),
            "wearable_data_quality_score": round(avg_quality, 2),
        })

    df_wearable_agg = pd.DataFrame(wearable_stats)
    df_fused = pd.merge(df_ehr, df_wearable_agg, on="patient_id", how="inner")

    # Generate Synthetic Deterioration Target (30-day cognitive deterioration)
    # Biological plausibility formula:
    # Older age + previous MCI + lower baseline cognitive score + declining sleep/HRV + poor adherence
    age_term = (df_fused["age"] - 50) * 0.04
    cog_term = (28.0 - df_fused["baseline_cognitive_score"]) * 0.22
    mci_term = df_fused["previous_mci"] * 1.5
    apoe_term = df_fused["genetic_risk_apoe4"] * 0.8
    hrv_term = (45.0 - df_fused["mean_hrv_ms"]) * 0.03 - (df_fused["hrv_trend_slope"] * 0.15)
    sleep_term = (7.0 - df_fused["mean_sleep_hours"]) * 0.25 + (df_fused["sleep_variability_std"] * 0.4)
    deep_term = (0.22 - df_fused["deep_sleep_ratio"]) * 2.5
    step_term = (6000 - df_fused["mean_daily_steps"]) * 0.0002 - (df_fused["steps_trend_slope"] * 0.001)
    comorb_term = (df_fused["hypertension"] + df_fused["diabetes"] + df_fused["dyslipidemia"]) * 0.25
    adh_term = (1.0 - df_fused["medication_adherence"]) * 0.6

    latent_risk = (
        age_term + cog_term + mci_term + apoe_term +
        hrv_term + sleep_term + deep_term + step_term +
        comorb_term + adh_term - 3.8
    )

    noise = np.random.normal(0, 0.45, len(df_fused))
    latent_prob = 1.0 / (1.0 + np.exp(-(latent_risk + noise)))

    # Force personas to have distinct predictable states for clear judge review
    # Persona 1: Stable Normal -> 0
    # Persona 2: Progressive Physiological Decline -> 1
    # Persona 3: Incomplete Wearable -> 0 (or lower risk, high uncertainty)
    # Persona 4: High Deterioration Risk -> 1
    deterioration_label = (latent_prob >= 0.50).astype(int)

    for idx, row in df_fused.iterrows():
        if row["demo_persona"] == "Persona 1: Stable Benchmark":
            deterioration_label[idx] = 0
        elif row["demo_persona"] == "Persona 2: Progressive Physiological Decline":
            deterioration_label[idx] = 1
        elif row["demo_persona"] == "Persona 3: Incomplete/Noisy Wearable Telemetry":
            deterioration_label[idx] = 0
        elif row["demo_persona"] == "Persona 4: Multi-Domain Deterioration Risk":
            deterioration_label[idx] = 1

    df_fused["cognitive_deterioration_30d"] = deterioration_label

    df_events = pd.DataFrame({
        "patient_id": df_fused["patient_id"],
        "observation_window_days": 7,
        "prediction_horizon_days": 30,
        "cognitive_deterioration_30d": deterioration_label,
        "event_definition": "Simulated cognitive deterioration >= 2 points on MoCA scale within 30-day window",
        "is_synthetic": True,
    })

    return df_fused, df_events


def generate_all_twin_datasets(output_dir: str = "data", seed: int = 42) -> Dict[str, str]:
    """
    Generate and save all CogniTwin synthetic datasets to output directory.
    """
    import os
    os.makedirs(output_dir, exist_ok=True)

    df_ehr = generate_ehr_static_dataset(n_samples=1000, seed=seed)
    df_wearable = generate_wearable_timeseries_dataset(df_ehr, days=7, seed=seed)
    df_fused, df_events = fuse_and_generate_target(df_ehr, df_wearable, seed=seed)

    paths = {
        "ehr": os.path.join(output_dir, "ehr_static_1000.csv"),
        "wearable": os.path.join(output_dir, "wearable_timeseries_7days_7000.csv"),
        "fused": os.path.join(output_dir, "fused_patient_dataset_1000.csv"),
        "events": os.path.join(output_dir, "future_events.csv"),
    }

    df_ehr.to_csv(paths["ehr"], index=False)
    df_wearable.to_csv(paths["wearable"], index=False)
    df_fused.to_csv(paths["fused"], index=False)
    df_events.to_csv(paths["events"], index=False)

    return paths
