import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';
import { useAuthStore } from '../../state/authStore';
import { useClinicQueueStore } from '../../state/clinicQueueStore';
import { evaluateAndRegisterScreening } from '../../api/sessionRepository';
import { ClinicFinderView } from '../clinicFinder';

export function Done() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    profile, 
    reset, 
    sessionId, 
    setSessionId, 
    setHasCompletedScreening,
    speechDuration,
    speechScene,
    fluencyText,
    traceData,
    recallText,
    audioBlob
  } = useScreeningStore();
  const { addSession } = useClinicQueueStore();
  const [uploading, setUploading] = useState(true);
  const registeredRef = useRef(false);

  // Generate or reuse session ID
  const activeSessionId = useRef(
    sessionId || `PT-${Math.floor(1000 + Math.random() * 9000)}`
  ).current;

  useEffect(() => {
    if (!sessionId) {
      setSessionId(activeSessionId);
    }

    if (!registeredRef.current) {
      registeredRef.current = true;
      const patientAge = profile.age || user?.patientAge || 72;
      
      // Real multimodal evaluation based on the actual answers given by the patient
      const fullResult = evaluateAndRegisterScreening({
        sessionId: activeSessionId,
        patientName: user?.name || 'Anita Deshmukh',
        patientId: user?.id || 'PT-0001',
        age: patientAge,
        educationYears: profile.educationYears || 14,
        language: i18n.language || 'en',
        speechDuration: speechDuration || 25,
        speechScene: speechScene || 'The Cookie Theft Kitchen Scene',
        fluencyText: fluencyText || '',
        traceClicks: traceData || [],
        recallText: recallText || '',
        audioBlob
      });

      // Register session in clinician queue
      const now = new Date();
      const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      addSession({
        id: activeSessionId,
        patientName: fullResult.patient.name,
        patientId: fullResult.patient.patient_id,
        date: formattedDate,
        age: fullResult.patient.age_band,
        tier: fullResult.risk_tier,
        p: fullResult.probability,
        mods: 'Speech, Cog, Motor',
        qc: fullResult.data_quality.flags.length,
        status: 'Needs review'
      });

      // Mark screening as completed in sessionStore
      setHasCompletedScreening(true, activeSessionId);
    }

    // Simulate upload delay
    const timer = setTimeout(() => {
      setUploading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [
    activeSessionId, 
    profile, 
    user, 
    sessionId, 
    setSessionId, 
    addSession, 
    setHasCompletedScreening,
    speechDuration,
    speechScene,
    fluencyText,
    traceData,
    recallText,
    audioBlob,
    i18n.language
  ]);

  const handleReturnToPortal = () => {
    navigate('/patient');
  };

  const handleRestart = () => {
    reset(false);
    navigate('/screen');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between pb-16">
      {/* Top Patient Header */}
      <header className="bg-cream border-b-2 border-ink/15 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/patient" className="font-display font-black text-2xl text-ink hover:opacity-80 transition-opacity">
            CogniSense
          </Link>
          <span className="hidden sm:inline-block text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
            Screening Completed
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleReturnToPortal}
            className="text-xs font-bold text-ink bg-paper border border-ink/20 px-4 py-2 rounded-full hover:bg-ink hover:text-paper transition-colors"
          >
            ← Patient Portal
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {uploading ? (
          <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center my-16">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-6 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-6 border-ink rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">{t('done.savingTitle')}</h1>
            <p className="text-base text-muted">{t('done.savingSub')}</p>
          </div>
        ) : (
          <>
            {/* Completion Hero Banner */}
            <section className="bg-white border-2 border-ink/20 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>✓</span>
                      <span>Tasks Successfully Recorded</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-display font-black text-ink mb-2">
                      {t('done.allDoneTitle')}
                    </h1>
                    <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
                      {t('done.allDoneSub')}
                    </p>
                  </div>
                </div>

                {/* Screening Token & Notice */}
                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                  <div className="inline-flex items-center gap-2 bg-cream border border-ink/20 px-4 py-2 rounded-2xl text-xs font-mono shadow-xs">
                    <span className="text-muted">Token:</span>
                    <strong className="text-ink text-sm">{activeSessionId}</strong>
                    <span className="text-emerald-700 font-bold ml-1">✓ Sent to Doctor Queue</span>
                  </div>

                  <div className="bg-sand/30 border border-sand px-3 py-1.5 rounded-xl text-[11px] text-muted max-w-xs">
                    🛡️ Screening aid, not a diagnosis. Results are ready for clinician review.
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="mt-6 pt-6 border-t border-ink/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="clinic" onClick={handleReturnToPortal}>
                    ← Return to Patient Portal
                  </Button>
                  <Button variant="primary" size="clinic" onClick={handleRestart}>
                    Take Another Screening
                  </Button>
                </div>

                <button
                  onClick={() => navigate('/clinic')}
                  className="text-xs font-bold text-muted hover:text-ink underline underline-offset-4"
                >
                  Inspect in Doctor Queue (Clinician Preview) →
                </button>
              </div>
            </section>

            {/* Map Section Page: Pune Memory Clinics & Doctors */}
            <section className="bg-sand/15 border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-sm">
              <ClinicFinderView
                title="Recommended Next Step: Memory & Neurology Clinics"
                subtitle="Now that your screening is done, explore verified memory disorder clinics, geriatric OPDs, and neurologists in Pune for a comprehensive clinical review."
                badge="Post-Screening Care Network · Pune"
                showHeader={true}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted px-4 border-t border-ink/10">
        <p className="font-semibold text-ink">
          CogniSense is a screening aid, not a diagnosis.
        </p>
      </footer>
    </div>
  );
}
