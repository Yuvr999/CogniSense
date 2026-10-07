import numpy as np

def check_audio_quality(audio_data: np.ndarray, sample_rate: int = 16000) -> dict:
    """
    Check audio quality based on duration, clipping, and estimated SNR.
    
    Args:
        audio_data: numpy array of audio samples (float32, normalized -1 to 1)
        sample_rate: sampling rate of the audio
        
    Returns:
        dict: {'passed': bool, 'flags': list[str]}
    """
    duration = len(audio_data) / sample_rate
    flags = []
    
    if duration < 45.0:
        flags.append("duration_too_short")
        
    clipping_ratio = np.sum(np.abs(audio_data) >= 0.99) / len(audio_data)
    if clipping_ratio > 0.01:
        flags.append("clipping_too_high")
        
    # Dummy SNR estimation for now
    noise_floor = np.percentile(np.abs(audio_data), 10)
    signal_level = np.percentile(np.abs(audio_data), 90)
    
    if noise_floor > 0:
        snr_db = 20 * np.log10(signal_level / noise_floor)
    else:
        snr_db = 50.0 # Arbitrary high value if no noise
        
    if snr_db < 15.0:
        flags.append("snr_too_low")
        
    passed = len(flags) == 0
    return {"passed": passed, "flags": flags}
