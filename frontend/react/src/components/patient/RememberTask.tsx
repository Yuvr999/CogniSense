import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

const WORDS_BY_LANG: Record<string, string[]> = {
  en: ["BUTTER", "ARM", "SHORE", "LETTER", "QUEEN", "CABIN", "POLE", "TICKET", "GRASS", "ENGINE"],
  hi: ["मक्खन", "हाथ", "किनारा", "पत्र", "रानी", "कुटिया", "खंभा", "टिकट", "घास", "इंजन"],
  mr: ["लोणी", "हात", "किनारा", "पत्र", "राणी", "झोपडी", "खांब", "तिकीट", "गवत", "इंजिन"]
};

export function RememberTask() {
  const { t, i18n } = useTranslation();
  const { setStep } = useScreeningStore();
  const [status, setStatus] = useState<'intro' | 'playing' | 'done'>('intro');
  const [wordIndex, setWordIndex] = useState(0);

  const lang = i18n.language || 'en';
  const words = WORDS_BY_LANG[lang] || WORDS_BY_LANG.en;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'playing') {
      if (wordIndex < words.length) {
        timer = setTimeout(() => setWordIndex(w => w + 1), 2000);
      } else {
        setStatus('done');
      }
    }
    return () => clearTimeout(timer);
  }, [status, wordIndex, words.length]);

  return (
    <PatientLayout currentStep={5} totalSteps={7}>
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        {status === 'intro' && (
          <div className="text-center max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">{t('remember.title')}</h1>
            <p className="text-xl text-muted mb-12 leading-relaxed">
              {t('remember.intro')}
            </p>
            <Button variant="primary" size="patient" onClick={() => setStatus('playing')}>
              {t('remember.showWords')}
            </Button>
          </div>
        )}

        {status === 'playing' && wordIndex < words.length && (
          <div className="flex items-center justify-center bg-white w-full max-w-4xl h-80 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-[100px] md:text-[120px] font-display font-black tracking-tighter text-ink uppercase text-center px-4">
              {words[wordIndex]}
            </h2>
          </div>
        )}

        {status === 'done' && (
          <div className="text-center max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-200">
            <h1 className="text-4xl font-bold mb-8">{t('remember.greatJob')}</h1>
            <p className="text-xl text-muted mb-12">
              {t('remember.keepInMind')}
            </p>
            <Button variant="primary" size="patient" onClick={() => setStep('fluency')}>
              {t('common.nextTask')}
            </Button>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
