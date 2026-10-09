"""
CogniTwin Clinician Digital Twin Dashboard.

Provides longitudinal physiological monitoring, daily patient state replay,
calibrated 30-day cognitive deterioration risk prediction, explainability,
and what-if intervention counterfactual simulation.

DISCLAIMER: Research prototype using synthetic data.
Predictions are not clinically validated and must not be used for diagnosis or treatment.
"""

import json
import os
import sys
from datetime import datetime
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Ensure root path is accessible
sys.path.insert(0, os.path.abspath("."))

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
from src.cognisense.twin.state_engine import (
    DailyPatientStateEngine,
    STATE_STABLE,
    STATE_PHYSIOLOGICAL_DECLINE,
    STATE_DATA_QUALITY_ALERT,
    STATE_COGNITIVE_RISK_ELEVATED,
    STATE_INITIALIZING,
)
from src.cognisense.twin.prediction_pipeline import CogniTwinPredictionPipeline, MODEL_SAVE_PATH
from src.cognisense.twin.simulator import WhatIfInterventionSimulator

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION & BRANDING
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="CogniTwin — Clinician Digital Twin Dashboard",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Healthcare Styling: Deep Navy, Off-White, Teal, Polished Cards
st.markdown("""
<style>
    .reportview-container {
        background-color: #F8FAFC;
    }
    .badge-stable {
        background-color: #E6F4EA; color: #137333; font-weight: 600;
        padding: 4px 10px; border-radius: 6px; display: inline-block;
    }
    .badge-decline {
        background-color: #FEF7E0; color: #B06000; font-weight: 600;
        padding: 4px 10px; border-radius: 6px; display: inline-block;
    }
    .badge-elevated {
        background-color: #FCE8E6; color: #C5221F; font-weight: 600;
        padding: 4px 10px; border-radius: 6px; display: inline-block;
    }
    .badge-quality {
        background-color: #F1F3F4; color: #5F6368; font-weight: 600;
        padding: 4px 10px; border-radius: 6px; display: inline-block;
    }
    .twin-metric-card {
        background-color: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .disclaimer-banner {
        background-color: #EFF6FF;
        border-left: 4px solid #3B82F6;
        padding: 10px 14px;
        margin-bottom: 16px;
        border-radius: 4px;
        font-size: 13px;
        color: #1E3A8A;
    }
</style>
""", unsafe_allow_html=True)

# Ensure DB initialized
init_db()

# Load cached ML Pipeline
@st.cache_resource
def load_ml_pipeline():
    if os.path.exists(MODEL_SAVE_PATH):
        try:
            return CogniTwinPredictionPipeline.load(MODEL_SAVE_PATH)
        except Exception:
            pass
    # If not yet trained, train on fused dataset
    df_fused = pd.read_csv("data/fused_patient_dataset_1000.csv")
    pipe = CogniTwinPredictionPipeline(random_state=42)
    pipe.train_and_evaluate(df_fused)
    pipe.save(MODEL_SAVE_PATH)
    return pipe

pipeline = load_ml_pipeline()
simulator = WhatIfInterventionSimulator(pipeline)

# -----------------------------------------------------------------------------
# SIDEBAR CONTROLS
# -----------------------------------------------------------------------------
st.sidebar.title("🧬 CogniTwin Controls")
st.sidebar.markdown("**Happiest Health CRP Challenge 2026**")

# Mandatory regulatory disclaimer
st.sidebar.markdown("""
<div class="disclaimer-banner">
    ⚠️ <strong>Screening Aid Prototype:</strong> Predictions derived from synthetic cohorts.
    Not clinically validated. Not for clinical diagnosis.
</div>
""", unsafe_allow_html=True)

patients = get_all_patients()
patient_options = {
    f"{p['patient_id']} — {p['demo_persona']} (Age {p['age']})": p['patient_id']
    for p in patients
}

# Persona quick selection
st.sidebar.subheader("Select Patient Cohort")
selected_label = st.sidebar.selectbox("Choose Patient Record", list(patient_options.keys()), index=0)
selected_pid = patient_options[selected_label]

ehr = get_patient_ehr(selected_pid)
wearables = get_patient_wearables(selected_pid)
history_states = get_patient_state_history(selected_pid)

