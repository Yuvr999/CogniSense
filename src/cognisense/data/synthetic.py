import pandas as pd
import numpy as np

def generate_synthetic_features(n_samples: int = 100, seed: int = 42) -> pd.DataFrame:
    np.random.seed(seed)
    
    # Demographics
    data = {
        'subject_id': [f'SUBJ_{i:04d}' for i in range(n_samples)],
        'age': np.random.uniform(55, 90, n_samples),
        'sex': np.random.choice(['M', 'F'], n_samples),
        'education_years': np.random.uniform(8, 20, n_samples),
        
        # Pause/rate
        'pause_count_per_min': np.random.poisson(15, n_samples),
        'mean_pause_s': np.random.uniform(0.5, 2.5, n_samples),
        
        # Prosody
        'f0_mean': np.random.normal(150, 30, n_samples),
        
        # Lexical
        'mean_log_word_freq': np.random.normal(3.5, 0.5, n_samples),
        'pronoun_noun_ratio': np.random.uniform(0.5, 2.0, n_samples),
        
        # Disfluency
        'filler_per_100w': np.random.poisson(3, n_samples),
        
        # Cognitive
        'recall_immediate': np.random.randint(0, 11, n_samples),
        'recall_delayed': np.random.randint(0, 11, n_samples),
        'animal_count': np.random.randint(5, 30, n_samples),
        
        # Target (for testing, not real data)
        'label': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    }
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    df = generate_synthetic_features(10)
    print(df.head())
