from pydantic import BaseModel
from typing import Literal, List

class FeatureContribution(BaseModel):
    name: str
    value: float
    reference: float
    shap: float
    direction: Literal["up", "down", "neutral"]

class ModalityResult(BaseModel):
    name: Literal["speech", "cognitive"]
    probability: float
    available: bool
    qc_flags: List[str]
    top_contributions: List[FeatureContribution]

class RiskResult(BaseModel):
    session_id: str
    fused_probability: float
    ci_low: float
    ci_high: float
    tier: Literal["low", "elevated", "high", "indeterminate"]
    modalities: List[ModalityResult]
    narrative: str
    recommended_action: str
    model_version: str
    disclaimer: str = "Screening aid, not a diagnosis."

class TapEvent(BaseModel):
    target: str
    hit: bool
    timestamp: float

class CognitiveTasksInput(BaseModel):
    age: int
    education_years: int
    fluency_transcript: str
    immediate_words: List[str]
    delayed_words: List[str]
    presented_words: List[str]
    trails_taps: List[TapEvent]
