"""
CogniSense Synthetic Data Generators.

Provides synthetic data generators for multimodal cognitive screening experiments
and tabular clinical feature modeling without exposing private participant data.
"""

from typing import Optional
import numpy as np
import pandas as pd


def generate_synthetic_features(n_samples: int = 100, seed: int = 42) -> pd.DataFrame:
    """
    Generate synthetic speech and brief cognitive task features for testing.
    
    Args:
        n_samples: Number of synthetic subject records to generate.
        seed: Random seed for reproducibility.
        
    Returns:
        pd.DataFrame containing synthetic subject metrics and binary labels.
    """
    np.random.seed(seed)
    
    data = {
        "subject_id": [f"SUBJ_{i:04d}" for i in range(n_samples)],
        "age": np.random.uniform(55, 90, n_samples),
        "sex": np.random.choice(["M", "F"], n_samples),
        "education_years": np.random.uniform(8, 20, n_samples),
        
        # Pause/rate
        "pause_count_per_min": np.random.poisson(15, n_samples),
        "mean_pause_s": np.random.uniform(0.5, 2.5, n_samples),
        
        # Prosody
        "f0_mean": np.random.normal(150, 30, n_samples),
        
        # Lexical
        "mean_log_word_freq": np.random.normal(3.5, 0.5, n_samples),
        "pronoun_noun_ratio": np.random.uniform(0.5, 2.0, n_samples),
        
        # Disfluency
        "filler_per_100w": np.random.poisson(3, n_samples),
        
        # Cognitive
        "recall_immediate": np.random.randint(0, 11, n_samples),
        "recall_delayed": np.random.randint(0, 11, n_samples),
        "animal_count": np.random.randint(5, 30, n_samples),
        
        # Target (for testing, not real data)
        "label": np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    }
    
    return pd.DataFrame(data)