if not wearables or not history_states:
    st.error(f"Incomplete data for patient {selected_pid}.")
    st.stop()

# Replay Timeline Slider
max_day = len(history_states)
st.sidebar.markdown("---")
st.sidebar.subheader("⏱️ Timeline Scrubber / Replay")
selected_day = st.sidebar.slider(
    "Inspect Digital Twin at Day:",
    min_value=1,
    max_value=max_day,
    value=max_day,
    help="Select any day to inspect exactly what the digital twin knew at that timepoint."
)

# Streaming simulation button
st.sidebar.markdown("---")
st.sidebar.subheader("📡 Streaming Ingestion Demo")
if st.sidebar.button("⚡ Ingest Next Day (Simulate Streaming)", use_container_width=True):
    next_day_num = max_day + 1
    last_obs = wearables[-1]
    persona_str = ehr.get("demo_persona", "")

    if "Progressive" in persona_str:
        next_hrv = max(18.0, last_obs["mean_hrv_ms"] - 3.5)
        next_rhr = min(102.0, last_obs["resting_heart_rate_bpm"] + 1.5)
        next_sleep = max(4.0, last_obs["sleep_duration_hours"] - 0.3)
        next_deep = max(0.4, last_obs["deep_sleep_hours"] - 0.1)
        next_steps = max(1500, last_obs["steps"] - 450)
        next_act = max(15, last_obs["activity_minutes"] - 5)
        quality = 0.94
    elif "Noisy" in persona_str:
        next_hrv = last_obs["mean_hrv_ms"] + float(np.random.normal(0, 3))
        next_rhr = last_obs["resting_heart_rate_bpm"] + float(np.random.normal(0, 2))
        next_sleep = 4.0
        next_deep = 0.7
        next_steps = 2100
        next_act = 20
        quality = 0.42
    else:
        next_hrv = round(last_obs["mean_hrv_ms"] + float(np.random.normal(0, 1.5)), 1)
        next_rhr = round(last_obs["resting_heart_rate_bpm"] + float(np.random.normal(0, 1.0)), 1)
        next_sleep = round(last_obs["sleep_duration_hours"] + float(np.random.normal(0, 0.2)), 2)
        next_deep = round(last_obs["deep_sleep_hours"] + float(np.random.normal(0, 0.05)), 2)
        next_steps = int(last_obs["steps"] + np.random.normal(0, 200))
        next_act = int(last_obs["activity_minutes"] + np.random.normal(0, 4))
        quality = 0.98

    new_reading = {
        "day": next_day_num,
        "date": f"2026-10-{next_day_num:02d}",
        "mean_hrv_ms": round(float(np.clip(next_hrv, 15.0, 120.0)), 1),
        "resting_heart_rate_bpm": round(float(np.clip(next_rhr, 45.0, 115.0)), 1),
        "sleep_duration_hours": round(float(np.clip(next_sleep, 3.0, 11.0)), 2),
        "deep_sleep_hours": round(float(np.clip(next_deep, 0.2, 3.0)), 2),
        "rem_sleep_hours": 1.4,
        "steps": int(np.clip(next_steps, 500, 25000)),
        "activity_minutes": int(np.clip(next_act, 10, 200)),
        "data_quality_score": round(float(quality), 2),
    }
    ingest_wearable_observation(selected_pid, new_reading)
    st.sidebar.success(f"Ingested Day {next_day_num} reading successfully!")
    st.rerun()

if st.sidebar.button("🔄 Reset Demo to Day 7 Baseline", use_container_width=True):
    init_db(force_reload=True)
    st.sidebar.info("Database reset to pristine 7-day state.")
    st.rerun()

# -----------------------------------------------------------------------------
# MAIN DASHBOARD INTERFACE
# -----------------------------------------------------------------------------
st.title("Patient Digital Twin — Longitudinal Clinical Dashboard")
st.caption(f"Patient ID: **{selected_pid}** | Demographic Profile: **{ehr['sex']}, {ehr['age']} y/o** | Education: **{ehr['education_years']} years**")

# Active state at scrubbed day
current_state = history_states[selected_day - 1]
previous_state = history_states[selected_day - 2] if selected_day > 1 else current_state

