import React, { useState } from 'react';
import { Button } from '../ui';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useNavigate } from 'react-router-dom';

interface ContextPanelProps {
  session: any;
}

export function ContextPanel({ session }: ContextPanelProps) {
  const [reviewed, setReviewed] = useState(false);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const handleSignOff = () => {
    // In reality this would PUT/PATCH the status to the backend
    navigate('/clinic');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-1">Patient Context</h2>
        <div className="text-sm text-muted">Pseudonymised session ID: {session.id}</div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Narrative Summary</h3>
          <p className="text-sm leading-relaxed">
            The patient shows elevated risk primarily driven by speech pausing and simplified syntax during the picture description task. Cognitive scores were borderline, with delayed recall falling below age-matched expectations.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Recommended Next Step</h3>
          <div className="bg-sand p-4 rounded-lg border border-gray-200 text-sm font-bold">
            Referral for comprehensive neuropsychological assessment.
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Clinician Notes</h3>
          <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink min-h-[120px] resize-none"
            placeholder="Add contextual notes before sign-off..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <label className="flex items-start cursor-pointer group mb-6">
          <Checkbox.Root 
            className="flex-shrink-0 w-6 h-6 border-2 border-gray-400 rounded bg-white flex items-center justify-center group-hover:border-ink data-[state=checked]:bg-ink data-[state=checked]:border-ink focus:outline-none focus:ring-2 focus:ring-lime mr-3 mt-0.5"
            checked={reviewed}
            onCheckedChange={(c) => setReviewed(c === true)}
          >
            <Checkbox.Indicator className="text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Root>
          <div className="text-sm font-medium">
            I reviewed the explanation and flags for this screening.
          </div>
        </label>
        
        <div className="flex gap-3">
          <Button 
            variant="primary" 
            className="flex-1" 
            disabled={!reviewed}
            onClick={handleSignOff}
          >
            Sign off
          </Button>
          <Button variant="secondary" className="px-4">
            Export ▾
          </Button>
        </div>
      </div>
    </div>
  );
}
