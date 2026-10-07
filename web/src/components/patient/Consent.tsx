import React, { useState } from 'react';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';
import { PatientLayout } from './Layout';
import * as Checkbox from '@radix-ui/react-checkbox';

export function Consent() {
  const { setConsents, setStep } = useScreeningStore();
  const [screeningConsent, setScreeningConsent] = useState(false);
  const [researchConsent, setResearchConsent] = useState(false);

  const handleNext = () => {
    setConsents(screeningConsent, researchConsent);
    setStep('profile');
  };

  return (
    <PatientLayout currentStep={1} totalSteps={7} title="Welcome to the CogniSense screening">
      <div className="max-w-3xl space-y-8 text-lg text-ink leading-relaxed">
        <p>This screening takes about 8 minutes. We will ask you to describe a picture and do a few short memory and attention tasks.</p>
        
        <p><strong>Your privacy:</strong> Your voice recording is processed securely on this clinic's server and is deleted immediately after analysis. It is never sent to the cloud.</p>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-12 space-y-8">
          <label className="flex items-start cursor-pointer group">
            <Checkbox.Root 
              className="flex-shrink-0 w-8 h-8 border-4 border-gray-300 rounded-lg bg-white flex items-center justify-center group-hover:border-ink data-[state=checked]:bg-ink data-[state=checked]:border-ink focus:outline-none focus:ring-4 focus:ring-lime mr-4 mt-1"
              checked={screeningConsent}
              onCheckedChange={(c) => setScreeningConsent(c === true)}
              id="consent-screening"
            >
              <Checkbox.Indicator className="text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>
            <div className="text-lg pt-1">
              I agree to take this screening. I understand it is an aid for my clinician, not a medical diagnosis. <span className="text-muted text-base">(Required)</span>
            </div>
          </label>

          <label className="flex items-start cursor-pointer group">
            <Checkbox.Root 
              className="flex-shrink-0 w-8 h-8 border-4 border-gray-300 rounded-lg bg-white flex items-center justify-center group-hover:border-ink data-[state=checked]:bg-ink data-[state=checked]:border-ink focus:outline-none focus:ring-4 focus:ring-lime mr-4 mt-1"
              checked={researchConsent}
              onCheckedChange={(c) => setResearchConsent(c === true)}
              id="consent-research"
            >
              <Checkbox.Indicator className="text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>
            <div className="text-lg pt-1">
              I agree to let my anonymized results be used for future research to improve this tool. <span className="text-muted text-base">(Optional)</span>
            </div>
          </label>
        </div>
        
        <div className="pt-8">
          <Button 
            variant="primary" 
            size="patient" 
            disabled={!screeningConsent}
            onClick={handleNext}
          >
            Start Screening
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
}