# Build feature dictionary up to selected day for future-event prediction
df_w_sub = pd.DataFrame(wearables[:selected_day]).sort_values("day")
n_sub = len(df_w_sub)
mean_hrv_sub = float(df_w_sub["mean_hrv_ms"].mean())
hrv_slope_sub = float((df_w_sub["mean_hrv_ms"].iloc[-1] - df_w_sub["mean_hrv_ms"].iloc[0]) / max(1, n_sub - 1))
mean_rhr_sub = float(df_w_sub["resting_heart_rate_bpm"].mean())
rhr_slope_sub = float((df_w_sub["resting_heart_rate_bpm"].iloc[-1] - df_w_sub["resting_heart_rate_bpm"].iloc[0]) / max(1, n_sub - 1))
mean_sleep_sub = float(df_w_sub["sleep_duration_hours"].mean())
sleep_std_sub = float(df_w_sub["sleep_duration_hours"].std()) if n_sub > 1 else 0.0
mean_deep_sub = float(df_w_sub["deep_sleep_hours"].mean())
deep_ratio_sub = float(mean_deep_sub / max(0.1, mean_sleep_sub))
mean_steps_sub = float(df_w_sub["steps"].mean())
steps_slope_sub = float((df_w_sub["steps"].iloc[-1] - df_w_sub["steps"].iloc[0]) / max(1, n_sub - 1))
mean_act_sub = float(df_w_sub["activity_minutes"].mean())
avg_qual_sub = float(df_w_sub["data_quality_score"].mean())

patient_features = {
    "patient_id": selected_pid,
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
    "mean_hrv_ms": round(mean_hrv_sub, 2),
    "hrv_trend_slope": round(hrv_slope_sub, 2),
    "mean_resting_hr_bpm": round(mean_rhr_sub, 2),
    "resting_hr_trend_slope": round(rhr_slope_sub, 2),
    "mean_sleep_hours": round(mean_sleep_sub, 2),
    "sleep_variability_std": round(sleep_std_sub if not np.isnan(sleep_std_sub) else 0.0, 2),
    "mean_deep_sleep_hours": round(mean_deep_sub, 2),
    "deep_sleep_ratio": round(deep_ratio_sub, 2),
    "mean_daily_steps": round(mean_steps_sub, 1),
    "steps_trend_slope": round(steps_slope_sub, 1),
    "mean_activity_minutes": round(mean_act_sub, 1),
    "wearable_data_quality_score": round(avg_qual_sub, 2),
}

# Run fitted model prediction
prediction = pipeline.predict_patient(patient_features)

# =============================================================================
# SECTION A: PATIENT OVERVIEW CARDS
# =============================================================================
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("#### Digital Twin State")
    t_state = current_state["twin_state"]
    if t_state == STATE_STABLE:
        badge_html = f'<span class="badge-stable">🟢 {t_state}</span>'
    elif t_state == STATE_PHYSIOLOGICAL_DECLINE:
        badge_html = f'<span class="badge-decline">🟠 {t_state}</span>'
    elif t_state == STATE_COGNITIVE_RISK_ELEVATED:
        badge_html = f'<span class="badge-elevated">🔴 {t_state}</span>'
    else:
        badge_html = f'<span class="badge-quality">⚪ {t_state}</span>'
    st.markdown(badge_html, unsafe_allow_html=True)
    st.caption(f"Inspection Point: **Day {selected_day}**")

with col2:
    st.markdown("#### 30-Day Deterioration Risk")
    risk_pct = prediction["risk_probability"] * 100
    tier = prediction["risk_tier"]
    if tier == "HIGH":
        st.markdown(f"<h3 style='color:#C5221F; margin:0;'>{risk_pct:.1f}% ({tier})</h3>", unsafe_allow_html=True)
    elif tier == "ELEVATED":
        st.markdown(f"<h3 style='color:#B06000; margin:0;'>{risk_pct:.1f}% ({tier})</h3>", unsafe_allow_html=True)
    else:
        st.markdown(f"<h3 style='color:#137333; margin:0;'>{risk_pct:.1f}% ({tier})</h3>", unsafe_allow_html=True)
    st.caption(f"95% CI: [{prediction['confidence_interval_low']*100:.1f}%, {prediction['confidence_interval_high']*100:.1f}%]")

