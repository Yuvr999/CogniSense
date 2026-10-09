import streamlit as st

st.set_page_config(
    page_title="CogniSense / CogniTwin",
    page_icon="🧬",
    layout="wide"
)

st.title("CogniSense / CogniTwin — Multimodal Patient Digital Twin")
st.caption("Happiest Health CRP Digital Twin Challenge 2026 | Research Prototype")

st.markdown("""
<div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
    <strong>Regulatory Disclaimer:</strong> Research prototype using synthetic data.
    Predictions are not clinically validated and must not be used for diagnosis or treatment.
    This system serves strictly as a clinical decision support screening aid.
</div>
""", unsafe_allow_html=True)

st.markdown("""
### Transforming Cognitive Screening into a Continuous Patient Digital Twin

**CogniTwin** elevates single-timepoint screening into an active, longitudinal computational replica of a patient's cognitive and physiological trajectory:

```
Historical EHR + Daily Wearable Telemetry + Cognitive Assessments
                      │
                      ▼
         Data Validation & Normalization
                      │
                      ▼
          Temporal Feature Engineering
          (3-day / 7-day trends, personal baseline deviations)
                      │
                      ▼
          Daily Patient State Engine
          (Time-indexed state classification & transition tracking)
                      │
                      ▼
            Persistent Digital Twin
            (SQLite audit log, state replay, signal quality)
                      │
                      ▼
       Calibrated Future-Event Prediction (30-day horizon)
                      │
                      ▼
          Explainability & Attribution (SHAP)
                      │
                      ▼
        What-If Counterfactual Intervention Simulator
                      │
                      ▼
         Clinician Decision Support Dashboard
```

---

### What to Explore in this Prototype:

1. **🩺 Clinician Digital Twin Dashboard (`Page 2`):**
   - **Longitudinal Telemetry:** Interactive time series of HRV, Resting HR, Sleep architecture, and Daily Steps.
   - **Timeline Scrubber / Replay:** Inspect what the Digital Twin knew at Day 1 through Day 7 (or beyond).
   - **State Transition Engine:** Automatic detection of *Stable*, *Physiological Decline*, *Data Quality Alert*, and *Elevated Cognitive Risk*.
   - **30-Day Prediction & SHAP:** Calibrated probability, 95% confidence intervals, and normative baseline feature contributions.
   - **What-If Intervention Simulator:** Interactively test how changes to sleep, steps, HRV, or medication adherence alter predicted risk.
   - **Streaming Ingestion Demo:** Advance to Day 8+ with 1-click synthetic streaming ingestion.
   - **FHIR & JSON Exports:** Clinical summaries and FHIR R4 bundles ready for interoperability.

2. **🧠 Patient Assessment (`Page 1`):** Patient-facing digital biomarker test suite.
3. **📊 Model Performance (`Page 3`):** Cross-validation metrics, ROC-AUC, Brier score calibration, and subgroup performance.
4. **⚖️ Fairness Audit (`Page 4`):** Demographic parity, equalized odds, and education-adjusted evaluations.
5. **🔒 Privacy & Compliance (`Page 5`):** Privacy-by-design, local-only processing, retention limits, and pseudonymization audit log.

👈 **Select *2 Clinician Dashboard* from the sidebar to inspect the Digital Twin.**
""")
