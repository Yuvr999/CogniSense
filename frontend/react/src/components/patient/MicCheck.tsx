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
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => stopMic();
  }, []);

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const startTest = async () => {
    setStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      let peaks = 0;
      
      const updateLevel = () => {
        if (!streamRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / dataArray.length;
        const normalizedLevel = Math.min(100, (avg / 128) * 100);
        setLevel(normalizedLevel);
        
        if (normalizedLevel > 20) peaks++;
        
        if (peaks > 20) {
          // Passed check
          setStatus('success');
          stopMic();
          return;
        }
        requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
      
      // Timeout after 10s if not successful
      setTimeout(() => {
        if (status === 'testing' && peaks <= 20) {
          setStatus('error');
          stopMic();
        }
      }, 10000);

    } catch (err) {
      setStatus('denied');
    }
  };

  return (
    <PatientLayout currentStep={3} totalSteps={7} title={t('micCheck.title')}>
      <div className="max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center">
        
        {status === 'idle' && (
          <>
            <p className="text-xl mb-8">{t('micCheck.intro')}</p>
            <Button variant="primary" size="patient" onClick={startTest}>{t('micCheck.startTest')}</Button>
          </>
        )}
        
        {status === 'testing' && (
          <>
            <p className="text-3xl font-bold mb-12">{t('micCheck.sayName')}</p>
            <div className="w-full h-12 bg-gray-100 rounded-full overflow-hidden flex items-center px-2">
              <div 
                className="h-8 bg-lime rounded-full transition-all duration-75"
                style={{ width: `${Math.max(5, level)}%` }}
              ></div>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-24 h-24 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p className="text-3xl font-bold mb-12">{t('micCheck.working')}</p>
            <Button variant="primary" size="patient" onClick={() => setStep('speech')}>{t('common.continue')}</Button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <p className="text-xl text-[var(--color-risk-high)] mb-8 font-bold">{t('micCheck.couldNotHear')}</p>
            <p className="text-xl text-muted mb-8">{t('micCheck.speakUp')}</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" size="patient" onClick={() => setStep('speech')}>{t('micCheck.skipTest')}</Button>
              <Button variant="primary" size="patient" onClick={startTest}>{t('micCheck.tryAgain')}</Button>
            </div>
          </>
        )}

        {status === 'denied' && (
          <>
            <p className="text-xl text-[var(--color-risk-high)] mb-8 font-bold">{t('micCheck.cantHearYet')}</p>
            <p className="text-xl text-muted mb-8">{t('micCheck.allowMic')}</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" size="patient" onClick={() => setStep('speech')}>{t('micCheck.skipTest')}</Button>
              <Button variant="primary" size="patient" onClick={startTest}>{t('micCheck.tryAgain')}</Button>
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
