from typing import List, Dict, Any
from .norms import get_fluency_norms, get_recall_norms, get_trails_lite_norms, compute_z_score
from .fluency_analysis import analyze_fluency

def score_word_recall(presented_words: List[str], recalled_words: List[str]) -> Dict[str, Any]:
    """
    Scores the word list recall task.
    Handles repetitions and zero recall.
    """
    presented_set = set(w.lower() for w in presented_words)
    recalled_lower = [w.lower() for w in recalled_words]
    
    seen = set()
    correct = 0
    repetitions = 0
    intrusions = 0
    
    for w in recalled_lower:
        if w in seen:
            repetitions += 1
        elif w in presented_set:
            correct += 1
            seen.add(w)
        else:
            intrusions += 1
            seen.add(w)
            
    return {
        "correct_count": correct,
        "repetitions": repetitions,
        "intrusions": intrusions
    }

def score_delayed_recall(immediate_score: int, delayed_score: int) -> float:
    """
    Computes percent forgetting.
    """
    if immediate_score == 0:
        return 0.0 # Cannot forget if nothing was learned
    
    forgetting = (immediate_score - delayed_score) / immediate_score
    return max(0.0, min(1.0, forgetting))

def score_trails_lite(taps: List[Dict[str, Any]], timeout_seconds: float = 90.0) -> Dict[str, Any]:
    """
    Scores Trail Making Lite.
    taps should be a list of dicts: {"target": "1", "hit": True, "timestamp": 123.4}
    """
    if not taps:
        return {"completion_time": timeout_seconds, "errors": 0, "completed": False}
        
    start_time = taps[0]["timestamp"]
    end_time = taps[-1]["timestamp"]
    completion_time = end_time - start_time
    
    if completion_time > timeout_seconds:
        completion_time = timeout_seconds
        completed = False
    else:
        completed = True
        
    errors = sum(1 for t in taps if not t.get("hit", True))
    
    # Inter-tap intervals
    intervals = []
    for i in range(1, len(taps)):
        intervals.append(taps[i]["timestamp"] - taps[i-1]["timestamp"])
        
    iti_cv = 0.0
    if len(intervals) > 1:
        mean_iti = sum(intervals) / len(intervals)
        var_iti = sum((x - mean_iti)**2 for x in intervals) / (len(intervals) - 1)
        std_iti = var_iti ** 0.5
        iti_cv = std_iti / mean_iti if mean_iti > 0 else 0.0
        
    return {
        "completion_time": completion_time,
        "errors": errors,
        "iti_cv": iti_cv,
        "completed": completed
    }

def generate_cognitive_profile(
    age: int, 
    education_years: int, 
    fluency_transcript: str, 
    immediate_words: List[str],
    delayed_words: List[str],
    presented_words: List[str],
    trails_taps: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Generates a full cognitive profile with normative z-scores.
    """
    # 1. Fluency
    fluency_stats = analyze_fluency(fluency_transcript)
    fluency_norm = get_fluency_norms(age, education_years)
    fluency_z = compute_z_score(fluency_stats["total_count"], fluency_norm["mean"], fluency_norm["std"])
    
    # 2. Recall
    imm_stats = score_word_recall(presented_words, immediate_words)
    del_stats = score_word_recall(presented_words, delayed_words)
    recall_norm = get_recall_norms(age, education_years)
    delayed_z = compute_z_score(del_stats["correct_count"], recall_norm["mean"], recall_norm["std"])
    
    forgetting = score_delayed_recall(imm_stats["correct_count"], del_stats["correct_count"])
    
    # 3. Trails
    trails_stats = score_trails_lite(trails_taps)
    trails_norm = get_trails_lite_norms(age, education_years)
    
    # For trails, lower time is better. 
    # Usually z-score is (score - mean) / std. We can invert it so positive is better, or keep standard.
    # We will keep standard: positive z-score means they took LONGER (worse).
    trails_z = compute_z_score(trails_stats["completion_time"], trails_norm["mean"], trails_norm["std"])
    
    return {
        "raw_scores": {
            "fluency_count": fluency_stats["total_count"],
            "immediate_recall": imm_stats["correct_count"],
            "delayed_recall": del_stats["correct_count"],
            "percent_forgetting": forgetting,
            "trails_time": trails_stats["completion_time"],
            "trails_errors": trails_stats["errors"]
        },
        "z_scores": {
            "fluency_z": fluency_z,
            "delayed_recall_z": delayed_z,
            "trails_z": trails_z
        }
    }
