import React, { useState, useEffect } from 'react';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

const WORDS = ["BUTTER", "ARM", "SHORE", "LETTER", "QUEEN", "CABIN", "POLE", "TICKET", "GRASS", "ENGINE"];

export function RememberTask() {
  const { setStep } = useScreeningStore();
  const [status, setStatus] = useState<'intro' | 'playing' | 'done'>('intro');
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'playing') {
      if (wordIndex < WORDS.length) {
        timer = setTimeout(() => setWordIndex(w => w + 1), 2000);
      } else {
        setStatus('done');
      }
    }
    return () => clearTimeout(timer);
  }, [status, wordIndex]);

  return (
    <PatientLayout currentStep={5} totalSteps={7}>
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        {status === 'intro' && (
          <div className="text-center max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Remember these words.</h1>
            <p className="text-xl text-muted mb-12 leading-relaxed">
              You will see a list of words, one at a time. Read them silently and try to remember as many as you can. We will ask you to recall them later.
            </p>
            <Button variant="primary" size="patient" onClick={() => setStatus('playing')}>
              Show Words
            </Button>
          </div>
        )}

        {status === 'playing' && wordIndex < WORDS.length && (
          <div className="flex items-center justify-center bg-white w-full max-w-4xl h-80 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-[120px] font-display font-black tracking-tighter text-ink uppercase">
              {WORDS[wordIndex]}
            </h2>
          </div>
        )}

        {status === 'done' && (
          <div className="text-center max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-200">
            <h1 className="text-4xl font-bold mb-8">Great job.</h1>
            <p className="text-xl text-muted mb-12">
              Keep those words in mind for later. Let's move to the next task.
            </p>
            <Button variant="primary" size="patient" onClick={() => setStep('fluency')}>
              Next Task
            </Button>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
