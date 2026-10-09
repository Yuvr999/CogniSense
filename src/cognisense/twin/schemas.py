"""
CogniTwin API Pydantic Schemas.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class WearableObservationInput(BaseModel):
    day: int = Field(..., ge=1, le=365, description="Observation day index")
    date: Optional[str] = Field(None, description="Observation date (YYYY-MM-DD)")
    mean_hrv_ms: float = Field(..., ge=5.0, le=250.0, description="Mean Heart Rate Variability (ms)")
    resting_heart_rate_bpm: float = Field(..., ge=30.0, le=220.0, description="Resting Heart Rate (bpm)")
    sleep_duration_hours: float = Field(..., ge=0.0, le=24.0, description="Total sleep duration (hours)")
    deep_sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Deep sleep duration (hours)")
    rem_sleep_hours: Optional[float] = Field(1.5, ge=0.0, le=24.0, description="REM sleep duration (hours)")
    steps: int = Field(..., ge=0, le=100000, description="Daily steps")
    activity_minutes: int = Field(..., ge=0, le=1440, description="Moderate-to-vigorous activity minutes")
    data_quality_score: Optional[float] = Field(0.95, ge=0.0, le=1.0, description="Sensor completeness score")


class WhatIfSimulationRequest(BaseModel):
    sleep_duration_delta: Optional[float] = Field(0.0, ge=-5.0, le=5.0, description="Hypothetical change in sleep hours")
    daily_steps_delta: Optional[int] = Field(0, ge=-10000, le=15000, description="Hypothetical change in daily steps")
    activity_minutes_delta: Optional[int] = Field(0, ge=-120, le=120, description="Hypothetical change in activity minutes")
    hrv_ms_delta: Optional[float] = Field(0.0, ge=-30.0, le=30.0, description="Hypothetical change in HRV (ms)")
    medication_adherence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Hypothetical target medication adherence")


class TwinStateComparisonRequest(BaseModel):
    day_a: int = Field(..., ge=1)
    day_b: int = Field(..., ge=1)
