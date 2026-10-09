import React, { useEffect } from 'react';
import { useScreeningStore } from '../state/sessionStore';
import { 
  Consent, 
  Profile, 
  MicCheck, 
  SpeechTask, 
  RememberTask, 
  FluencyTask, 
  TraceTask, 
  RecallTask, 
  Done 
} from '../components/patient';

export function Screen() {
  const { step, setStep } = useScreeningStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'patient');
    // Start at consent if idle
    if (step === 'idle') {
      setStep('consent');
    }
    return () => document.documentElement.removeAttribute('data-mode');
  }, [step, setStep]);

  const renderStep = () => {
    switch (step) {
      case 'consent': return <Consent />;
      case 'profile': return <Profile />;
      case 'micCheck': return <MicCheck />;
      case 'speech': return <SpeechTask />;
      case 'remember': return <RememberTask />;
      case 'fluency': return <FluencyTask />;
      case 'trace': return <TraceTask />;
      case 'recall': return <RecallTask />;
      case 'done': return <Done />;
      default: return <Consent />;
    }
  };

  return (
    <>
      {renderStep()}
    </>
  );
}
