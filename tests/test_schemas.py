from src.cognisense.schemas import RiskResult, ModalityResult, FeatureContribution

def test_risk_result_schema():
    contrib = FeatureContribution(
        name="pause_count_per_min",
        value=20.0,
        reference=12.0,
        shap=0.15,
        direction="up"
    )
    modality = ModalityResult(
        name="speech",
        probability=0.85,
        available=True,
        qc_flags=[],
        top_contributions=[contrib]
    )
    result = RiskResult(
        session_id="1234",
        fused_probability=0.82,
        ci_low=0.75,
        ci_high=0.89,
        tier="elevated",
        modalities=[modality],
        narrative="Test narrative",
        recommended_action="Test action",
        model_version="v1.0.0"
    )
    assert result.session_id == "1234"
