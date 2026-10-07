import React, { useState } from 'react';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';
import * as Checkbox from '@radix-ui/react-checkbox';

function StepperInput({ label, value, onChange, min, max, hint }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number, hint?: string }) {
  return (
    <div className="flex flex-col mb-8">
      <label className="text-xl font-bold mb-2">{label}</label>
      {hint && <span className="text-xl text-muted mb-4">{hint}</span>}
      <div className="flex items-center gap-6">
        <button 
          className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold hover:bg-gray-300 disabled:opacity-50"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >−</button>
        <div className="text-4xl font-mono font-bold w-20 text-center">{value}</div>
        <button 
          className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold hover:bg-gray-300 disabled:opacity-50"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  );
}

export function Profile() {
  const { profile, setProfile, setStep } = useScreeningStore();
  const [age, setAge] = useState(profile.age || 70);
  const [edu, setEdu] = useState(profile.educationYears || 12);
  const [assisted, setAssisted] = useState(profile.assistedMode || false);

  const handleNext = () => {
    setProfile({ age, educationYears: edu, assistedMode: assisted });
    // Usually we would POST /v1/sessions here to create the session in the backend.
    setStep('micCheck');
  };

  return (
    <PatientLayout currentStep={2} totalSteps={7} title="A little about you" subtitle="This helps us compare your results fairly.">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        
        <StepperInput 
          label="How old are you?" 
          value={age} 
          onChange={setAge} 
          min={40} 
          max={110} 
        />
        
        <StepperInput 
          label="Years of education" 
          hint="For example, finishing high school is 12 years."
          value={edu} 
          onChange={setEdu} 
          min={0} 
          max={25} 
        />
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <label className="flex items-start cursor-pointer group">
            <Checkbox.Root 
              className="flex-shrink-0 w-10 h-10 border-4 border-gray-300 rounded-lg bg-white flex items-center justify-center group-hover:border-ink data-[state=checked]:bg-ink data-[state=checked]:border-ink focus:outline-none focus:ring-4 focus:ring-lime mr-6 mt-1"
              checked={assisted}
              onCheckedChange={(c) => setAssisted(c === true)}
            >
              <Checkbox.Indicator className="text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>
            <div className="text-xl pt-1">
              Someone is helping me use this tablet today.
            </div>
          </label>
        </div>
      </div>
      
      <div className="mt-12 flex gap-6">
        <Button variant="secondary" size="patient" onClick={() => setStep('consent')}>Back</Button>
        <Button variant="primary" size="patient" onClick={handleNext}>Next Step</Button>
      </div>
    </PatientLayout>
  );
}
