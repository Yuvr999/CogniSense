import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, DEMO_CLINICIANS } from '../state/authStore';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

const CLINIC_OPTIONS = [
  'Ruby Hall Clinic - Neuro Sciences (Pune)',
  'KEM Hospital Memory Care Unit (Pune)',
  'Deenanath Mangeshkar Hospital - Geriatric Clinic (Pune)',
  'Jehangir Hospital Memory & Cognitive Disorders Unit (Pune)',
  'Pune Memory & Aging Research Center',
];

export function ClinicLogin() {
  const navigate = useNavigate();
  const { user, loginClinician } = useAuthStore();

  const [email, setEmail] = useState('priya.sharma@rubyhall.org');
  const [password, setPassword] = useState('••••••••••••');
  const [clinic, setClinic] = useState(CLINIC_OPTIONS[0]);
  const [licenseNumber, setLicenseNumber] = useState('MCI-PN-48291');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'clinic');
    // If already logged in as clinician/admin, redirect to clinician portal
    if (user && (user.role === 'clinician' || user.role === 'admin')) {
      navigate('/clinic', { replace: true });
    }
    return () => document.documentElement.removeAttribute('data-mode');
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your medical email or clinician ID.');
      return;
    }
    loginClinician({
      email,
      name: email.includes('mehta') ? 'Dr. Rahul Mehta' : 'Dr. Priya Sharma',
      role: email.includes('admin') ? 'admin' : 'clinician',
      clinicName: clinic,
      licenseNumber: licenseNumber || 'MCI-PN-48291',
    });
    navigate('/clinic', { replace: true });
  };

  const handleQuickDemo = (demoDoctor: typeof DEMO_CLINICIANS[0]) => {
    loginClinician(demoDoctor);
    navigate('/clinic', { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between">
      {/* Clinician Top Bar */}
      <header className="bg-ink text-paper h-16 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Link to="/" className="font-display font-bold text-xl hover:text-lime transition-colors">
            CogniSense
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-xs font-mono uppercase tracking-widest text-lime bg-ink px-2 py-0.5 border border-lime/30 rounded">
            Clinician & Admin Portal
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher size="sm" />
          <Link 
            to="/" 
            className="text-xs font-semibold text-gray-300 hover:text-paper transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-cream border-2 border-ink rounded-2xl shadow-[var(--shadow-float)] p-6 sm:p-8">
          
          {/* Header Badge & Title */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink text-paper text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-lime inline-block animate-pulse"></span>
              CLINICAL PORTAL ACCESS
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight">
              Clinician Sign In
            </h1>
            <p className="text-sm text-muted mt-2">
              Secure clinical workspace for cognitive screening review, patient queue triage, and CogniTwin multimodal telemetry.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3.5 bg-paper rounded-xl border border-ink/20">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              ⚡ Instant Demo Access:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              {DEMO_CLINICIANS.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleQuickDemo(doc)}
                  className="flex-1 text-left px-3 py-2 bg-cream hover:bg-lime/20 border border-ink/30 rounded-lg text-xs font-semibold text-ink transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold">{doc.name}</div>
                    <div className="text-[10px] text-muted">{doc.role === 'admin' ? 'Clinic Administrator' : 'Lead Neurologist'}</div>
                  </div>
                  <span className="text-muted group-hover:text-ink font-mono">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-800 text-xs rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5" htmlFor="clinic-select">
                Affiliated Clinic / Center
              </label>
              <select
                id="clinic-select"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                className="w-full px-3 py-2.5 bg-paper border border-ink rounded-lg text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-ink"
              >
                {CLINIC_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5" htmlFor="doctor-email">
                Medical Email / Clinician ID
              </label>
              <input
                id="doctor-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org or MCI ID"
                required
                className="w-full px-3 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5" htmlFor="license-no">
                  Medical Reg. No. (MCI)
                </label>
                <input
                  id="license-no"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. MCI-PN-48291"
                  className="w-full px-3 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5" htmlFor="doctor-password">
                  Password / Passkey
                </label>
                <input
                  id="doctor-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-ink text-paper rounded-xl font-bold text-sm hover:bg-muted focus:outline-none focus:ring-3 focus:ring-ink shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Clinician Portal</span>
              <span className="text-lime font-mono">→</span>
            </button>
          </form>

          {/* Separation Divider & Patient Portal Switcher */}
          <div className="mt-6 pt-5 border-t border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <span>Are you a patient or caregiver?</span>
            <Link
              to="/login/patient"
              className="font-bold text-ink hover:underline underline-offset-4 flex items-center gap-1"
            >
              <span>Go to Patient Login</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-4 text-center text-xs text-muted px-4 border-t border-ink/10">
        <p className="font-semibold">
          Strict Compliance Notice: CogniSense is a screening aid, not a diagnosis.
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Patient transcripts and speech telemetry are processed strictly in accordance with local privacy protocols.
        </p>
      </footer>
    </div>
  );
}
