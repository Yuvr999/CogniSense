import pytest
import numpy as np
from src.cognisense.speech.qc import check_audio_quality

def test_noisy_audio_robustness():
    # Audio with very high noise floor (low SNR)
    signal = np.random.uniform(-0.1, 0.1, 16000 * 50).astype(np.float32)
    noise = np.random.uniform(-0.5, 0.5, 16000 * 50).astype(np.float32)
    audio = signal + noise
    audio = np.clip(audio, -1.0, 1.0)
    
    res = check_audio_quality(audio, 16000)
    assert not res["passed"]
    assert "snr_too_low" in res["flags"]

def test_short_audio_robustness():
    # Audio that is too short
    audio = np.random.uniform(-0.5, 0.5, 16000 * 10).astype(np.float32)
    res = check_audio_quality(audio, 16000)
    assert not res["passed"]
    assert "duration_too_short" in res["flags"]

def test_mic_missing_robustness():
    # Complete silence (e.g. mic not working or permission denied)
    audio = np.zeros(16000 * 50).astype(np.float32)
    res = check_audio_quality(audio, 16000)
    assert not res["passed"]
    # With no signal, SNR will be arbitrary or low, and clipping will be 0.
    # It should ideally flag SNR or something else, but here we just check it fails.
    assert len(res["flags"]) > 0

