from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class FeatureContribution(BaseModel):
    name: str
    value: float
    reference: float
    shap: float
    direction: Literal["up", "down", "neutral"]


class ModalityResult(BaseModel):
    name: Literal["speech", "cognitive", "tabular"]
    probability: float
    available: bool
    qc_flags: List[str]
    top_contributions: List[FeatureContribution]


class RiskResult(BaseModel):
    session_id: str
    fused_probability: float
    ci_low: float
    ci_high: float
    tier: Literal["low", "moderate", "elevated", "high", "indeterminate"]
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


class TabularRiskInput(BaseModel):
    Age: int = Field(..., ge=18, le=120, description="Age in years")
    Gender: Literal["Male", "Female"]
    Education_Years: int = Field(..., ge=0, le=30)
    Occupation: str = "Retired"
    Family_History_Alzheimer: int = Field(0, ge=0, le=1)
    Previous_Cognitive_Decline: int = Field(0, ge=0, le=1)
    Diabetes: int = Field(0, ge=0, le=1)
    Hypertension: int = Field(0, ge=0, le=1)
    High_Cholesterol: int = Field(0, ge=0, le=1)
    Heart_Disease: int = Field(0, ge=0, le=1)
    Stroke_History: int = Field(0, ge=0, le=1)
    Head_Injury_History: int = Field(0, ge=0, le=1)
    Hearing_Loss: int = Field(0, ge=0, le=1)
    Vision_Problems: int = Field(0, ge=0, le=1)
    Sleep_Apnea: int = Field(0, ge=0, le=1)
    Smoking: int = Field(0, ge=0, le=1)
    Alcohol_Use: int = Field(0, ge=0, le=1)
    Physical_Activity_Days: int = Field(..., ge=0, le=7)
    Social_Activity_Days: int = Field(..., ge=0, le=7)
    Sleep_Hours: float = Field(..., ge=0.0, le=24.0)
    Diet_Quality: int = Field(..., ge=1, le=10)
    Stress_Level: int = Field(..., ge=1, le=10)
    Depression: int = Field(0, ge=0, le=1)
    Anxiety: int = Field(0, ge=0, le=1)
    Memory_Loss: int = Field(0, ge=0, le=1)
    Confusion: int = Field(0, ge=0, le=1)
    Difficulty_Planning: int = Field(0, ge=0, le=1)
    Language_Difficulty: int = Field(0, ge=0, le=1)
    Disorientation: int = Field(0, ge=0, le=1)
    Mood_Changes: int = Field(0, ge=0, le=1)
    Difficulty_Daily_Tasks: int = Field(0, ge=0, le=1)
    Memory_Test_Score: float = Field(..., ge=0.0, le=100.0)
    Attention_Score: float = Field(..., ge=0.0, le=100.0)
    Executive_Function_Score: float = Field(..., ge=0.0, le=100.0)
    MMSE_Score: float = Field(..., ge=0.0, le=30.0)
    MoCA_Score: float = Field(..., ge=0.0, le=30.0)
    Functional_Independence: int = Field(..., ge=1, le=10)
    BMI: float = Field(..., ge=10.0, le=60.0)
    Systolic_BP: float = Field(..., ge=50.0, le=250.0)
    Diastolic_BP: float = Field(..., ge=30.0, le=150.0)
    LDL_Cholesterol: float = Field(..., ge=20.0, le=400.0)
    HDL_Cholesterol: float = Field(..., ge=10.0, le=150.0)
    Blood_Glucose: float = Field(..., ge=30.0, le=500.0)
    Vitamin_D: float = Field(..., ge=0.0, le=150.0)
    Vitamin_B12: float = Field(..., ge=10.0, le=2000.0)
    Medication_Count: int = Field(..., ge=0, le=30)
    Genetic_Risk: int = Field(0, ge=0, le=1)


class TabularRiskResult(BaseModel):
    predicted_class: int
    probability_higher_risk: float
    probability_lower_risk: float
    tier: Literal["low", "moderate", "high"]
    category_label: str
    recommendation: str
    disclaimer: str = "Screening aid, not a diagnosis."
