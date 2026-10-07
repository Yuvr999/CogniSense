import pytest
from src.cognisense.speech.qc import check_audio_quality
from src.cognisense.speech.acoustic import extract_pause_features, extract_egemaps
from src.cognisense.speech.linguistic import extract_linguistic_features
import numpy as np

def test_qc_duration():
    audio = np.random.uniform(-0.5, 0.5, 16000 * 40).astype(np.float32)
    res = check_audio_quality(audio, 16000)
    assert "duration_too_short" in res["flags"]
    assert not res["passed"]

def test_qc_clipping():
    audio = np.ones(16000 * 50).astype(np.float32)
    res = check_audio_quality(audio, 16000)
    assert "clipping_too_high" in res["flags"]
    assert not res["passed"]
    
def test_qc_pass():
    audio = np.random.uniform(-0.5, 0.5, 16000 * 50).astype(np.float32)
    res = check_audio_quality(audio, 16000)
    assert res["passed"]

def test_extract_pause_features():
    words = [
        {"word": "hello", "start": 0.0, "end": 0.5},
        {"word": "world", "start": 1.5, "end": 2.0}
    ]
    feats = extract_pause_features(words, 2.0)
    assert feats["mean_pause"] == 1.0
    assert feats["pauses_gt_250ms"] == 1
    assert feats["pauses_gt_1s"] == 0

def test_extract_linguistic_features():
    text = "Umm let me think the boy is falling."
    feats = extract_linguistic_features(text, ["boy", "falling", "cookie"])
    assert "fillers_per_100_words" in feats
    assert feats["info_unit_coverage"] == 2/3