with col3:
    st.markdown("#### Signal Completeness")
    q_score = current_state["data_quality_score"] * 100
    st.markdown(f"<h3 style='margin:0;'>{q_score:.0f}%</h3>", unsafe_allow_html=True)
    st.caption("Active sensor coverage score")

with col4:
    st.markdown("#### Clinical Baseline")
    moca = ehr["baseline_cognitive_score"]
    mci_status = "Prior MCI: Yes" if ehr["previous_mci"] else "Prior MCI: No"
    st.markdown(f"<h3 style='margin:0;'>MoCA {moca:.1f}</h3>", unsafe_allow_html=True)
    st.caption(f"{mci_status} | Adherence: {int(ehr['medication_adherence']*100)}%")

st.markdown("---")

# =============================================================================
# TABS: LONGITUDINAL TRENDS | TWIN STATE | PREDICTION | WHAT-IF SIMULATOR
# =============================================================================
tab_trends, tab_twin, tab_pred, tab_whatif, tab_ingest = st.tabs([
    "📈 Longitudinal Trends",
    "🧬 Digital Twin State & Diff",
    "🎯 30-Day Prediction & SHAP",
    "🔮 What-If Simulator",
    "📥 Ingest Observations",
])

# -----------------------------------------------------------------------------
# TAB 1: LONGITUDINAL TRENDS
# -----------------------------------------------------------------------------
with tab_trends:
    st.subheader("Physiological Telemetry & Risk Trajectory Over Time")
    df_chart = pd.DataFrame(wearables[:selected_day])

    c_chart1, c_chart2 = st.columns(2)

    with c_chart1:
        # HRV & Resting HR
        fig1 = go.Figure()
        fig1.add_trace(go.Scatter(x=df_chart["day"], y=df_chart["mean_hrv_ms"], mode="lines+markers", name="HRV (ms)", line=dict(color="#0D9488", width=3)))
        fig1.add_trace(go.Scatter(x=df_chart["day"], y=df_chart["resting_heart_rate_bpm"], mode="lines+markers", name="Resting HR (bpm)", line=dict(color="#E11D48", width=2, dash="dash")))
        fig1.update_layout(title="Autonomic Tone: HRV & Resting Heart Rate", xaxis_title="Observation Day", yaxis_title="Units", hovermode="x unified", height=320)
        st.plotly_chart(fig1, use_container_width=True)

    with c_chart2:
        # Sleep & Deep Sleep
        fig2 = go.Figure()
        fig2.add_bar(x=df_chart["day"], y=df_chart["sleep_duration_hours"], name="Total Sleep (hrs)", marker_color="#6366F1")
        fig2.add_bar(x=df_chart["day"], y=df_chart["deep_sleep_hours"], name="Deep Sleep (hrs)", marker_color="#4338CA")
        fig2.update_layout(barmode="overlay", title="Sleep Architecture & Deep Sleep Continuity", xaxis_title="Observation Day", yaxis_title="Hours", hovermode="x unified", height=320)
        st.plotly_chart(fig2, use_container_width=True)

    c_chart3, c_chart4 = st.columns(2)

    with c_chart3:
        # Daily Steps & Activity Minutes
        fig3 = go.Figure()
        fig3.add_trace(go.Scatter(x=df_chart["day"], y=df_chart["steps"], mode="lines+markers", name="Daily Steps", line=dict(color="#2563EB", width=3)))
        fig3.update_layout(title="Physical Activity: Step Count Trajectory", xaxis_title="Observation Day", yaxis_title="Steps", hovermode="x unified", height=300)
        st.plotly_chart(fig3, use_container_width=True)

    with c_chart4:
        # Longitudinal Risk Estimates across all days up to selected day
        risk_progression = []
        for d in range(1, selected_day + 1):
            sub = df_chart[df_chart["day"] <= d]
            feat_d = dict(patient_features)
            feat_d["mean_hrv_ms"] = float(sub["mean_hrv_ms"].mean())
            feat_d["mean_sleep_hours"] = float(sub["sleep_duration_hours"].mean())
            feat_d["mean_daily_steps"] = float(sub["steps"].mean())
            p_res = pipeline.predict_patient(feat_d)
            risk_progression.append({"day": d, "risk": p_res["risk_probability"] * 100})

        df_risk_prog = pd.DataFrame(risk_progression)
        fig4 = px.line(df_risk_prog, x="day", y="risk", markers=True, title="Model 30-Day Deterioration Risk Evolution Over Time", line_shape="spline")
        fig4.update_traces(line_color="#DC2626", line_width=3)
        fig4.update_layout(xaxis_title="Observation Day", yaxis_title="Calibrated Risk Probability (%)", yaxis_range=[0, 100], height=300)
        st.plotly_chart(fig4, use_container_width=True)