def generate_tabular_risk_dataset(
    n_samples: int = 1000,
    seed: int = 42,
    include_leakage_columns: bool = False
) -> pd.DataFrame:
    """
    Generate rich synthetic tabular clinical and lifestyle screening dataset.
    
    Includes demographics, family history, medical conditions, lifestyle,
    cognitive symptoms, cognitive test scores, physical/biological factors,
    medication history, and genetic risk indicator.

    Args:
        n_samples: Number of patient records (default: 1000).
        seed: Random seed for reproducibility (default: 42).
        include_leakage_columns: If False (default), excludes 'Person_ID' and 'Risk_Score'.

    Returns:
        pd.DataFrame containing feature matrix and 'Early_Alzheimer_Risk' target.
    """
    np.random.seed(seed)
    n = n_samples

    # 1. Demographics
    age = np.random.randint(40, 91, n)
    gender = np.random.choice(["Male", "Female"], n, p=[0.48, 0.52])
    education_years = np.random.randint(5, 21, n)
    occupation = np.random.choice(
        ["Retired", "Office", "Business", "Manual_Work", "Professional"], n
    )

    # 2. Medical / Family History
    family_history_alzheimer = np.random.choice([0, 1], n, p=[0.75, 0.25])
    previous_cognitive_decline = np.random.choice([0, 1], n, p=[0.78, 0.22])
    diabetes = np.random.choice([0, 1], n, p=[0.78, 0.22])
    hypertension = np.random.choice([0, 1], n, p=[0.65, 0.35])
    high_cholesterol = np.random.choice([0, 1], n, p=[0.70, 0.30])
    heart_disease = np.random.choice([0, 1], n, p=[0.85, 0.15])
    stroke_history = np.random.choice([0, 1], n, p=[0.93, 0.07])
    head_injury_history = np.random.choice([0, 1], n, p=[0.88, 0.12])
    hearing_loss = np.random.choice([0, 1], n, p=[0.80, 0.20])
    vision_problems = np.random.choice([0, 1], n, p=[0.78, 0.22])
    sleep_apnea = np.random.choice([0, 1], n, p=[0.85, 0.15])

    # 3. Lifestyle
    smoking = np.random.choice([0, 1], n, p=[0.72, 0.28])
    alcohol_use = np.random.choice([0, 1], n, p=[0.70, 0.30])
    physical_activity_days = np.random.randint(0, 8, n)
    social_activity_days = np.random.randint(0, 8, n)
    sleep_hours = np.round(np.random.normal(7, 1.2, n).clip(4, 10), 1)
    diet_quality = np.random.randint(1, 11, n)
    stress_level = np.random.randint(1, 11, n)

    # 4. Psychological
    depression = np.random.choice([0, 1], n, p=[0.75, 0.25])
    anxiety = np.random.choice([0, 1], n, p=[0.70, 0.30])

    # 5. Early Symptoms
    memory_loss = np.random.choice([0, 1], n, p=[0.65, 0.35])
    confusion = np.random.choice([0, 1], n, p=[0.75, 0.25])
    difficulty_planning = np.random.choice([0, 1], n, p=[0.78, 0.22])
    language_difficulty = np.random.choice([0, 1], n, p=[0.82, 0.18])
    disorientation = np.random.choice([0, 1], n, p=[0.85, 0.15])
    mood_changes = np.random.choice([0, 1], n, p=[0.70, 0.30])
    difficulty_daily_tasks = np.random.choice([0, 1], n, p=[0.82, 0.18])

    # 6. Cognitive Scores
    memory_test_score = np.round(np.random.normal(75, 15, n).clip(20, 100), 1)
    attention_score = np.round(np.random.normal(75, 14, n).clip(20, 100), 1)
    executive_function_score = np.round(np.random.normal(73, 15, n).clip(20, 100), 1)
    mmse_score = np.round(np.random.normal(26, 3, n).clip(10, 30), 1)
    moca_score = np.round(np.random.normal(24, 4, n).clip(8, 30), 1)
    functional_independence = np.random.randint(1, 11, n)

    # 7. Physical / Biological
    bmi = np.round(np.random.normal(25, 4, n).clip(15, 40), 1)
    systolic_bp = np.round(np.random.normal(125, 18, n).clip(90, 190), 0)
    diastolic_bp = np.round(np.random.normal(78, 10, n).clip(50, 120), 0)
    ldl_cholesterol = np.round(np.random.normal(120, 35, n).clip(40, 250), 1)
    hdl_cholesterol = np.round(np.random.normal(50, 12, n).clip(20, 100), 1)
    blood_glucose = np.round(np.random.normal(105, 30, n).clip(60, 250), 1)
    vitamin_d = np.round(np.random.normal(30, 10, n).clip(5, 80), 1)
    vitamin_b12 = np.round(np.random.normal(400, 120, n).clip(100, 1000), 1)

    # 8. Medication / Genetic Risk
    medication_count = np.random.randint(0, 9, n)
    genetic_risk = np.random.choice([0, 1], n, p=[0.85, 0.15])

    # 9. Synthetic latent risk score calculation
    latent_risk = (
        (age - 40) * 0.8
        + family_history_alzheimer * 12
        + previous_cognitive_decline * 9
        + genetic_risk * 10
        + diabetes * 5
        + hypertension * 5
        + high_cholesterol * 4
        + heart_disease * 5
        + stroke_history * 8
        + head_injury_history * 6
        + hearing_loss * 4
        + vision_problems * 2
        + sleep_apnea * 4
        + smoking * 4
        + alcohol_use * 2
        - physical_activity_days * 1.5
        - social_activity_days * 1.0
        - (sleep_hours - 7)
        - (diet_quality - 5) * 0.5
        + stress_level * 0.7
        + depression * 4
        + anxiety * 2
        + memory_loss * 10
        + confusion * 7
        + difficulty_planning * 6
        + language_difficulty * 5
        + disorientation * 7
        + mood_changes * 3
        + difficulty_daily_tasks * 7
        - (memory_test_score - 70) * 0.15
        - (attention_score - 70) * 0.10
        - (executive_function_score - 70) * 0.10
        - (mmse_score - 24) * 1.5
        - (moca_score - 22) * 1.2
        - functional_independence * 1.0
        + (bmi - 25) * 0.2
        + (systolic_bp - 120) * 0.08
        + (ldl_cholesterol - 100) * 0.03
        + (blood_glucose - 100) * 0.03
        + medication_count * 0.5
    )
    latent_risk += np.random.normal(0, 8, n)
    threshold = np.percentile(latent_risk, 70)
    early_alzheimer_risk = (latent_risk >= threshold).astype(int)

    data_dict = {
        "Age": age,
        "Gender": gender,
        "Education_Years": education_years,
        "Occupation": occupation,
        "Family_History_Alzheimer": family_history_alzheimer,
        "Previous_Cognitive_Decline": previous_cognitive_decline,
        "Diabetes": diabetes,
        "Hypertension": hypertension,
        "High_Cholesterol": high_cholesterol,
        "Heart_Disease": heart_disease,
        "Stroke_History": stroke_history,
        "Head_Injury_History": head_injury_history,
        "Hearing_Loss": hearing_loss,
        "Vision_Problems": vision_problems,
        "Sleep_Apnea": sleep_apnea,
        "Smoking": smoking,
        "Alcohol_Use": alcohol_use,
        "Physical_Activity_Days": physical_activity_days,
        "Social_Activity_Days": social_activity_days,
        "Sleep_Hours": sleep_hours,
        "Diet_Quality": diet_quality,
        "Stress_Level": stress_level,
        "Depression": depression,
        "Anxiety": anxiety,
        "Memory_Loss": memory_loss,
        "Confusion": confusion,
        "Difficulty_Planning": difficulty_planning,
        "Language_Difficulty": language_difficulty,
        "Disorientation": disorientation,
        "Mood_Changes": mood_changes,
        "Difficulty_Daily_Tasks": difficulty_daily_tasks,
        "Memory_Test_Score": memory_test_score,
        "Attention_Score": attention_score,
        "Executive_Function_Score": executive_function_score,
        "MMSE_Score": mmse_score,
        "MoCA_Score": moca_score,
        "Functional_Independence": functional_independence,
        "BMI": bmi,
        "Systolic_BP": systolic_bp,
        "Diastolic_BP": diastolic_bp,
        "LDL_Cholesterol": ldl_cholesterol,
        "HDL_Cholesterol": hdl_cholesterol,
        "Blood_Glucose": blood_glucose,
        "Vitamin_D": vitamin_d,
        "Vitamin_B12": vitamin_b12,
        "Medication_Count": medication_count,
        "Genetic_Risk": genetic_risk,
        "Early_Alzheimer_Risk": early_alzheimer_risk,
    }

    if include_leakage_columns:
        data_dict["Person_ID"] = list(range(1, n + 1))
        data_dict["Risk_Score"] = np.round(latent_risk, 2)

    return pd.DataFrame(data_dict)
