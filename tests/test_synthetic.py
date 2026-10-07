from src.cognisense.data.synthetic import generate_synthetic_features

def test_synthetic_generation():
    df = generate_synthetic_features(10)
    assert len(df) == 10
    assert 'subject_id' in df.columns
    assert 'age' in df.columns
    assert 'label' in df.columns
