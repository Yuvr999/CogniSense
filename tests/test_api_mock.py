from fastapi.testclient import TestClient
from src.cognisense.api.main import app

client = TestClient(app)

def test_full_flow():
    resp = client.post("/v1/sessions")
    assert resp.status_code == 200
    session_id = resp.json()["session_id"]
    
    speech_data = {"file": ("audio.wav", b"dummy audio content", "audio/wav")}
    resp_speech = client.post(f"/v1/sessions/{session_id}/speech", files=speech_data)
    assert resp_speech.status_code == 200

    resp_cog = client.post(f"/v1/sessions/{session_id}/cognitive", json={"persona": "High – speech+memory"})
    assert resp_cog.status_code == 200

    resp_res = client.get(f"/v1/sessions/{session_id}/result")
    assert resp_res.status_code == 200
    res_json = resp_res.json()
    assert res_json["tier"] == "high"
    
    resp_rep = client.get(f"/v1/sessions/{session_id}/report")
    assert resp_rep.status_code == 200
    
    resp_fhir = client.get(f"/v1/sessions/{session_id}/fhir")
    assert resp_fhir.status_code == 200
