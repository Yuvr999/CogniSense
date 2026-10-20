import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

export function MicCheck() {
  const { t } = useTranslation();
  const { setStep } = useScreeningStore();
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error' | 'denied'>('idle');
  const [level, setLevel] = useState(0);
  const [voiceDetected, setVoiceDetected] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const voiceFramesRef = useRef(0);
  const isTestingRef = useRef(false);

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const stopMic = () => {
    isTestingRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
  };

  const handleSuccess = () => {
    stopMic();
    setStatus('success');
    // Auto-advance after 1.5 seconds, while still allowing the patient to click Continue
    autoAdvanceRef.current = setTimeout(() => {
      setStep('speech');
    }, 1800);
  };

  const handleSkip = () => {
    stopMic();
    setStep('speech');
  };

  const startTest = async () => {
    stopMic();
    setStatus('testing');
    setLevel(0);
    setVoiceDetected(false);
    voiceFramesRef.current = 0;
    isTestingRef.current = true;

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: true,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (!isTestingRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.25;
      source.connect(analyser);
      analyserRef.current = analyser;

      const timeData = new Uint8Array(analyser.fftSize);
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!isTestingRef.current || !analyserRef.current || !streamRef.current) return;

        // 1. Time-Domain amplitude (RMS calculation for accurate voice volume)
        analyserRef.current.getByteTimeDomainData(timeData);
        let sumSquares = 0;
        for (let i = 0; i < timeData.length; i++) {
          const deviation = (timeData[i] - 128) / 128;
          sumSquares += deviation * deviation;
        }
        const rms = Math.sqrt(sumSquares / timeData.length);

        // 2. Frequency-Domain vocal band (~100Hz - 3500Hz)
        analyserRef.current.getByteFrequencyData(freqData);
        let voiceBandSum = 0;
        const voiceBins = Math.min(30, freqData.length);
        for (let i = 1; i < voiceBins; i++) {
          voiceBandSum += freqData[i];
        }
        const voiceAvg = voiceBandSum / (voiceBins - 1);

        // Calculate responsive 0-100% level
        const rmsPercent = Math.min(100, Math.round(rms * 320));
        const freqPercent = Math.min(100, Math.round((voiceAvg / 75) * 100));
        const currentLevel = Math.max(rmsPercent, freqPercent);
        
        setLevel(currentLevel);

        // Speech trigger: volume exceeds threshold
        if (currentLevel > 12 || rms > 0.025 || voiceAvg > 15) {
          voiceFramesRef.current += 1;
          setVoiceDetected(true);
        }

        // 4 detected frames (~80-120ms of voice) = verified voice
        if (voiceFramesRef.current >= 4) {
          handleSuccess();
          return;
        }

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      animFrameRef.current = requestAnimationFrame(updateLevel);

      // Safe timeout: if after 8 seconds no automatic trigger, allow the user to easily retry or continue
      timeoutRef.current = setTimeout(() => {
        if (isTestingRef.current) {
          stopMic();
          setStatus('error');
        }
      }, 8000);

    } catch (err) {
      console.error('Mic check error:', err);
      stopMic();
      setStatus('denied');
    }
  };

  return (
    <PatientLayout currentStep={3} totalSteps={7} title={t('micCheck.title')}>
      <div className="max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 text-center">
        
        {status === 'idle' && (
          <>
            <div className="w-20 h-20 bg-lime/30 text-ink rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <p className="text-xl mb-4 font-semibold text-ink">{t('micCheck.intro')}</p>
            <p className="text-sm text-muted mb-8 max-w-md mx-auto">
              We will listen for a quick sample to ensure your microphone is working before recording the picture description.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" size="patient" onClick={startTest}>{t('micCheck.startTest')}</Button>
              <Button variant="secondary" size="patient" onClick={handleSkip}>{t('micCheck.skipTest')}</Button>
            </div>
          </>
        )}
        
        {status === 'testing' && (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Step 1 of 2: Speak Aloud
            </span>
            <p className="text-3xl font-bold mb-3 text-ink">{t('micCheck.sayName')}</p>
            <p className="text-sm text-muted mb-6 max-w-md">
              Speak clearly into your device. The bar below will light up as sound is detected.
            </p>

            {/* Responsive visualizer */}
            <div className="w-full max-w-lg mb-4">
              <div className="w-full h-12 bg-gray-100 rounded-full overflow-hidden flex items-center px-3 border border-gray-200 shadow-inner relative">
                <div 
                  className={`h-8 rounded-full transition-all duration-75 flex items-center justify-end pr-2 ${
                    voiceDetected ? 'bg-emerald-500 shadow-md' : 'bg-lime'
                  }`}
                  style={{ width: `${Math.max(6, level)}%` }}
                >
                  <span className={`w-3 h-3 rounded-full ${voiceDetected ? 'bg-white animate-ping' : 'bg-ink/30'}`} />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold mt-2 text-muted px-1">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${level > 8 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                  {level > 8 ? 'Voice detected' : 'Listening for audio...'}
                </span>
                <span>{level}% input level</span>
              </div>
            </div>

            {/* Direct action buttons: guarantees patient is never locked */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <Button 
                variant="primary" 
                size="patient" 
                onClick={handleSkip}
                className="w-full sm:w-auto"
              >
                I Spoke My Name — Continue →
              </Button>
              <Button 
                variant="secondary" 
                size="patient" 
                onClick={handleSkip}
                className="w-full sm:w-auto"
              >
                {t('micCheck.skipTest')}
              </Button>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-24 h-24 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p className="text-3xl font-bold mb-3 text-ink">{t('micCheck.working')}</p>
            <p className="text-sm text-muted mb-8">Audio input verified. Proceeding to the picture description task...</p>
            <Button variant="primary" size="patient" onClick={() => setStep('speech')}>{t('common.continue')}</Button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <p className="text-xl text-[var(--color-risk-high)] mb-4 font-bold">{t('micCheck.couldNotHear')}</p>
            <p className="text-base text-muted mb-8 max-w-md mx-auto">{t('micCheck.speakUp')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="primary" size="patient" onClick={startTest}>{t('micCheck.tryAgain')}</Button>
              <Button variant="secondary" size="patient" onClick={handleSkip}>{t('micCheck.skipTest')}</Button>
            </div>
          </>
        )}

        {status === 'denied' && (
          <>
            <p className="text-xl text-[var(--color-risk-high)] mb-4 font-bold">{t('micCheck.cantHearYet')}</p>
            <p className="text-base text-muted mb-8 max-w-md mx-auto">{t('micCheck.allowMic')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="primary" size="patient" onClick={startTest}>{t('micCheck.tryAgain')}</Button>
              <Button variant="secondary" size="patient" onClick={handleSkip}>Continue Without Mic</Button>
            </div>
          </>
        )}

      </div>
      {status === 'idle' && (
        <div className="mt-8 flex justify-start">
          <Button variant="secondary" size="patient" onClick={() => setStep('profile')}>{t('common.back')}</Button>
        </div>
      )}
    </PatientLayout>
  );
}
