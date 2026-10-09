import streamlit as st
import requests

st.set_page_config(page_title="Patient Assessment", page_icon="📝")

st.title("Patient Assessment")
st.markdown("**(8-Minute Protocol Simulation)**")

if "session_id" not in st.session_state:
    st.session_state["session_id"] = None
if "step" not in st.session_state:
    st.session_state["step"] = 0

persona = st.selectbox("Select Demo Persona", ["Low risk", "Elevated – memory", "High – speech+memory", "Indeterminate – poor audio"])

if st.button("Start Assessment"):
    # Create session via FastAPI
    resp = requests.post("http://localhost:8000/v1/sessions")
    if resp.status_code == 200:
        st.session_state["session_id"] = resp.json()["session_id"]
        st.session_state["persona"] = persona
        st.session_state["step"] = 1
        st.success("Session created. Proceeding to task...")
        st.rerun()
    else:
        st.error("Failed to connect to API. Is FastAPI running?")

if st.session_state["step"] == 1:
    st.subheader("Step 1: Picture Description")
    st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cookie_theft_picture.png/400px-Cookie_theft_picture.png", width=400)
    st.markdown("Please describe everything you see happening in this picture.")
    audio_val = st.audio_input("Record your answer")
    if audio_val:
        st.success("Audio captured!")
        if st.button("Submit Audio"):
            # Mock sending audio to backend
            files = {"file": ("audio.wav", audio_val.getvalue(), "audio/wav")}
            requests.post(f"http://localhost:8000/v1/sessions/{st.session_state['session_id']}/speech", files=files)
            st.session_state["step"] = 2
            st.rerun()

if st.session_state["step"] == 2:
    st.subheader("Step 2: Cognitive Tasks")
    st.markdown("Simulating digital neuropsych tasks (Word list, Animal fluency, Trail-making)...")
    if st.button("Complete Tasks"):
        payload = {"persona": st.session_state["persona"]}
        requests.post(f"http://localhost:8000/v1/sessions/{st.session_state['session_id']}/cognitive", json=payload)
        st.session_state["step"] = 3
        st.rerun()

if st.session_state["step"] == 3:
    st.subheader("Assessment Complete")
    st.markdown("Thank you. The clinician will review your results.")
    st.info(f"Session ID: {st.session_state['session_id']}")
    st.markdown("👉 **Go to Page 2 (Clinician Dashboard) to view the analysis.**")
    if st.button("Restart"):
        st.session_state["step"] = 0
        st.session_state["session_id"] = None
        st.rerun()
