import pytest
from src.cognisense.cognitive.tasks import score_word_recall, score_delayed_recall, score_trails_lite

def test_score_word_recall():
    assert score_word_recall(["apple", "banana"], ["apple", "banana", "orange"]) == 2
    
def test_score_delayed_recall():
    assert score_delayed_recall(5, 3) == (5 - 3) / 5

def test_score_trails_lite():
    taps = [{"target": "1", "hit": True, "timestamp": 0.0}, {"target": "A", "hit": True, "timestamp": 10.0}]
    res = score_trails_lite(taps)
    assert res["completion_time"] == 10.0
