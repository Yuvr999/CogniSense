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

    # Test DELETE endpoint
    resp_del = client.delete(f"/v1/sessions/{session_id}")
    assert resp_del.status_code == 200
    assert resp_del.json()["status"] == "deleted"

    # Verifying session is now gone
    resp_del_404 = client.get(f"/v1/sessions/{session_id}/result")
    assert resp_del_404.status_code == 404


def test_persistent_session_store_survival():
    from src.cognisense.api.main import PersistentSessionStore
    store = PersistentSessionStore()
    test_id = "test-survival-session-12345"
    store[test_id] = {"speech": True, "cognitive": False, "persona": "Low risk"}
    assert test_id in store

    # Re-instantiate a fresh store instance simulating server restart
    store2 = PersistentSessionStore()
    assert test_id in store2
    session_data = store2[test_id]
    assert session_data["speech"] is True
    assert session_data["persona"] == "Low risk"

    # Test in-place mutation via SessionProxy
    session_data["cognitive"] = True
    session_data["persona"] = "Elevated – memory"

    # Verify mutation persisted in a 3rd instance
    store3 = PersistentSessionStore()
    assert store3[test_id]["cognitive"] is True
    assert store3[test_id]["persona"] == "Elevated – memory"

    # Cleanup
    del store3[test_id]
    assert test_id not in store3
