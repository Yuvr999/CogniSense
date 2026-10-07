import streamlit as st
import requests
import json
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Clinician Dashboard", page_icon="🩺", layout="wide")

st.title("Clinician Dashboard")

# Option to fetch by session ID or use demo mode directly
mode = st.radio("Mode", ["Fetch Session", "Demo Personas (No Session required)"])

risk_result = None

if mode == "Fetch Session":
    session_id = st.text_input("Enter Session ID")
    if st.button("Load Results"):
        try:
            resp = requests.get(f"http://localhost:8000/v1/sessions/{session_id}/result")
            if resp.status_code == 200:
                risk_result = resp.json()
            else:
                st.error("Result not found or session not complete.")
        except:
            st.error("Failed to connect to API.")
else:
    demo_persona = st.selectbox("Select Persona", ["Low risk", "Elevated – memory", "High – speech+memory", "Indeterminate – poor audio"])
    if st.button("Load Demo"):
        # We can simulate calling the API by creating a session, putting cognitive data, then fetching
        try:
            resp1 = requests.post("http://localhost:8000/v1/sessions")
            s_id = resp1.json()["session_id"]
            requests.post(f"http://localhost:8000/v1/sessions/{s_id}/speech", files={"file": ("d.wav", b"123", "audio/wav")})
            requests.post(f"http://localhost:8000/v1/sessions/{s_id}/cognitive", json={"persona": demo_persona})
            resp3 = requests.get(f"http://localhost:8000/v1/sessions/{s_id}/result")
            risk_result = resp3.json()
        except Exception as e:
            st.error(f"Failed to load demo: {e}")

if risk_result:
    st.markdown("---")
    
    col1, col2, col3 = st.columns([1,2,1])
    
    with col1:
        st.subheader("Risk Tier")
        tier = risk_result["tier"].upper()
        if tier == "LOW":
            st.success(f"## {tier}\nCalibrated Probability: {risk_result['fused_probability']:.2f}\nCI: {risk_result['ci_low']:.2f} - {risk_result['ci_high']:.2f}")
        elif tier == "ELEVATED":
            st.warning(f"## {tier}\nCalibrated Probability: {risk_result['fused_probability']:.2f}\nCI: {risk_result['ci_low']:.2f} - {risk_result['ci_high']:.2f}")
        elif tier == "HIGH":
            st.error(f"## {tier}\nCalibrated Probability: {risk_result['fused_probability']:.2f}\nCI: {risk_result['ci_low']:.2f} - {risk_result['ci_high']:.2f}")
        else:
            st.info(f"## {tier}\nCalibrated Probability: {risk_result['fused_probability']:.2f}\nCI: {risk_result['ci_low']:.2f} - {risk_result['ci_high']:.2f}")
        
        st.markdown(f"**Recommended Action:** {risk_result['recommended_action']}")
        st.caption(risk_result["disclaimer"])

    with col2:
        st.subheader("Explanation")
        st.write(risk_result["narrative"])
        
        st.markdown("#### Top Contributions")
        data = []
        for mod in risk_result["modalities"]:
            for feat in mod["top_contributions"]:
                data.append({
                    "Modality": mod["name"],
                    "Feature": feat["name"],
                    "Value": feat["value"],
                    "Reference": feat["reference"],
                    "SHAP": feat["shap"]
                })
        if data:
            df = pd.DataFrame(data)
            fig = px.bar(df, x="SHAP", y="Feature", orientation='h', color="Modality", title="SHAP Feature Contributions")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.write("No feature contributions available (e.g., poor data quality).")

    with col3:
        st.subheader("Modalities")
        for mod in risk_result["modalities"]:
            status = "✅ Available" if mod["available"] else "❌ Unavailable"
            st.markdown(f"**{mod['name'].capitalize()}**: {status}")
            if mod["qc_flags"]:
                st.markdown(f"⚠️ Flags: {', '.join(mod['qc_flags'])}")
            
        st.markdown("---")
        st.download_button("Download PDF Report", "Mock PDF Report Content", "report.pdf")
        
        fhir_str = json.dumps({"resourceType": "Bundle", "type": "collection", "entry": []}, indent=2)
        st.download_button("Export FHIR Bundle", fhir_str, "fhir_bundle.json")
