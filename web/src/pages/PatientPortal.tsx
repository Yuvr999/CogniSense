import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { useScreeningStore } from '../state/sessionStore';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { getPatientTestRecords, type ClinicalSessionResult } from '../api/sessionRepository';

export function PatientPortal() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { step, reset, hasCompletedScreening, completedSessionId, sessionId } = useScreeningStore();
  const [recordedRecords, setRecordedRecords] = useState<ClinicalSessionResult[]>([]);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'patient');
    // Load all tests recorded for this patient
    const records = getPatientTestRecords(user?.id);
    setRecordedRecords(records);
    return () => document.documentElement.removeAttribute('data-mode');
  }, [user?.id, hasCompletedScreening, step]);

  const handleLogout = () => {
    logout();
    navigate('/login/patient', { replace: true });
  };

  const handleStartScreening = () => {
    reset(false);
    navigate('/screen');
  };

  const hasAnyCompletedTests = recordedRecords.length > 0 || hasCompletedScreening || step === 'done';
  const activeToken = completedSessionId || sessionId || (recordedRecords[0]?.id);

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between">
      {/* Patient Header */}
      <header className="bg-cream border-b-2 border-ink/15 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="font-display font-black text-2xl text-ink hover:opacity-80 transition-opacity">
            CogniSense
          </Link>
          <span className="hidden sm:inline-block text-xs font-bold bg-lime text-ink px-3 py-1 rounded-full border border-ink/20">
            Patient Portal
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher size="sm" />
          
          <div className="flex items-center gap-2 bg-paper border border-ink/20 px-3 py-1.5 rounded-full text-xs font-bold text-ink">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{user?.name || 'Patient'}</span>
            {user?.patientAge && <span className="text-muted">({user.patientAge}y)</span>}
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-ink border border-ink/30 px-3 py-1.5 rounded-full hover:bg-ink hover:text-paper transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Welcome Banner */}
        <section className="bg-sand/30 border-2 border-ink rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-0.5 bg-paper rounded-full text-xs font-bold text-ink uppercase tracking-wider mb-2 border border-ink/15">
              Personalized Patient Hub
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
              Welcome, {user?.name || 'Friend'}
            </h1>
            <p className="text-base sm:text-lg text-muted mt-2 max-w-xl">
              Track your cognitive well-being with comfortable speech and memory activities. Quick, accessible, and completely private.
            </p>
          </div>

          <div className="bg-paper border-2 border-ink/20 p-4 rounded-2xl text-xs space-y-1.5 max-w-xs flex-shrink-0">
            <div className="font-bold text-ink flex items-center gap-1.5">
              <span>🛡️</span> Screening Aid Notice
            </div>
            <p className="text-muted leading-relaxed">
              CogniSense is a screening aid, not a diagnosis. Results are designed to be reviewed with your doctor.
            </p>
          </div>
        </section>

        {/* Section: Recorded Tests & Screening History */}
        {hasAnyCompletedTests && (
          <section className="bg-white border-3 border-ink rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-float)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  ✓ Recorded Tests
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-ink">
                  My Completed Screening Tests
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  Tests given by you are recorded here and synchronized with the doctor clinic queue.
                </p>
              </div>

              <button
                onClick={handleStartScreening}
                className="py-2.5 px-5 bg-ink text-paper rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all flex items-center gap-2 self-stretch sm:self-auto justify-center"
              >
                <span>Take Another Screening</span>
                <span className="text-lime font-mono">→</span>
              </button>
            </div>

            <div className="space-y-4">
              {recordedRecords.map((rec) => {
                const isExpanded = expandedTestId === rec.id;
                const isReviewed = rec.review_status === 'Reviewed';
                const resp = rec.patient_responses;

                return (
                  <div 
                    key={rec.id}
                    className="border-2 border-ink/20 rounded-2xl p-5 bg-gray-50/70 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      {/* Left info */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm bg-ink text-paper px-2.5 py-0.5 rounded">
                            Token: {rec.id}
                          </span>
                          <span className="text-xs text-muted font-medium">
                            {rec.completed_at || 'Recorded Today'}
                          </span>
                          <span className="text-xs bg-gray-200 text-ink px-2 py-0.5 rounded font-mono">
                            {rec.patient.age_band}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 pt-1">
                          {isReviewed ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                              <span>Reviewed by Doctor {rec.reviewed_by ? `(${rec.reviewed_by})` : ''}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                              <span>Pending Doctor Review (Transmitted to Clinic Queue)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right action button */}
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => setExpandedTestId(isExpanded ? null : rec.id)}
                          className="px-4 py-2 bg-paper border border-ink/30 text-ink rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-between w-full md:w-auto gap-2"
                        >
                          <span>{isExpanded ? 'Hide Test Responses ▲' : 'View Submitted Responses ▼'}</span>
                        </button>
                      </div>

                    </div>

                    {/* Clinician Notes Box (if reviewed) */}
                    {isReviewed && rec.clinician_notes && (
                      <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950">
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-900">
                          <span>🩺</span> Doctor&apos;s Review Notes:
                        </div>
                        <p className="italic leading-relaxed">{rec.clinician_notes}</p>
                        {rec.reviewed_at && (
                          <div className="text-[10px] text-emerald-700 mt-1 font-mono">
                            Signed off: {rec.reviewed_at}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expandable test responses */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <div className="font-bold text-ink mb-1 flex items-center gap-1">
                            <span>🎙️</span> Picture Story
                          </div>
                          <div className="text-muted text-[11px] mb-1">{resp?.scene_title || 'Kitchen Scene'}</div>
                          <div className="font-mono text-emerald-700 font-bold">{resp?.speech_duration_sec || rec.speech_duration}s recorded</div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <div className="font-bold text-ink mb-1 flex items-center gap-1">
                            <span>🧠</span> Delayed Recall
                          </div>
                          <div className="font-mono text-ink font-bold mb-1">
                            {resp ? `${resp.recalled_matched_count} of 10 words` : 'Recorded'}
                          </div>
                          <div className="text-[11px] text-muted italic truncate" title={resp?.recall_raw_text}>
                            &ldquo;{resp?.recall_raw_text || 'Submitted'}&rdquo;
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <div className="font-bold text-ink mb-1 flex items-center gap-1">
                            <span>🐾</span> Animal Fluency
                          </div>
                          <div className="font-mono text-ink font-bold mb-1">
                            {resp ? `${resp.fluency_word_count} animals named` : 'Recorded'}
                          </div>
                          <div className="text-[11px] text-muted italic truncate" title={resp?.fluency_raw_text}>
                            &ldquo;{resp?.fluency_raw_text || 'Submitted'}&rdquo;
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <div className="font-bold text-ink mb-1 flex items-center gap-1">
                            <span>✏️</span> Connect Dots
                          </div>
                          <div className="font-mono text-emerald-700 font-bold mb-1">
                            {resp?.trace_completed ? '✓ Completed' : 'Completed'}
                          </div>
                          <div className="text-[11px] text-muted">1-A-2-B-3-C path</div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Feature Section: When NOT completed, ONLY show Cognitive Screening */}
        {!hasAnyCompletedTests && (
          <div className="bg-cream border-3 border-ink rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-float)] relative overflow-hidden group">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <span className="w-14 h-14 rounded-2xl bg-lime border-2 border-ink flex items-center justify-center text-3xl shadow-sm">
                  ⏱️
                </span>
                <span className="text-xs font-mono font-bold bg-ink text-paper px-3 py-1.5 rounded-full tracking-wide">
                  8 MINUTES · 4 EXERCISES
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-ink mb-3">
                Cognitive Screening
              </h2>
              <p className="text-base sm:text-lg text-muted mb-8 max-w-2xl leading-relaxed">
                A series of short, gentle exercises: describe an everyday kitchen scene, remember a few simple words, name items in a category, and connect numbered points.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 p-3.5 bg-paper rounded-2xl border border-ink/15 text-sm font-semibold text-ink">
                  <span className="w-7 h-7 rounded-xl bg-lime/40 border border-ink/20 flex items-center justify-center text-xs font-mono font-bold">1</span>
                  <span>Picture Story & Voice Description</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-paper rounded-2xl border border-ink/15 text-sm font-semibold text-ink">
                  <span className="w-7 h-7 rounded-xl bg-lime/40 border border-ink/20 flex items-center justify-center text-xs font-mono font-bold">2</span>
                  <span>Word Recall & Attention</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-paper rounded-2xl border border-ink/15 text-sm font-semibold text-ink">
                  <span className="w-7 h-7 rounded-xl bg-lime/40 border border-ink/20 flex items-center justify-center text-xs font-mono font-bold">3</span>
                  <span>Animal Category Fluency</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-paper rounded-2xl border border-ink/15 text-sm font-semibold text-ink">
                  <span className="w-7 h-7 rounded-xl bg-lime/40 border border-ink/20 flex items-center justify-center text-xs font-mono font-bold">4</span>
                  <span>Connecting Dot Paths</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleStartScreening}
                  className="py-4 px-8 bg-ink text-paper rounded-2xl font-bold text-lg hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-lime shadow-md transition-all flex items-center justify-center gap-3"
                >
                  <span>Start My Screening Now</span>
                  <span className="text-lime font-mono text-xl">→</span>
                </button>
                <div className="text-xs text-muted flex items-center gap-2">
                  <span>💡</span>
                  <span>Find a quiet room with microphone enabled. Screening aid, not a diagnosis.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Grid: Memory Clinics in Pune Card */}
        <div className="bg-sand/30 border-3 border-ink rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏥</span>
              <span className="text-xs font-mono font-bold bg-sky text-ink px-2.5 py-0.5 rounded-full">
                PUNE DIRECTORY
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
              Memory Clinics & Doctors in Pune
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-xl">
              Explore accredited memory clinics, geriatric specialists, and tertiary neurology hospitals across Pune for comprehensive evaluations.
            </p>
          </div>

          <Link
            to="/clinics"
            className="py-3.5 px-6 bg-ink text-paper rounded-2xl font-bold text-base hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-lime shadow-md transition-all flex items-center justify-center gap-3 flex-shrink-0"
          >
            <span>Explore Clinics on Map</span>
            <span className="text-lime font-mono text-xl">→</span>
          </Link>
        </div>

        {/* Status & Privacy Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Box */}
          <div className="bg-paper border-2 border-ink/30 rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
              <span>📋</span> Current Screening Status
            </h3>
            {hasAnyCompletedTests ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold space-y-1">
                <div>✓ Screening completed successfully {activeToken ? `(Token: ${activeToken})` : ''}.</div>
                <div className="text-[11px] text-emerald-700">Data summarized for clinician review. Remember: screening aid, not a diagnosis.</div>
              </div>
            ) : (
              <p className="text-sm text-muted">
                No active screening recorded today. Click &quot;Start My Screening Now&quot; whenever you are ready in a quiet room.
              </p>
            )}
          </div>

          {/* Privacy Box */}
          <div className="bg-paper border-2 border-ink/30 rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
              <span>🔒</span> On-Device Privacy Commitment
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Your voice recordings and spoken answers are processed 100% on this device using local whisper speech recognition. We never transmit or sell raw audio.
            </p>
          </div>
        </div>

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
