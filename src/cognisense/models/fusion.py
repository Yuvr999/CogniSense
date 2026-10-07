import numpy as np

def logit(p: float) -> float:
    # Add epsilon to prevent log(0)
    eps = 1e-9
    p = max(eps, min(1 - eps, p))
    return np.log(p / (1 - p))

def expit(log_odds: float) -> float:
    return 1 / (1 + np.exp(-log_odds))

class LateFusionModel:
    def __init__(self, prior_pop: float = 0.15, w_speech: float = 0.7, w_cog: float = 0.7, 
                 prior_train_speech: float = 0.5, prior_train_cog: float = 0.5):
        self.prior_pop = prior_pop
        self.w_speech = w_speech
        self.w_cog = w_cog
        self.prior_train_speech = prior_train_speech
        self.prior_train_cog = prior_train_cog

    def fuse(self, prob_speech: float = None, prob_cog: float = None) -> dict:
        """
        Fuse calibrated probabilities using late fusion (weighted log-odds).
        Handles missing modalities by skipping their term.
        """
        log_odds_fused = logit(self.prior_pop)
        modalities_used = []

        if prob_speech is not None:
            log_odds_fused += self.w_speech * (logit(prob_speech) - logit(self.prior_train_speech))
            modalities_used.append("speech")
            
        if prob_cog is not None:
            log_odds_fused += self.w_cog * (logit(prob_cog) - logit(self.prior_train_cog))
            modalities_used.append("cognitive")
            
        if not modalities_used:
            raise ValueError("At least one modality must be provided.")
            
        fused_prob = expit(log_odds_fused)
        
        return {
            "fused_probability": fused_prob,
            "modalities_used": modalities_used,
            "missing_modality": len(modalities_used) < 2
        }
