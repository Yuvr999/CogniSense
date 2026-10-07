import streamlit as st

st.set_page_config(
    page_title="CogniSense",
    page_icon="🧠",
    layout="wide"
)

st.title("CogniSense: Multimodal Digital Biomarker Screening")

st.markdown("""
### Welcome to CogniSense
A sub-10-minute, explainable, fairness-audited cognitive screening pipeline that fuses **speech (acoustic + linguistic)** with **gamified digital neuropsychology**, outputs a **calibrated risk tier with uncertainty**, and plugs into primary-care workflows via **FHIR**.

This prototype app includes:
* **Patient Assessment (Page 1):** The patient-facing 8-minute protocol simulation.
* **Clinician Dashboard (Page 2):** The provider view showing the risk tier, calibrated probability, explanation, and next steps.
* **Model Performance (Page 3):** Evaluation metrics, ROC, and calibration plots.
* **Fairness Audit (Page 4):** Subgroup fairness metrics and equalized odds gaps.
* **Privacy & Compliance (Page 5):** Data flow, GDPR/HIPAA compliance tracking, and audit logging.

👈 **Select a page from the sidebar to begin.**
""")