# -----------------------------------------------------------------------------
# TAB 2: DIGITAL TWIN STATE & TIME DIFFERENCE
# -----------------------------------------------------------------------------
with tab_twin:
    st.subheader(f"Digital Twin Computational State at Day {selected_day}")
    st.info(f"**State Rationale:** {current_state['state_reason']}")

    diff_col1, diff_col2 = st.columns(2)

    with diff_col1:
        st.markdown("#### Deviations from Personal Baseline")
        p_base = current_state.get("change_from_personal_baseline", {})
        if p_base.get("has_established_baseline", False):
            col_b1, col_b2, col_b3 = st.columns(3)
            col_b1.metric("HRV Shift", f"{p_base.get('hrv_pct_change', 0):+.1f}%")
            col_b2.metric("Deep Sleep Shift", f"{p_base.get('deep_sleep_pct_change', 0):+.1f}%")
            col_b3.metric("Step Count Shift", f"{p_base.get('steps_pct_change', 0):+.1f}%")
            st.metric("Resting Heart Rate Delta", f"{p_base.get('rhr_bpm_diff', 0):+.1f} bpm")
        else:
            st.write("Establishing personal baseline (requires minimum 3 observation days).")

    with diff_col2:
        st.markdown(f"#### State Transition: Day {previous_state['day']} → Day {current_state['day']}")
        diff = DailyPatientStateEngine.compare_states(previous_state, current_state)
        st.markdown(f"**Status Shift:** `{diff['state_transition']}`")

        diff_data = []
        for feat_name, d_val in diff["changed_features"].items():
            diff_data.append({
                "Biomarker": feat_name.replace("_", " ").title(),
                f"Day {diff['from_day']}": d_val["from"],
                f"Day {diff['to_day']}": d_val["to"],
                "Delta": d_val["delta"],
            })
        st.dataframe(pd.DataFrame(diff_data), use_container_width=True)

# -----------------------------------------------------------------------------
# TAB 3: 30-DAY PREDICTION & SHAP EXPLAINABILITY
# -----------------------------------------------------------------------------
with tab_pred:
    st.subheader("Calibrated Future-Event Risk Estimation (30-Day Horizon)")

    p_col1, p_col2 = st.columns([1, 2])

    with p_col1:
        st.markdown("### Risk Assessment")
        tier_str = prediction["risk_tier"]
        prob_val = prediction["risk_probability"] * 100
        ci_l = prediction["confidence_interval_low"] * 100
        ci_h = prediction["confidence_interval_high"] * 100

        if tier_str == "HIGH":
            st.error(f"## {tier_str} RISK\n**Calibrated Probability:** {prob_val:.1f}%\n\n**95% CI:** [{ci_l:.1f}%, {ci_h:.1f}%]")
            rec_action = "Prioritize comprehensive neuropsychological battery and specialist neurology consultation."
        elif tier_str == "ELEVATED":
            st.warning(f"## {tier_str} RISK\n**Calibrated Probability:** {prob_val:.1f}%\n\n**95% CI:** [{ci_l:.1f}%, {ci_h:.1f}%]")
            rec_action = "Schedule follow-up digital screening in 30 days; evaluate sleep hygiene and lifestyle support."
        else:
            st.success(f"## {tier_str} RISK\n**Calibrated Probability:** {prob_val:.1f}%\n\n**95% CI:** [{ci_l:.1f}%, {ci_h:.1f}%]")
            rec_action = "Continue regular longitudinal wearable monitoring and standard annual wellness review."

        st.markdown(f"**Recommended Clinical Pathway:**\n{rec_action}")
        st.caption(f"Model: `{prediction['model_version']}` | Horizon: **30 Days**")

    with p_col2:
        st.markdown("### Principal Contributing Biomarkers (SHAP / Attribution)")
        feats = prediction["top_features"]
        df_feat = pd.DataFrame(feats)

        if not df_feat.empty:
            df_feat["Direction"] = df_feat["direction"].map({"up": "Increases Risk", "down": "Protective / Lowers Risk"})
            fig_shap = px.bar(
                df_feat,
                x="impact",
                y="name",
                orientation="h",
                color="Direction",
                color_discrete_map={"Increases Risk": "#EF4444", "Protective / Lowers Risk": "#10B981"},
                title="Top Features Driving 30-Day Cognitive Deterioration Score",
                labels={"impact": "Relative Attribution Impact", "name": "Biomarker"},
            )
            fig_shap.update_layout(yaxis=dict(autorange="reversed"), height=320)
            st.plotly_chart(fig_shap, use_container_width=True)

            st.dataframe(
                df_feat[["name", "value", "reference", "direction"]].rename(columns={
                    "name": "Biomarker", "value": "Patient Value", "reference": "Cohort Reference", "direction": "Risk Shift"
                }),
                use_container_width=True
            )

