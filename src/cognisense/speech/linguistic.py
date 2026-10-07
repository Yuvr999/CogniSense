import re
from typing import List, Dict

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except (ImportError, OSError):
    nlp = None

def extract_linguistic_features(text: str, info_units: List[str] = None) -> dict:
    """
    Extract lexical, syntactic, and semantic features from the transcript.
    """
    if not text.strip():
        return {}
        
    if nlp is not None:
        doc = nlp(text)
        tokens = [token.text.lower() for token in doc if not token.is_punct]
        num_tokens = len(tokens)
        
        types = set(tokens)
        num_types = len(types)
        
        ttr = num_types / num_tokens if num_tokens > 0 else 0
        
        pos_counts = {"NOUN": 0, "VERB": 0, "PRON": 0, "ADJ": 0}
        for token in doc:
            if token.pos_ in pos_counts:
                pos_counts[token.pos_] += 1
                
        pronoun_to_noun = pos_counts["PRON"] / pos_counts["NOUN"] if pos_counts["NOUN"] > 0 else 0
        
        # Disfluencies
        fillers = len(re.findall(r'\b(uh|um|hmm|like)\b', text.lower()))
        fillers_per_100 = (fillers / num_tokens) * 100 if num_tokens > 0 else 0
        
        # Syntactic
        sentences = list(doc.sents)
        mean_utterance_length = num_tokens / len(sentences) if sentences else 0
        
        features = {
            "type_token_ratio": ttr,
            "pronoun_to_noun_ratio": pronoun_to_noun,
            "fillers_per_100_words": fillers_per_100,
            "mean_utterance_length": mean_utterance_length,
            "prop_nouns": pos_counts["NOUN"] / num_tokens if num_tokens > 0 else 0,
            "prop_verbs": pos_counts["VERB"] / num_tokens if num_tokens > 0 else 0
        }
    else:
        # Mock features if spacy is not available
        words = re.findall(r'\w+', text.lower())
        num_words = len(words)
        ttr = len(set(words)) / num_words if num_words > 0 else 0
        fillers = len([w for w in words if w in ['uh', 'um', 'hmm', 'like']])
        
        features = {
            "type_token_ratio": ttr,
            "pronoun_to_noun_ratio": 0.5,
            "fillers_per_100_words": (fillers / num_words) * 100 if num_words > 0 else 0,
            "mean_utterance_length": num_words / 2 if num_words > 0 else 0, # mock 2 sents
            "prop_nouns": 0.2,
            "prop_verbs": 0.2
        }
        
    # Semantic: info units
    if info_units is None:
        info_units = ["boy", "stool", "falling", "cookie jar", "mother", "woman", "sink", "water", "dishes", "window", "curtains", "girl"]
        
    text_lower = text.lower()
    coverage = sum(1 for unit in info_units if unit in text_lower)
    features["info_unit_coverage"] = coverage / len(info_units) if info_units else 0
    
    return features
