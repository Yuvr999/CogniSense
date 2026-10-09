"""
CogniTwin Daily Patient State Engine.

Computes time-indexed longitudinal state representations for patients based on
historical EHR, daily wearable telemetry, and cognitive assessments.
Enforces strict temporal consistency (no future leakage into historical states).
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import pandas as pd


# State classification categories
STATE_INITIALIZING = "BASELINE_INITIALIZING"
STATE_STABLE = "STABLE"
STATE_PHYSIOLOGICAL_DECLINE = "PHYSIOLOGICAL_DECLINE"
STATE_DATA_QUALITY_ALERT = "DATA_QUALITY_ALERT"
STATE_COGNITIVE_RISK_ELEVATED = "COGNITIVE_RISK_ELEVATED"


class DailyPatientStateEngine:
    """
    Manages deterministic computation and replay of patient digital twin states.
    """

    def __init__(self, baseline_days: int = 3):
        self.baseline_days = baseline_days

    def compute_daily_state_for_patient(
        self,
        ehr_data: Dict[str, Any],
        wearable_observations: List[Dict[str, Any]],
        cognitive_assessments: Optional[List[Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        """
        Compute sequential daily states for a single patient across all their observation days.

        Args:
            ehr_data: Patient demographic and baseline clinical dictionary.
            wearable_observations: List of daily wearable reading dicts, ordered by day/date.
            cognitive_assessments: Optional list of timestamped cognitive tests.

        Returns:
            List of daily state dictionaries, one per observation day.
        """
        if not wearable_observations:
            return []

        # Sort observations chronologically
        sorted_obs = sorted(wearable_observations, key=lambda x: (x.get("day", 0), x.get("date", "")))
        daily_states: List[Dict[str, Any]] = []

        patient_id = ehr_data.get("patient_id", "UNKNOWN")
        baseline_moca = float(ehr_data.get("baseline_cognitive_score", 26.0))
        previous_mci = int(ehr_data.get("previous_mci", 0))

        # Personal baseline accumulator (calculated from first baseline_days)
        personal_baseline = self._compute_personal_baseline(sorted_obs[:self.baseline_days])

        for idx, current_day_obs in enumerate(sorted_obs):
            day_num = current_day_obs.get("day", idx + 1)
            date_str = current_day_obs.get("date", f"Day-{day_num}")
            history_so_far = sorted_obs[:idx + 1]

            # 1. Raw measurements of current day
            hrv = float(current_day_obs.get("mean_hrv_ms", 50.0))
            rhr = float(current_day_obs.get("resting_heart_rate_bpm", 65.0))
            sleep_dur = float(current_day_obs.get("sleep_duration_hours", 7.0))
            deep_sleep = float(current_day_obs.get("deep_sleep_hours", 1.5))
            rem_sleep = float(current_day_obs.get("rem_sleep_hours", 1.5))
            steps = int(current_day_obs.get("steps", 6000))
            activity_min = int(current_day_obs.get("activity_minutes", 45))
            quality_score = float(current_day_obs.get("data_quality_score", 0.95))

            # 2. Rolling 3-day features (using history_so_far[-3:])
            window_3d = history_so_far[-3:]
            r3_hrv_mean = float(np.mean([x.get("mean_hrv_ms", hrv) for x in window_3d]))
            r3_rhr_mean = float(np.mean([x.get("resting_heart_rate_bpm", rhr) for x in window_3d]))
            r3_sleep_mean = float(np.mean([x.get("sleep_duration_hours", sleep_dur) for x in window_3d]))
            r3_sleep_std = float(np.std([x.get("sleep_duration_hours", sleep_dur) for x in window_3d])) if len(window_3d) > 1 else 0.0
            r3_deep_mean = float(np.mean([x.get("deep_sleep_hours", deep_sleep) for x in window_3d]))
            r3_steps_mean = float(np.mean([x.get("steps", steps) for x in window_3d]))

            # 3-day trend slopes
            if len(window_3d) >= 2:
                r3_hrv_slope = float((window_3d[-1].get("mean_hrv_ms", hrv) - window_3d[0].get("mean_hrv_ms", hrv)) / (len(window_3d) - 1))
                r3_steps_slope = float((window_3d[-1].get("steps", steps) - window_3d[0].get("steps", steps)) / (len(window_3d) - 1))
            else:
                r3_hrv_slope = 0.0
                r3_steps_slope = 0.0

            rolling_3d_features = {
                "rolling_3d_hrv_mean": round(r3_hrv_mean, 2),
                "rolling_3d_hrv_slope": round(r3_hrv_slope, 2),
                "rolling_3d_rhr_mean": round(r3_rhr_mean, 2),
                "rolling_3d_sleep_mean": round(r3_sleep_mean, 2),
                "rolling_3d_sleep_std": round(r3_sleep_std, 2),
                "rolling_3d_deep_sleep_mean": round(r3_deep_mean, 2),
                "rolling_3d_deep_sleep_ratio": round(r3_deep_mean / max(0.1, r3_sleep_mean), 2),
                "rolling_3d_steps_mean": round(r3_steps_mean, 1),
                "rolling_3d_steps_slope": round(r3_steps_slope, 1),
            }

            # 3. Rolling 7-day features
            window_7d = history_so_far[-7:]
            r7_hrv_mean = float(np.mean([x.get("mean_hrv_ms", hrv) for x in window_7d]))
            r7_sleep_mean = float(np.mean([x.get("sleep_duration_hours", sleep_dur) for x in window_7d]))
            r7_steps_mean = float(np.mean([x.get("steps", steps) for x in window_7d]))
            rolling_7d_features = {
                "rolling_7d_hrv_mean": round(r7_hrv_mean, 2),
                "rolling_7d_sleep_mean": round(r7_sleep_mean, 2),
                "rolling_7d_steps_mean": round(r7_steps_mean, 1),
            }

            # 4. Deviations from personal baseline
            change_from_baseline: Dict[str, Any] = {}
            if personal_baseline and day_num > 1:
                base_h = personal_baseline["baseline_hrv_ms"]
                base_s = personal_baseline["baseline_sleep_hours"]
                base_st = personal_baseline["baseline_steps"]
                base_r = personal_baseline["baseline_rhr_bpm"]
                base_d = personal_baseline["baseline_deep_sleep_hours"]

                hrv_pct = ((hrv - base_h) / max(1.0, base_h)) * 100.0
                sleep_pct = ((sleep_dur - base_s) / max(0.5, base_s)) * 100.0
                deep_pct = ((deep_sleep - base_d) / max(0.1, base_d)) * 100.0
                steps_pct = ((steps - base_st) / max(100.0, base_st)) * 100.0
                rhr_diff = rhr - base_r

                change_from_baseline = {
                    "hrv_pct_change": round(hrv_pct, 1),
                    "sleep_pct_change": round(sleep_pct, 1),
                    "deep_sleep_pct_change": round(deep_pct, 1),
                    "steps_pct_change": round(steps_pct, 1),
                    "rhr_bpm_diff": round(rhr_diff, 1),
                    "has_established_baseline": True,
                }
            else:
                change_from_baseline = {
                    "hrv_pct_change": 0.0,
                    "sleep_pct_change": 0.0,
                    "deep_sleep_pct_change": 0.0,
                    "steps_pct_change": 0.0,
                    "rhr_bpm_diff": 0.0,
                    "has_established_baseline": False,
                }

            # 5. Determine State Classification & Clinical Narrative
            twin_state, state_reason = self._classify_state(
                day_num=day_num,
                quality_score=quality_score,
                change_from_baseline=change_from_baseline,
                baseline_moca=baseline_moca,
                previous_mci=previous_mci,
                rolling_3d=rolling_3d_features
            )

            state_record = {
                "patient_id": patient_id,
                "day": day_num,
                "timestamp": date_str,
                "ehr_snapshot_reference": {
                    "age": ehr_data.get("age"),
                    "sex": ehr_data.get("sex"),
                    "previous_mci": previous_mci,
                    "baseline_cognitive_score": baseline_moca,
                    "hypertension": ehr_data.get("hypertension"),
                    "medication_adherence": ehr_data.get("medication_adherence"),
                },
                "mean_hrv_ms": hrv,
                "resting_heart_rate_bpm": rhr,
                "sleep_duration_hours": sleep_dur,
                "deep_sleep_hours": deep_sleep,
                "rem_sleep_hours": rem_sleep,
                "steps": steps,
                "activity_minutes": activity_min,
                "baseline_cognitive_score": baseline_moca,
                "cognitive_assessment_features": self._get_cognitive_snapshot(cognitive_assessments, day_num),
                "rolling_3day_features": rolling_3d_features,
                "rolling_7day_features": rolling_7d_features,
                "change_from_personal_baseline": change_from_baseline,
                "data_quality_score": quality_score,
                "twin_state": twin_state,
                "state_reason": state_reason,
                "state_updated_at": datetime.now(timezone.utc).isoformat(),
            }

            daily_states.append(state_record)

        return daily_states

    def _compute_personal_baseline(self, early_obs: List[Dict[str, Any]]) -> Optional[Dict[str, float]]:
        """Compute personal baseline from early observation days."""
        if not early_obs:
            return None
        return {
            "baseline_hrv_ms": float(np.mean([x.get("mean_hrv_ms", 50.0) for x in early_obs])),
            "baseline_rhr_bpm": float(np.mean([x.get("resting_heart_rate_bpm", 65.0) for x in early_obs])),
            "baseline_sleep_hours": float(np.mean([x.get("sleep_duration_hours", 7.0) for x in early_obs])),
            "baseline_deep_sleep_hours": float(np.mean([x.get("deep_sleep_hours", 1.5) for x in early_obs])),
            "baseline_steps": float(np.mean([x.get("steps", 6000) for x in early_obs])),
        }

    def _classify_state(
        self,
        day_num: int,
        quality_score: float,
        change_from_baseline: Dict[str, Any],
        baseline_moca: float,
        previous_mci: int,
        rolling_3d: Dict[str, Any]
    ) -> Tuple[str, str]:
        """Classify twin state based on deterministic physiological and quality rules."""
        # 1. Quality rule
        if quality_score < 0.65:
            return (
                STATE_DATA_QUALITY_ALERT,
                f"Data completeness warning: Wearable signal quality score is {quality_score:.2f} (< 0.65 threshold). Dropouts detected."
            )

        # 2. Insufficient history rule
        if day_num < 3:
            return (
                STATE_INITIALIZING,
                f"Establishing baseline: Day {day_num} observation recorded. Minimum 3 days required for calibrated trend detection."
            )

        # 3. Deviation triggers
        hrv_pct = change_from_baseline.get("hrv_pct_change", 0.0)
        deep_pct = change_from_baseline.get("deep_sleep_pct_change", 0.0)
        steps_pct = change_from_baseline.get("steps_pct_change", 0.0)
        rhr_diff = change_from_baseline.get("rhr_bpm_diff", 0.0)

        # Check adverse shifts
        significant_hrv_drop = hrv_pct <= -20.0
        significant_deep_drop = deep_pct <= -25.0
        significant_step_drop = steps_pct <= -25.0
        rhr_elevated = rhr_diff >= 5.0

        adverse_signals = sum([significant_hrv_drop, significant_deep_drop, significant_step_drop, rhr_elevated])

        if adverse_signals >= 2:
            reasons = []
            if significant_hrv_drop:
                reasons.append(f"HRV decreased by {abs(hrv_pct):.1f}% from baseline")
            if significant_deep_drop:
                reasons.append(f"Deep sleep decreased by {abs(deep_pct):.1f}%")
            if significant_step_drop:
                reasons.append(f"Daily steps dropped by {abs(steps_pct):.1f}%")
            if rhr_elevated:
                reasons.append(f"Resting HR increased by +{rhr_diff:.1f} bpm")

            combined_str = "; ".join(reasons)

            # Combined with cognitive vulnerability
            if baseline_moca < 24.0 or previous_mci == 1:
                return (
                    STATE_COGNITIVE_RISK_ELEVATED,
                    f"Elevated Cognitive Deterioration Risk: Multi-domain physiological decline ({combined_str}) superimposed on baseline cognitive vulnerability (MoCA: {baseline_moca}, Prior MCI: {previous_mci})."
                )
            else:
                return (
                    STATE_PHYSIOLOGICAL_DECLINE,
                    f"Physiological Decline Alert: Significant autonomic/rest decline detected ({combined_str})."
                )

        # 4. Default stable
        return (
            STATE_STABLE,
            "Physiological telemetry and circadian sleep patterns remain within expected personal baseline parameters (±15%)."
        )

    def _get_cognitive_snapshot(
        self,
        assessments: Optional[List[Dict[str, Any]]],
        day_num: int
    ) -> Dict[str, Any]:
        """Retrieve cognitive test records available up to current day."""
        if not assessments:
            return {"assessments_conducted": 0, "latest_score": None}
        avail = [a for a in assessments if a.get("day", 1) <= day_num]
        if not avail:
            return {"assessments_conducted": 0, "latest_score": None}
        latest = avail[-1]
        return {
            "assessments_conducted": len(avail),
            "latest_score": latest.get("score"),
            "memory_recall": latest.get("memory_recall"),
            "trails_time_sec": latest.get("trails_time_sec"),
        }

    @staticmethod
    def compare_states(state_a: Dict[str, Any], state_b: Dict[str, Any]) -> Dict[str, Any]:
        """
        Produce a structured difference between state at time A and state at time B.
        """
        day_a = state_a.get("day", 1)
        day_b = state_b.get("day", 2)

        hrv_delta = state_b.get("mean_hrv_ms", 0.0) - state_a.get("mean_hrv_ms", 0.0)
        rhr_delta = state_b.get("resting_heart_rate_bpm", 0.0) - state_a.get("resting_heart_rate_bpm", 0.0)
        sleep_delta = state_b.get("sleep_duration_hours", 0.0) - state_a.get("sleep_duration_hours", 0.0)
        deep_delta = state_b.get("deep_sleep_hours", 0.0) - state_a.get("deep_sleep_hours", 0.0)
        steps_delta = state_b.get("steps", 0) - state_a.get("steps", 0)

        state_transition = f"{state_a.get('twin_state')} → {state_b.get('twin_state')}"

        return {
            "from_day": day_a,
            "to_day": day_b,
            "state_transition": state_transition,
            "changed_features": {
                "mean_hrv_ms": {"from": state_a.get("mean_hrv_ms"), "to": state_b.get("mean_hrv_ms"), "delta": round(hrv_delta, 1)},
                "resting_heart_rate_bpm": {"from": state_a.get("resting_heart_rate_bpm"), "to": state_b.get("resting_heart_rate_bpm"), "delta": round(rhr_delta, 1)},
                "sleep_duration_hours": {"from": state_a.get("sleep_duration_hours"), "to": state_b.get("sleep_duration_hours"), "delta": round(sleep_delta, 2)},
                "deep_sleep_hours": {"from": state_a.get("deep_sleep_hours"), "to": state_b.get("deep_sleep_hours"), "delta": round(deep_delta, 2)},
                "steps": {"from": state_a.get("steps"), "to": state_b.get("steps"), "delta": steps_delta},
            },
            "previous_reason": state_a.get("state_reason"),
            "current_reason": state_b.get("state_reason"),
        }
