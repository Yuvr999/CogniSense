import re

# Illustrative simple lexicon of categories
ANIMAL_CATEGORIES = {
    "pets": ["dog", "cat", "rabbit", "hamster", "goldfish", "mouse"],
    "farm": ["cow", "pig", "horse", "sheep", "goat", "chicken"],
    "african": ["lion", "elephant", "giraffe", "zebra", "hippo", "rhino", "cheetah"],
    "birds": ["eagle", "parrot", "pigeon", "robin", "sparrow", "hawk", "owl"],
    "aquatic": ["shark", "dolphin", "whale", "fish", "octopus", "squid", "seal"]
}

def analyze_fluency(transcript: str) -> dict:
    """
    Analyzes an animal fluency transcript to count animals, repetitions, 
    and simple cluster sizes/switches.
    """
    words = [w.lower() for w in re.findall(r'\b\w+\b', transcript)]
    
    seen = set()
    repetitions = 0
    valid_animals = []
    
    for w in words:
        # Simplistic approach: if it's in any of our dictionaries, it's an animal
        is_animal = any(w in cat_list for cat_list in ANIMAL_CATEGORIES.values())
        if is_animal:
            if w in seen:
                repetitions += 1
            else:
                seen.add(w)
                valid_animals.append(w)
                
    # Calculate clustering and switching
    switches = 0
    clusters = []
    current_cluster_size = 0
    current_category = None
    
    for w in valid_animals:
        # Find category of word
        word_cat = None
        for cat, items in ANIMAL_CATEGORIES.items():
            if w in items:
                word_cat = cat
                break
                
        if word_cat == current_category and word_cat is not None:
            current_cluster_size += 1
        else:
            if current_cluster_size > 0:
                clusters.append(current_cluster_size)
            if current_category is not None:
                switches += 1
            current_category = word_cat
            current_cluster_size = 1
            
    if current_cluster_size > 0:
        clusters.append(current_cluster_size)
        
    mean_cluster_size = sum(clusters) / len(clusters) if clusters else 0.0
    
    return {
        "total_count": len(valid_animals),
        "repetitions": repetitions,
        "switches": switches,
        "mean_cluster_size": mean_cluster_size
    }
