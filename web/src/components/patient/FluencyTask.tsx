import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

export function FluencyTask() {
  const { t } = useTranslation();
  const { setStep, saveFluency } = useScreeningStore();
  const [status, setStatus] = useState<'intro' | 'active' | 'done'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [text, setText] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && status === 'active') {
      setStatus('done');
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleFinish = () => {
    setStatus('done');
  };

  const handleNext = () => {
    saveFluency({ text });
    setStep('trace');
  };

  // SVG Ring calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <PatientLayout currentStep={6} totalSteps={7}>
      {status === 'intro' && (
        <div className="text-center max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-200 mt-12">
          <h1 className="text-4xl font-bold mb-8">{t('fluency.introTitle')}</h1>
          <p className="text-xl text-muted mb-12">{t('fluency.introDesc')}</p>
          <Button variant="primary" size="patient" onClick={() => setStatus('active')}>{t('fluency.startTimer')}</Button>
        </div>
      )}

      {status === 'active' && (
        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto mt-4">
          <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
            <h2 className="text-3xl font-bold mb-6">{t('fluency.typeBoxTitle')}</h2>
            <textarea 
              className="flex-1 w-full bg-paper rounded-2xl p-6 text-xl font-mono focus:outline-none focus:ring-4 focus:ring-lime resize-none min-h-[300px]"
              placeholder={t('fluency.placeholder')}
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
            />
          </div>

          <div className="w-full lg:w-80 flex flex-col items-center justify-center bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            {/* Quiet ring timer */}
            <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} stroke="#F1EADF" strokeWidth="8" fill="none" />
                <circle 
                  cx="70" cy="70" r={radius} 
                  stroke="#111111" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-4xl font-mono font-bold tabular-nums">0:{timeLeft.toString().padStart(2, '0')}</span>
            </div>

            <Button variant="secondary" size="patient" onClick={handleFinish} className="w-full">
              {t('fluency.cantThinkMore')}
            </Button>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div className="text-center max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-200 mt-12">
          <h1 className="text-4xl font-bold mb-8">{t('fluency.timesUp')}</h1>
          <p className="text-xl text-muted mb-12">{t('fluency.thankYou')}</p>
          <Button variant="primary" size="patient" onClick={handleNext}>{t('common.nextTask')}</Button>
        </div>
      )}
    </PatientLayout>
  );
}
