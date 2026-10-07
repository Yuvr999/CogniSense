import pandas as pd
import re

# Banned columns as per Section 8.4: CDR*, MMSE, MOCA, ADAS*, FAQ, LDELTOTAL, diagnosis-derived, imaging, CSF, PET, APOE
BANNED_PATTERNS = [
    r"^CDR.*",
    r"^MMSE.*",
    r"^MOCA.*",
    r"^ADAS.*",
    r"^FAQ.*",
    r"^LDELTOTAL.*",
    r"^APOE.*",
    r"^FDG.*",
    r"^PIB.*",
    r"^AV45.*", # PET
    r"^ABETA.*", # CSF
    r"^TAU.*", # CSF
    r"^PTAU.*", # CSF
    r"^DXCHANGE.*",
    r"^DIAGNOSIS.*"
]

def check_leakage(df: pd.DataFrame) -> None:
    """
    Checks if any banned columns are present in the dataframe.
    Raises ValueError if leakage is detected.
    """
    leaked_columns = []
    for col in df.columns:
        for pattern in BANNED_PATTERNS:
            if re.match(pattern, col, re.IGNORECASE):
                # Allow exceptions if any (currently none)
                leaked_columns.append(col)
                break
                
    if leaked_columns:
        raise ValueError(f"Leakage detected. The following banned columns are present: {leaked_columns}")

def load_and_filter_adni_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Filters the ADNI dataframe to remove banned columns and keep only permitted ones.
    """
    allowed_cols = []
    for col in df.columns:
        banned = False
        for pattern in BANNED_PATTERNS:
            if re.match(pattern, col, re.IGNORECASE):
                banned = True
                break
        if not banned:
            allowed_cols.append(col)
            
    return df[allowed_cols].copy()

def get_adni_features() -> list:
    """
    Returns a list of feature column names that are explicitly allowed.
    """
    return [
        "AGE", "PTGENDER", "PTEDUCAT", 
        "RAVLT_immediate", "RAVLT_learning", "RAVLT_forgetting", "RAVLT_perc_forgetting",
        "TRABSCOR", "TRAASCOR", "CATANIMSC"
    ]
