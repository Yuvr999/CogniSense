import numpy as np
from typing import List, Dict, Any

try:
    import opensmile
except ImportError:
    opensmile = None

def extract_pause_features(words: List[Dict[str, Any]], total_duration: float) -> dict:
    """
    Extract pause and rate features from word timestamps.
    """
    if not words:
        return {}
        
    pauses = []
    for i in range(1, len(words)):
        gap = words[i]["start"] - words[i-1]["end"]
        if gap > 0:
            pauses.append(gap)
            
    num_words = len(words)
    words_per_min = (num_words / total_duration) * 60 if total_duration > 0 else 0
    
    pause_time = sum(pauses)
    articulation_time = total_duration - pause_time
    articulation_rate = (num_words / articulation_time) * 60 if articulation_time > 0 else 0
    
    return {
        "pause_count_per_min": (len(pauses) / total_duration) * 60 if total_duration > 0 else 0,
        "mean_pause": np.mean(pauses) if pauses else 0,
        "median_pause": np.median(pauses) if pauses else 0,
        "max_pause": np.max(pauses) if pauses else 0,
        "percent_time_in_pause": (pause_time / total_duration) * 100 if total_duration > 0 else 0,
        "pauses_gt_250ms": sum(1 for p in pauses if p > 0.25),
        "pauses_gt_1s": sum(1 for p in pauses if p > 1.0),
        "words_per_min": words_per_min,
        "articulation_rate": articulation_rate,
        "phonation_time_ratio": (articulation_time / total_duration) if total_duration > 0 else 0
    }

def extract_egemaps(audio_path: str) -> dict:
    """
    Extract eGeMAPSv02 functionals using openSMILE.
    """
    if opensmile is not None:
        smile = opensmile.Smile(
            feature_set=opensmile.FeatureSet.eGeMAPSv02,
            feature_level=opensmile.FeatureLevel.Functionals,
        )
        df = smile.process_file(audio_path)
        return df.iloc[0].to_dict()
    else:
        # Mock features
        return {
            "F0semitoneFrom27.5Hz_sma3nz_amean": 35.0,
            "jitterLocal_sma3nz_amean": 0.03,
            "shimmerLocaldB_sma3nz_amean": 0.1,
            "HNRdBACF_sma3nz_amean": 15.0
        }
