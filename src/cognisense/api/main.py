from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid

from src.cognisense.schemas import RiskResult, ModalityResult, FeatureContribution

app = FastAPI(title="CogniSense API", version="0.1.0")

# In-memory storage for demo purposes
sessions: Dict[str, Dict[str, Any]] = {}

class SessionCreateResponse(BaseModel):
    session_id: str

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.post("/v1/sessions", response_model=SessionCreateResponse)
def create_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"speech": False, "cognitive": False, "persona": "Low risk"}
    return {"session_id": session_id}

@app.post("/v1/sessions/{session_id}/speech")
async def process_speech(session_id: str, file: UploadFile = File(...)):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Mock processing
    sessions[session_id]["speech"] = True
    return {"status": "processed", "modality": "speech"}

@app.post("/v1/sessions/{session_id}/cognitive")
def process_cognitive(session_id: str, data: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Mock processing, can read persona from data if passed
    if "persona" in data:
        sessions[session_id]["persona"] = data["persona"]
    sessions[session_id]["cognitive"] = True
    return {"status": "processed", "modality": "cognitive"}

def _get_mock_result(session_id: str, persona: str) -> RiskResult:
    if persona == "Low risk":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.12,
            ci_low=0.05,
            ci_high=0.22,
            tier="low",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.15, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Pause time", value=22.0, reference=20.0, shap=0.01, direction="neutral")]
                ),
                ModalityResult(
                    name="cognitive", probability=0.10, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=8.0, reference=7.5, shap=-0.05, direction="down")]
                )
            ],
            narrative="No significant cognitive impairment detected based on speech and digital tasks. Performance is within age and education adjusted norms.",
            recommended_action="Reassure and rescreen in 12 months.",
            model_version="v0.1.0-demo"
        )
    elif persona == "Elevated – memory":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.65,
            ci_low=0.45,
            ci_high=0.82,
            tier="elevated",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.35, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Pause time", value=25.0, reference=20.0, shap=0.05, direction="up")]
                ),
                ModalityResult(
                    name="cognitive", probability=0.85, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=4.0, reference=7.5, shap=0.3, direction="up")]
                )
            ],
            narrative="Elevated risk driven primarily by reduced delayed word recall (4/10, ~-1.2 SD). Speech features are mostly within normal limits.",
            recommended_action="Clinician reviews explanation. Recommend full cognitive battery (e.g., MoCA).",
            model_version="v0.1.0-demo"
        )
    elif persona == "High – speech+memory":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.92,
            ci_low=0.85,
            ci_high=0.98,
            tier="high",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.88, available=True, qc_flags=[],
                    top_contributions=[
                        FeatureContribution(name="Pause time", value=38.0, reference=22.0, shap=0.25, direction="up"),
                        FeatureContribution(name="Info-unit coverage", value=11.0, reference=20.0, shap=0.15, direction="up")
                    ]
                ),
                ModalityResult(
                    name="cognitive", probability=0.95, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=2.0, reference=7.5, shap=0.35, direction="up")]
                )
            ],
            narrative="High risk driven by multiple factors: (1) longer and more frequent pauses before content words (↑ hesitation), (2) lower coverage of key scene elements (11/25), (3) reduced delayed word recall (2/10, ~−1.6 SD).",
            recommended_action="Expedited pathway: confirmatory testing (blood-based biomarkers) + memory-clinic referral.",
            model_version="v0.1.0-demo"
        )
    elif persona == "Indeterminate – poor audio":
        return RiskResult(
            session_id=session_id,
            fused_probability=0.50,
            ci_low=0.10,
            ci_high=0.90,
            tier="indeterminate",
            modalities=[
                ModalityResult(
                    name="speech", probability=0.5, available=False, qc_flags=["Low SNR", "High clipping"],
                    top_contributions=[]
                ),
                ModalityResult(
                    name="cognitive", probability=0.45, available=True, qc_flags=[],
                    top_contributions=[FeatureContribution(name="Delayed recall", value=6.0, reference=7.5, shap=0.05, direction="neutral")]
                )
            ],
            narrative="Indeterminate result due to missing/poor speech data. Cognitive scores are borderline.",
            recommended_action="Repeat screen / alternative assessment.",
            model_version="v0.1.0-demo"
        )
    else:
        # Fallback to Low risk
        return _get_mock_result(session_id, "Low risk")

@app.get("/v1/sessions/{session_id}/result", response_model=RiskResult)
def get_result(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    persona = sessions[session_id].get("persona", "Low risk")
    return _get_mock_result(session_id, persona)

@app.get("/v1/sessions/{session_id}/report")
def get_report(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    html_content = f"<html><body><h1>Clinical Report for Session {session_id}</h1><p>Demo report content...</p></body></html>"
    return HTMLResponse(content=html_content)

@app.get("/v1/sessions/{session_id}/fhir")
def get_fhir(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return JSONResponse(content={"resourceType": "Bundle", "type": "collection", "entry": []})

@app.delete("/v1/sessions/{session_id}")
def delete_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/v1/model/card")
def get_model_card():
    return {"version": "0.1.0-demo", "models": ["speech_v1", "neuropsych_v1"], "metrics": "See /reports"}
