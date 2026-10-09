import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Fairness Audit", page_icon="⚖️", layout="wide")

st.title("Fairness & Bias Audit")
st.markdown("**(Mock Dashboard for Demo)**")

st.markdown("""
We evaluate fairness across subgroups to ensure equitable performance. Key mitigations include:
1. **Education-adjusted normative scoring** for cognitive tasks.
2. Removal/regularization of demographic proxies.
""")

st.subheader("Subgroup Metrics (Equalized Odds)")
data = {
    "Subgroup": ["Age < 65", "Age 65-74", "Age >= 75", "Sex: M", "Sex: F", "Edu: <= 12y", "Edu: > 12y"],
    "AUROC": [0.89, 0.90, 0.87, 0.88, 0.89, 0.86, 0.90],
    "FPR Gap": ["+0.02", "baseline", "-0.01", "baseline", "+0.01", "+0.04", "baseline"],
    "TPR Gap": ["-0.01", "baseline", "-0.03", "baseline", "+0.02", "-0.05", "baseline"],
    "Indeterminate Rate": ["5%", "6%", "8%", "6%", "6%", "9%", "5%"]
}
df = pd.DataFrame(data)
st.dataframe(df, use_container_width=True)

st.subheader("Proxy Audit")
st.markdown("Can model features predict protected attributes? (Lower AUROC is better)")
proxy_data = {
    "Target Attribute": ["Age", "Sex", "Education Level"],
    "Probe AUROC (Before Mitigation)": [0.78, 0.82, 0.75],
    "Probe AUROC (After Mitigation)": [0.55, 0.58, 0.52]
}
st.table(pd.DataFrame(proxy_data))

st.info("Limitations: Public speech benchmarks are small and demographically narrow. Prospective multi-site validation is required before clinical use.")
