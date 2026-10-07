import pytest
import pandas as pd
from src.cognisense.data.adni_loader import load_and_filter_adni_data, check_leakage

def test_no_leakage():
    data = {
        "PTID": ["001_S_0001", "001_S_0002"],
        "AGE": [75.0, 80.0],
        "PTGENDER": ["Male", "Female"],
        "PTEDUCAT": [16, 12],
        "DX": ["CN", "MCI"],
        "RAVLT_immediate": [45, 30],
        "TRABSCOR": [120, 200],
        "CDRSB": [0.0, 1.5],
        "MMSE": [30, 24],
        "MOCA": [28, 20],
        "ADAS11": [5.0, 15.0],
        "FAQ": [0, 5],
        "LDELTOTAL": [10, 4],
        "APOE4": [0, 1],
        "FDG": [1.2, 0.9],
        "PIB": [1.5, 2.0],
        "ABETA": [200, 100],
        "DXCHANGE": [1, 2]
    }
    df = pd.DataFrame(data)
    
    with pytest.raises(ValueError, match="Leakage detected"):
        check_leakage(df)
        
    filtered_df = load_and_filter_adni_data(df)
    check_leakage(filtered_df)
    
    assert "CDRSB" not in filtered_df.columns
    assert "MMSE" not in filtered_df.columns
    assert "AGE" in filtered_df.columns
