"""
CogniTwin Backend API Schemas.

Consolidated request and response Pydantic contracts for the FastAPI microservice.
Re-exports core data schemas from src.cognisense.schemas and src.cognisense.twin.schemas.
"""

from src.cognisense.schemas import (
    FeatureContribution,
    ModalityResult,
    RiskResult,
    TapEvent,
    CognitiveTasksInput,
    TabularRiskInput,
    TabularRiskResult,
)

from src.cognisense.twin.schemas import (
    WearableObservationInput,
    WhatIfSimulationRequest,
    TwinStateComparisonRequest,
)

__all__ = [
    "FeatureContribution",
    "ModalityResult",
    "RiskResult",
    "TapEvent",
    "CognitiveTasksInput",
    "TabularRiskInput",
    "TabularRiskResult",
    "WearableObservationInput",
    "WhatIfSimulationRequest",
    "TwinStateComparisonRequest",
]
