import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(page_title="Model Performance", page_icon="📊", layout="wide")

st.title("Model Performance & Validation")

st.markdown("""
*(Metrics shown are mock data representing the validation strategy defined in IMPLEMENTATION_PLAN.md)*
""")

col1, col2 = st.columns(2)

with col1:
    st.subheader("Global Metrics (Cross-Validation)")
    metrics = {
        "Modality": ["Speech (ADReSS)", "Cognitive (ADNI/TADPOLE)", "Fusion (Demo Synthetic)"],
        "AUROC": ["0.86 ± 0.04", "0.82 ± 0.03", "0.91 ± 0.03"],
        "Sensitivity @ 90% Specificity": ["0.74", "0.68", "0.85"],
        "Brier Score": ["0.15", "0.18", "0.10"]
    }
    st.table(pd.DataFrame(metrics))
    
    st.markdown("### Ablation Study")
    ablation = {
        "Configuration": ["Speech: Acoustic Only", "Speech: Linguistic Only", "Speech: Combined", "Fusion"],
        "AUROC": ["0.78", "0.81", "0.86", "0.91"]
    }
    st.table(pd.DataFrame(ablation))

with col2:
    st.subheader("Mock ROC Curves")
    # Generate mock ROC curve data
    fpr = np.linspace(0, 1, 100)
    tpr_speech = fpr**(1/3)
    tpr_cog = fpr**(1/2.5)
    tpr_fusion = fpr**(1/5)
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=fpr, y=tpr_speech, name="Speech", mode="lines"))
    fig.add_trace(go.Scatter(x=fpr, y=tpr_cog, name="Cognitive", mode="lines"))
    fig.add_trace(go.Scatter(x=fpr, y=tpr_fusion, name="Fusion", mode="lines", line=dict(dash='dash', width=3)))
    fig.add_trace(go.Scatter(x=[0,1], y=[0,1], name="Random", mode="lines", line=dict(dash='dot', color='gray')))
    
    fig.update_layout(xaxis_title="False Positive Rate", yaxis_title="True Positive Rate", title="Receiver Operating Characteristic")
    st.plotly_chart(fig, use_container_width=True)

st.subheader("Calibration (Reliability Diagram)")
st.markdown("Both speech and cognitive models are independently calibrated using nested CV (Platt/sigmoid).")
# Mock reliability diagram
prob_pred = np.linspace(0.1, 0.9, 9)
prob_true_speech = prob_pred + np.random.normal(0, 0.05, 9)
prob_true_fusion = prob_pred + np.random.normal(0, 0.02, 9)

fig_calib = go.Figure()
fig_calib.add_trace(go.Scatter(x=prob_pred, y=prob_true_speech, name="Speech", mode="lines+markers"))
fig_calib.add_trace(go.Scatter(x=prob_pred, y=prob_true_fusion, name="Fusion", mode="lines+markers"))
fig_calib.add_trace(go.Scatter(x=[0,1], y=[0,1], name="Perfectly Calibrated", mode="lines", line=dict(dash='dot', color='gray')))
fig_calib.update_layout(xaxis_title="Mean Predicted Probability", yaxis_title="Fraction of Positives")
st.plotly_chart(fig_calib, use_container_width=True)
