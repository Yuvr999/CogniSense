import numpy as np

def compute_z_score(raw_score: float, mean: float, std: float) -> float:
    """
    Computes a standard z-score.
    """
    if std == 0:
        return 0.0
    return (raw_score - mean) / std

def get_fluency_norms(age: int, education_years: int) -> dict:
    """
    Returns normative mean and standard deviation for Animal Fluency.
    
    Source [ILLUSTRATIVE PLACEHOLDER]: 
    Tombaugh, T. N., Kozak, J., & Rees, L. (1999). 
    Normative data stratified by age and education for two measures of verbal fluency: FAS and animal naming.
    Archives of clinical neuropsychology, 14(2), 167-177.
    """
    # Illustrative adjustments
    base_mean = 18.0
    base_std = 4.0
    
    # Education adjustment
    if education_years < 12:
        base_mean -= 2.0
    elif education_years > 16:
        base_mean += 2.0
        
    # Age adjustment
    if age > 75:
        base_mean -= 2.5
    elif age > 65:
        base_mean -= 1.0
        
    return {"mean": base_mean, "std": base_std}

def get_recall_norms(age: int, education_years: int) -> dict:
    """
    Returns normative mean and std for 10-word list delayed recall.
    
    Source [ILLUSTRATIVE PLACEHOLDER]:
    Based loosely on CERAD word list recall normative data patterns.
    """
    base_mean = 7.0
    base_std = 1.5
    
    if education_years < 12:
        base_mean -= 1.0
    if age > 75:
        base_mean -= 1.5
        
    return {"mean": base_mean, "std": base_std}

def get_trails_lite_norms(age: int, education_years: int) -> dict:
    """
    Returns normative mean and std for Trail Making Lite completion time (seconds).
    
    Source [ILLUSTRATIVE PLACEHOLDER]:
    Based loosely on TMT-B normative data (Tombaugh 2004) scaled for a shorter digital version.
    """
    base_mean = 45.0
    base_std = 15.0
    
    if education_years < 12:
        base_mean += 10.0 # Takes longer
    if age > 75:
        base_mean += 15.0
        
    return {"mean": base_mean, "std": base_std}
