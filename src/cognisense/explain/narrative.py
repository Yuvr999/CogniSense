from typing import List, Dict, Any

def generate_narrative(tier: str, top_features: List[Dict[str, Any]], modalities: List[str], ci: tuple) -> str:
    """
    Generate deterministic clinician-friendly narrative based on top feature contributions.
    """
    if tier == "low":
        risk_desc = "Low risk"
    elif tier == "elevated":
        risk_desc = "Elevated risk"
    elif tier == "high":
        risk_desc = "High risk"
    else:
        risk_desc = "Indeterminate risk"
        
    parts = []
    for i, item in enumerate(top_features[:3]):
        feat = item["feature"].replace("_", " ")
        val = item["value"]
        ref = item["reference"]
        direction = "higher" if item["contribution"] > 0 else "lower"
        parts.append(f"({i+1}) {feat} is {direction} than typical ({val:.2f} vs {ref:.2f})")
        
    drivers = ", ".join(parts)
    mods_str = ", ".join(modalities).title()
    ci_str = f"{ci[0]:.2f}-{ci[1]:.2f}"
    
    narrative = f"{risk_desc} driven by: {drivers}. "
    narrative += f"Modalities used: {mods_str}. Confidence interval: {ci_str}."
    
    return narrative
