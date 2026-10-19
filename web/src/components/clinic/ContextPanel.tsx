import React, { useState } from 'react';
import { Button } from '../ui';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useNavigate } from 'react-router-dom';
import { useClinicQueueStore } from '../../state/clinicQueueStore';
import { useAuthStore } from '../../state/authStore';

interface ContextPanelProps {
  session: any;
}

export function ContextPanel({ session }: ContextPanelProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { signOffSession, setActiveTab } = useClinicQueueStore();

  const isAlreadyReviewed = session.review_status === 'Reviewed';
  const [reviewed, setReviewed] = useState(isAlreadyReviewed);
  const [notes, setNotes] = useState(session.clinician_notes || '');
  const [showExportModal, setShowExportModal] = useState(false);

  const handleSignOff = () => {
    const doctorName = user?.name || 'Dr. Priya Sharma';
    signOffSession(session.id, notes, doctorName);
    setActiveTab('reviewed');
    navigate('/clinic');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold">Patient Context</h2>
            {isAlreadyReviewed && (
              <span className="text-[11px] font-mono font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">
                Reviewed
              </span>
            )}
          </div>
          <div className="text-sm text-muted">Pseudonymised session ID: {session.id}</div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Narrative Summary</h3>
            <p className="text-sm leading-relaxed text-ink/90">
              {session.narrative_summary || (
                session.risk_tier === 'High'
                  ? 'High probability of cognitive decline. Notable word-finding latency with pauses >3s, reduced concept coverage, and pronounced delayed recall deficit.'
                  : session.risk_tier === 'Elevated'
                  ? 'The patient shows elevated risk primarily driven by speech pausing and simplified syntax during picture description. Cognitive scores were borderline.'
                  : session.risk_tier === 'Indeterminate'
                  ? 'Scores fall within indeterminate confidence interval. Acoustic background flags suggest repeating the screen in a quiet environment.'
                  : 'All linguistic, acoustic, and cognitive performance indices fall within age- and education-adjusted norms. Speech syntax is intact and fluent.'
              )}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Recommended Next Step</h3>
            <div className="bg-sand p-4 rounded-lg border border-gray-200 text-sm font-bold text-ink">
              {session.recommended_next_step || 'Referral for comprehensive neuropsychological assessment.'}
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
            {session.reviewed_at && (
              <div className="text-[11px] text-muted mt-1.5 font-mono">
                Last reviewed: {session.reviewed_at}
              </div>
            )}
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
              {isAlreadyReviewed ? 'Update sign-off' : 'Sign off'}
            </Button>
            <Button 
              variant="secondary" 
              className="px-4"
              onClick={() => setShowExportModal(true)}
            >
              Export ▾
            </Button>
          </div>
        </div>
      </div>

      {/* Export Clinical Summary Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted">Clinical Screening Summary</div>
                <h2 className="text-2xl font-bold text-ink">Session {session.id}</h2>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-ink text-xl font-bold p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Compliance Notice */}
              <div className="bg-sand/40 border border-sand p-3 rounded-lg text-ink">
                <strong>Rule 7 Compliance Notice:</strong> CogniSense is a preliminary screening aid, not a medical diagnosis. Results must be interpreted in conjunction with full physician workup.
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl">
                <div>
                  <span className="text-muted block">Age Cohort</span>
                  <span className="font-bold text-ink text-sm">{session.patient.age_band}</span>
                </div>
                <div>
                  <span className="text-muted block">Formal Education</span>
                  <span className="font-bold text-ink text-sm">{session.patient.education_years} Years</span>
                </div>
                <div>
                  <span className="text-muted block">Screening Device</span>
                  <span className="font-bold text-ink text-sm">{session.patient.device || 'Tablet'}</span>
                </div>
                <div>
                  <span className="text-muted block">Risk Tier</span>
                  <span className="font-bold text-ink text-sm">{session.risk_tier}</span>
                </div>
              </div>

              {/* Multimodal Probability */}
              <div className="border border-gray-200 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-ink">Multimodal Deterioration Risk Probability</span>
                  <span className="font-mono font-bold text-lg">{session.probability.toFixed(2)}</span>
                </div>
                <div className="text-muted text-[11px] mb-2 font-mono">
                  95% Confidence Interval: [{session.probability_ci[0].toFixed(2)}, {session.probability_ci[1].toFixed(2)}]
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-[11px]">
                  <div>Speech Modality Score: <span className="font-mono font-bold">{session.speech_score.toFixed(2)}</span></div>
                  <div>Cognitive Battery Score: <span className="font-mono font-bold">{session.cognitive_score.toFixed(2)}</span></div>
                </div>
              </div>

              {/* Key Features */}
              <div className="border border-gray-200 p-4 rounded-xl">
                <h4 className="font-bold text-ink mb-2">Top Multimodal Contributors (SHAP)</h4>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {session.features?.slice(0, 5).map((f: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-muted">{f.name}</span>
                      <span className={f.contribution > 0 ? 'text-red-700 font-bold' : 'text-green-700 font-bold'}>
                        {f.contribution > 0 ? '+' : ''}{f.contribution.toFixed(3)} (Val: {f.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinician Notes */}
              <div className="border border-gray-200 p-4 rounded-xl">
                <h4 className="font-bold text-ink mb-1">Attending Clinician Review</h4>
                <p className="text-muted italic">{notes || 'No contextual notes recorded.'}</p>
                <div className="mt-2 text-[10px] text-gray-400 font-mono">
                  Sign-off status: {session.review_status} • Reviewer: {user?.name || 'Dr. Priya Sharma'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handlePrint}>
                🖨️ Print / Save as PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