# -----------------------------------------------------------------------------
# TAB 4: WHAT-IF INTERVENTION SIMULATOR
# -----------------------------------------------------------------------------
with tab_whatif:
    st.subheader("What-If Counterfactual Intervention Simulator")
    st.markdown("""
    Explore how hypothetical modifications to wearable or lifestyle factors would impact the
    Digital Twin's model prediction. *Evaluates model sensitivity; not a causal efficacy proof.*
    """)

    sim_col1, sim_col2 = st.columns([1, 1])

    with sim_col1:
        st.markdown("#### Hypothetical Intervention Adjustments")
        s_sleep = st.slider("Adjust Nightly Sleep Duration (hours):", min_value=-3.0, max_value=3.0, value=0.0, step=0.5)
        s_steps = st.slider("Adjust Daily Steps:", min_value=-5000, max_value=5000, value=0, step=500)
        s_hrv = st.slider("Adjust Autonomic HRV (ms):", min_value=-20.0, max_value=20.0, value=0.0, step=2.0)
        s_adh = st.slider("Target Medication Adherence (%):", min_value=30, max_value=100, value=int(ehr["medication_adherence"]*100), step=5)

        hypo_dict = {}
        if s_sleep != 0.0:
            hypo_dict["sleep_duration_delta"] = s_sleep
        if s_steps != 0:
            hypo_dict["daily_steps_delta"] = s_steps
        if s_hrv != 0.0:
            hypo_dict["hrv_ms_delta"] = s_hrv
        if s_adh != int(ehr["medication_adherence"]*100):
            hypo_dict["medication_adherence"] = s_adh / 100.0

    with sim_col2:
        st.markdown("#### Baseline vs Scenario Comparison")
        sim_res = simulator.simulate_scenario(patient_features, hypo_dict)

        b_prob = sim_res["baseline"]["risk_probability"] * 100
        s_prob = sim_res["scenario"]["risk_probability"] * 100
        p_delta = sim_res["probability_delta"] * 100

        c_m1, c_m2, c_m3 = st.columns(3)
        c_m1.metric("Baseline Risk", f"{b_prob:.1f}%")
        c_m2.metric("Scenario Risk", f"{s_prob:.1f}%", delta=f"{p_delta:+.1f}%", delta_color="inverse")
        c_m3.metric("Risk Tier Transition", sim_res["tier_transition"])

        st.markdown("##### Modifications Applied:")
        if sim_res["adjustments_applied"]:
            for k_mod, v_mod in sim_res["adjustments_applied"].items():
                st.write(f"- **{k_mod}:** {v_mod}")
        else:
            st.caption("No adjustments selected. Modify sliders on the left.")

        st.caption(f"ℹ️ {sim_res['disclaimer']}")

