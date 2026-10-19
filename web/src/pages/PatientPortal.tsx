import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { useScreeningStore } from '../state/sessionStore';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function PatientPortal() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { step, reset } = useScreeningStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'patient');
    return () => document.documentElement.removeAttribute('data-mode');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login/patient', { replace: true });
  };

  const handleStartScreening = () => {
    reset();
    navigate('/screen');
  };

  const isCompleted = step === 'done';

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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: 8-Minute Screening */}
          <div className="bg-cream border-3 border-ink rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[var(--shadow-float)] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-2xl bg-lime border-2 border-ink flex items-center justify-center text-2xl shadow-sm">
                  ⏱️
                </span>
                <span className="text-xs font-mono font-bold bg-ink text-paper px-2.5 py-1 rounded-full">
                  8 MINUTES
                </span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
                Cognitive Screening
              </h2>
              <p className="text-sm sm:text-base text-muted mb-6">
                A series of short, gentle exercises: describe a kitchen scene, remember a few everyday words, and trace connect-the-dots.
              </p>

              <div className="space-y-2 mb-8 text-xs sm:text-sm font-semibold text-ink/80 bg-paper/80 p-3 rounded-xl border border-ink/15">
                <div className="flex items-center gap-2">✓ 1. Picture Story & Voice Description</div>
                <div className="flex items-center gap-2">✓ 2. Word Recall & Attention</div>
                <div className="flex items-center gap-2">✓ 3. Animal Category Fluency</div>
                <div className="flex items-center gap-2">✓ 4. Connecting Dot Paths</div>
              </div>
            </div>

            <button
              onClick={handleStartScreening}
              className="w-full py-4 px-6 bg-ink text-paper rounded-2xl font-bold text-base sm:text-lg hover:bg-muted focus:outline-none focus:ring-4 focus:ring-lime shadow-md transition-all flex items-center justify-center gap-3 relative z-10"
            >
              <span>{isCompleted ? 'Take Another Screening' : 'Start My Screening Now'}</span>
              <span className="text-lime font-mono text-xl">→</span>
            </button>
          </div>

          {/* Card 2: Find Clinics in Pune */}
          <div className="bg-paper border-3 border-ink rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-2xl bg-sky/30 border-2 border-ink flex items-center justify-center text-2xl shadow-sm">
                  🏥
                </span>
                <span className="text-xs font-mono font-bold bg-sky text-ink px-2.5 py-1 rounded-full">
                  PUNE DIRECTORY
                </span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
                Memory Clinics & Doctors
              </h2>
              <p className="text-sm sm:text-base text-muted mb-6">
                Find accredited memory clinics, geriatric specialists, and neurologist consultations across Pune for comprehensive evaluations.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 bg-cream/60 rounded-xl border border-ink/15 text-xs">
                  <div className="font-bold text-ink">Ruby Hall Clinic - Neuro Sciences</div>
                  <div className="text-muted">Sassoon Road, Pune • Memory Disorder Unit</div>
                </div>
                <div className="p-3 bg-cream/60 rounded-xl border border-ink/15 text-xs">
                  <div className="font-bold text-ink">KEM Hospital - Memory Care</div>
                  <div className="text-muted">Rasta Peth, Pune • Comprehensive Geriatrics</div>
                </div>
              </div>
            </div>

            <Link
              to="/clinics"
              className="w-full py-4 px-6 bg-paper border-2 border-ink text-ink rounded-2xl font-bold text-base sm:text-lg hover:bg-cream focus:outline-none focus:ring-4 focus:ring-lime shadow-sm transition-all flex items-center justify-center gap-3"
            >
              <span>Explore Pune Clinics</span>
              <span className="text-ink font-mono text-xl">→</span>
            </Link>
          </div>

        </div>

        {/* Status & Privacy Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Box */}
          <div className="bg-paper border-2 border-ink/30 rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
              <span>📋</span> Current Screening Status
            </h3>
            {isCompleted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold space-y-1">
                <div>✓ Screening completed successfully.</div>
                <div className="text-[11px] text-emerald-700">Data summarized for clinician review. Remember: screening aid, not a diagnosis.</div>
              </div>
            ) : (
              <p className="text-sm text-muted">
                No active screening recorded today. Click "Start My Screening Now" whenever you are ready in a quiet room.
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
