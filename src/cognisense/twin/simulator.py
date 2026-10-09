"""
CogniTwin What-If Intervention Simulator.

Enables clinicians to explore model sensitivity by altering patient lifestyle,
sleep, and adherence inputs and evaluating counterfactual predictions with the
exact same fitted pipeline.
"""

from typing import Any, Dict, List, Optional
from src.cognisense.twin.prediction_pipeline import CogniTwinPredictionPipeline


class WhatIfInterventionSimulator:
    """
    Simulates hypothetical lifestyle/biomarker counterfactuals using the fitted ML pipeline.
    """

    def __init__(self, model_pipeline: CogniTwinPredictionPipeline):
        self.model = model_pipeline

    def simulate_scenario(
        self,
        baseline_features: Dict[str, Any],
        hypothetical_adjustments: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Run counterfactual prediction on modified features.

        Args:
            baseline_features: Current feature snapshot of the patient.
            hypothetical_adjustments: Dict of modifications, e.g.:
                {
                    "sleep_duration_delta": +1.5,
                    "daily_steps_delta": +2500,
                    "hrv_ms_delta": +8.0,
                    "medication_adherence": 0.95,
                    "activity_minutes_delta": +25
                }

        Returns:
            Dictionary containing:
            - baseline_prediction
            - scenario_prediction
            - probability_delta
            - tier_transition
            - adjustments_applied
            - clinical_sensitivity_disclaimer
        """
        # 1. Baseline prediction
        baseline_pred = self.model.predict_patient(baseline_features)

        # 2. Construct scenario features
        scenario_features = dict(baseline_features)
        adjustments_applied = {}

        if "sleep_duration_delta" in hypothetical_adjustments:
            delta = float(hypothetical_adjustments["sleep_duration_delta"])
            curr_sleep = float(scenario_features.get("mean_sleep_hours", 7.0))
            new_sleep = round(max(3.0, min(11.0, curr_sleep + delta)), 2)
            scenario_features["mean_sleep_hours"] = new_sleep
            # Also adjust deep sleep proportionally
            curr_deep = float(scenario_features.get("mean_deep_sleep_hours", 1.5))
            new_deep = round(max(0.5, curr_deep + (delta * 0.22)), 2)
            scenario_features["mean_deep_sleep_hours"] = new_deep
            scenario_features["deep_sleep_ratio"] = round(new_deep / max(0.1, new_sleep), 2)
            adjustments_applied["Sleep Duration"] = f"{curr_sleep} hrs → {new_sleep} hrs ({delta:+.1f} hrs)"

        if "daily_steps_delta" in hypothetical_adjustments:
            delta_steps = int(hypothetical_adjustments["daily_steps_delta"])
            curr_steps = int(scenario_features.get("mean_daily_steps", 6000))
            new_steps = max(1000, min(25000, curr_steps + delta_steps))
            scenario_features["mean_daily_steps"] = new_steps
            adjustments_applied["Daily Steps"] = f"{curr_steps:,} → {new_steps:,} ({delta_steps:+d})"

        if "activity_minutes_delta" in hypothetical_adjustments:
            delta_act = int(hypothetical_adjustments["activity_minutes_delta"])
            curr_act = int(scenario_features.get("mean_activity_minutes", 45))
            new_act = max(10, min(240, curr_act + delta_act))
            scenario_features["mean_activity_minutes"] = new_act
            adjustments_applied["Activity Minutes"] = f"{curr_act} min → {new_act} min ({delta_act:+d})"

        if "hrv_ms_delta" in hypothetical_adjustments:
            delta_hrv = float(hypothetical_adjustments["hrv_ms_delta"])
            curr_hrv = float(scenario_features.get("mean_hrv_ms", 50.0))
            new_hrv = round(max(15.0, min(110.0, curr_hrv + delta_hrv)), 1)
            scenario_features["mean_hrv_ms"] = new_hrv
            adjustments_applied["HRV"] = f"{curr_hrv} ms → {new_hrv} ms ({delta_hrv:+.1f} ms)"

        if "medication_adherence" in hypothetical_adjustments:
            new_adh = float(hypothetical_adjustments["medication_adherence"])
            curr_adh = float(scenario_features.get("medication_adherence", 0.8))
            scenario_features["medication_adherence"] = round(max(0.1, min(1.0, new_adh)), 2)
            adjustments_applied["Medication Adherence"] = f"{int(curr_adh*100)}% → {int(new_adh*100)}%"

        # 3. Predict on hypothetical snapshot
        scenario_pred = self.model.predict_patient(scenario_features)

        p_base = baseline_pred["risk_probability"]
        p_scen = scenario_pred["risk_probability"]
        prob_delta = round(p_scen - p_base, 3)

        return {
            "patient_id": baseline_features.get("patient_id", "UNKNOWN"),
            "baseline": baseline_pred,
            "scenario": scenario_pred,
            "probability_delta": prob_delta,
            "tier_transition": f"{baseline_pred['risk_tier']} → {scenario_pred['risk_tier']}",
            "adjustments_applied": adjustments_applied,
            "disclaimer": (
                "Hypothetical Sensitivity Simulation: Explores model response to altered parameters. "
                "Does NOT establish clinical causal intervention efficacy or replace medical judgement."
            ),
        }
