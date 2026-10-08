import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

export function RecallTask() {
  const { t } = useTranslation();
  const { setStep, saveRecall } = useScreeningStore();
  const [text, setText] = useState('');

  const handleNext = () => {
    saveRecall({ text });
    setStep('done');
  };

  return (
    <PatientLayout 
      currentStep={7} 
      totalSteps={7} 
      title={t('recall.title')}
      subtitle={t('recall.subtitle')}
    >
      <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto mt-4">
        <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
          <textarea 
            className="flex-1 w-full bg-paper rounded-2xl p-6 text-xl font-mono focus:outline-none focus:ring-4 focus:ring-lime resize-none min-h-[300px]"
            placeholder={t('recall.placeholder')}
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
        </div>

        <div className="w-full lg:w-80 flex flex-col items-center justify-center bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <Button variant="secondary" size="patient" onClick={handleNext} className="w-full mb-6 whitespace-normal">
            {t('recall.dontRememberMore')}
          </Button>
          <Button variant="primary" size="patient" onClick={handleNext} className="w-full">
            {t('common.finished')}
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
}