# -----------------------------------------------------------------------------
# TAB 5: INGEST OBSERVATIONS
# -----------------------------------------------------------------------------
with tab_ingest:
    st.subheader(f"Ingest New Daily Observation for {selected_pid}")

    with st.form("manual_ingest_form"):
        f_col1, f_col2 = st.columns(2)
        with f_col1:
            in_day = st.number_input("Observation Day Index", min_value=max_day + 1, value=max_day + 1)
            in_hrv = st.number_input("Mean HRV (ms)", min_value=10.0, max_value=200.0, value=float(current_state["mean_hrv_ms"]))
            in_rhr = st.number_input("Resting Heart Rate (bpm)", min_value=40.0, max_value=180.0, value=float(current_state["resting_heart_rate_bpm"]))
            in_steps = st.number_input("Daily Steps", min_value=0, max_value=50000, value=int(current_state["steps"]))

        with f_col2:
            in_sleep = st.number_input("Total Sleep (hours)", min_value=0.0, max_value=24.0, value=float(current_state["sleep_duration_hours"]))
            in_deep = st.number_input("Deep Sleep (hours)", min_value=0.0, max_value=10.0, value=float(current_state["deep_sleep_hours"]))
            in_act = st.number_input("Activity Minutes", min_value=0, max_value=480, value=int(current_state["activity_minutes"]))
            in_quality = st.slider("Signal Quality Score", min_value=0.1, max_value=1.0, value=0.95)

        submit_ingest = st.form_submit_button("Submit & Update Digital Twin", use_container_width=True)

        if submit_ingest:
            if in_deep > in_sleep:
                st.error("Deep sleep cannot exceed total sleep duration.")
            else:
                new_rec = {
                    "day": int(in_day),
                    "date": f"2026-10-{int(in_day):02d}",
                    "mean_hrv_ms": round(float(in_hrv), 1),
                    "resting_heart_rate_bpm": round(float(in_rhr), 1),
                    "sleep_duration_hours": round(float(in_sleep), 2),
                    "deep_sleep_hours": round(float(in_deep), 2),
                    "rem_sleep_hours": 1.4,
                    "steps": int(in_steps),
                    "activity_minutes": int(in_act),
                    "data_quality_score": round(float(in_quality), 2),
                }
                ingest_wearable_observation(selected_pid, new_rec)
                st.success(f"Day {in_day} ingested! Digital Twin state updated.")
                st.rerun()

# -----------------------------------------------------------------------------
# EXPORT CONTROLS
# -----------------------------------------------------------------------------
st.markdown("---")
exp_col1, exp_col2, exp_col3 = st.columns([1, 1, 2])

with exp_col1:
    summary_report = {
        "patient_id": selected_pid,
        "demographics": {"age": ehr["age"], "sex": ehr["sex"], "education_years": ehr["education_years"]},
        "baseline_cognitive_score": ehr["baseline_cognitive_score"],
        "inspected_day": selected_day,
        "digital_twin_state": current_state["twin_state"],
        "calibrated_30d_risk": prediction["risk_probability"],
        "risk_tier": prediction["risk_tier"],
        "top_contributing_biomarkers": prediction["top_features"],
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "regulatory_notice": "Research prototype. Not clinically validated for diagnosis.",
    }
    st.download_button(
        "📄 Export Twin Clinical Summary (JSON)",
        json.dumps(summary_report, indent=2),
        file_name=f"cognitwin_summary_{selected_pid}_day{selected_day}.json",
        use_container_width=True
    )

with exp_col2:
    fhir_bundle = {
        "resourceType": "Bundle",
        "type": "collection",
        "entry": [
            {
                "resource": {
                    "resourceType": "Patient",
                    "id": selected_pid,
                    "gender": ehr["sex"].lower(),
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "status": "final",
                    "code": {"coding": [{"system": "http://loinc.org", "code": "72106-8", "display": "MoCA Score"}]},
                    "valueQuantity": {"value": ehr["baseline_cognitive_score"], "unit": "points"}
                }
            },
            {
                "resource": {
                    "resourceType": "RiskAssessment",
                    "status": "preliminary",
                    "subject": {"reference": f"Patient/{selected_pid}"},
                    "prediction": [{
                        "outcome": {"text": "Cognitive Deterioration within 30 days"},
                        "probabilityDecimal": prediction["risk_probability"],
                        "qualitativeRisk": {"text": prediction["risk_tier"]}
                    }]
                }
            }
        ]
    }
    st.download_button(
        "🏥 Export FHIR Bundle (R4)",
        json.dumps(fhir_bundle, indent=2),
        file_name=f"fhir_bundle_{selected_pid}.json",
        use_container_width=True
    )
