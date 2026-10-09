import streamlit as st
import datetime

st.set_page_config(page_title="Privacy & Compliance", page_icon="🔒", layout="wide")

st.title("Privacy & Compliance")

st.markdown("""
**Principles:** Data minimization, local processing, purpose limitation, privacy by design.
""")

col1, col2 = st.columns(2)

with col1:
    st.subheader("Data Flow & Retention")
    st.markdown("""
    * **Audio:** Processed in-memory, deleted immediately after feature extraction.
    * **Transcripts:** Scrubbed via Presidio, then discarded.
    * **Features:** Persisted in encrypted store (AES-256-GCM).
    * **Third-Party APIs:** None. All ASR/NLP runs locally.
    """)
    
    st.subheader("Simulated Audit Log")
    log_data = [
        {"Timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"), "Event": "Session Created", "User/Role": "Patient"},
        {"Timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=14)).strftime("%Y-%m-%d %H:%M:%S"), "Event": "Audio Processed & DELETED", "User/Role": "System"},
        {"Timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S"), "Event": "Risk Assessment Generated", "User/Role": "System"},
        {"Timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M:%S"), "Event": "Report Accessed", "User/Role": "Clinician_Dr_Smith"}
    ]
    st.table(log_data)

with col2:
    st.subheader("Compliance Matrix")
    st.markdown("""
    | Control | Status |
    |---------|--------|
    | HIPAA Safeguards | Designed for compliance |
    | GDPR Right to Erasure | Implemented (see API `DELETE /v1/sessions/{id}`) |
    | Consent Capture | Implemented |
    | De-identification | Presidio integration active |
    """)

    st.subheader("Data Subject Rights")
    sess_del = st.text_input("Enter Session ID to Erase Data")
    if st.button("Delete My Data"):
        st.success(f"Request sent to DELETE /v1/sessions/{sess_del}. (Simulated success)")

st.caption("Disclaimer: This is a research prototype. It is not currently HIPAA/GDPR certified.")
