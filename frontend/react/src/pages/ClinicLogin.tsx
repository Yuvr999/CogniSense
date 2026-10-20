import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

const CLINIC_OPTIONS = [
  'Ruby Hall Clinic - Neuro Sciences (Pune)',
  'KEM Hospital Memory Care Unit (Pune)',
  'Deenanath Mangeshkar Hospital - Geriatric Clinic (Pune)',
  'Jehangir Hospital Memory & Cognitive Disorders Unit (Pune)',
  'Pune Memory & Aging Research Center',
];

// Registered hospital credential records
const REGISTERED_CREDENTIALS: Record<string, { name: string; license: string; passkeys: string[]; role: 'clinician' | 'admin'; clinic: string }> = {
  'priya.sharma@rubyhall.org': {
    name: 'Dr. Priya Sharma',
    license: 'MCI-PN-48291',
    passkeys: ['CogniSense#2026', 'Priya@2026', 'Doctor#2026'],
    role: 'clinician',
    clinic: 'Ruby Hall Clinic - Neuro Sciences (Pune)'
  },
  'admin.mehta@kem-pune.org': {
    name: 'Dr. Rahul Mehta',
    license: 'MCI-PN-19342',
    passkeys: ['CogniSense#2026', 'Admin@2026', 'Mehta#2026'],
    role: 'admin',
    clinic: 'KEM Hospital Memory Care Unit (Pune)'
  }
};

export function ClinicLogin() {
  const navigate = useNavigate();
  const { user, loginClinician, logout } = useAuthStore();

  const [doctorName, setDoctorName] = useState('Dr. Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@rubyhall.org');
  const [clinic, setClinic] = useState(CLINIC_OPTIONS[0]);
  const [licenseNumber, setLicenseNumber] = useState('MCI-PN-48291');
  const [password, setPassword] = useState('CogniSense#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'clinic');
    return () => document.documentElement.removeAttribute('data-mode');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanLicense = licenseNumber.trim().toUpperCase();
    const cleanName = doctorName.trim();

    if (!cleanEmail) {
      setError('Please provide your medical email or clinician ID.');
      return;
    }

    if (!cleanPassword) {
      setError('Password / passkey is required.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    // Validate MCI License format
    const mciRegex = /^MCI-[A-Z0-9]{2,4}-[0-9]{4,6}$/i;
    if (!cleanLicense.startsWith('MCI-') || cleanLicense.length < 7) {
      setError(`Invalid Medical Registration Number: "${cleanLicense}". Expected format: MCI-XX-XXXXX (e.g. MCI-PN-48291).`);
      return;
    }

    // Check against registered hospital accounts
    const knownAccount = REGISTERED_CREDENTIALS[cleanEmail];
    if (knownAccount) {
      // Validate Password
      const isPasswordValid = knownAccount.passkeys.includes(cleanPassword);
      if (!isPasswordValid) {
        setError(`Authentication failed: Incorrect password for ${cleanEmail}. Please enter the registered doctor passkey.`);
        return;
      }

      // Validate Registration Number
      if (cleanLicense !== knownAccount.license) {
        setError(`Registration Number mismatch: "${cleanLicense}" does not match the registered MCI license (${knownAccount.license}) for ${knownAccount.name}.`);
        return;
      }

      loginClinician({
        id: cleanEmail.includes('mehta') ? 'DR-02' : 'DR-01',
        email: cleanEmail,
        name: cleanName || knownAccount.name,
        role: knownAccount.role,
        clinicName: clinic,
        licenseNumber: cleanLicense,
      });
      navigate('/clinic', { replace: true });
      return;
    }

    // Custom clinician login
    let role: 'clinician' | 'admin' = 'clinician';
    if (cleanEmail.includes('admin')) {
      role = 'admin';
    }

    loginClinician({
      id: `DR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: cleanEmail,
      name: cleanName || (cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
      role,
      clinicName: clinic,
      licenseNumber: cleanLicense,
    });

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
            Clinician & Admin Sign In
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
        <div className="w-full max-w-xl bg-cream border-2 border-ink rounded-2xl shadow-[var(--shadow-float)] p-6 sm:p-8">
          
          {/* Active Session Notice if already logged in */}
          {user && (user.role === 'clinician' || user.role === 'admin') && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                <span className="text-emerald-900 font-bold">Currently Signed In:</span>
                <span className="font-bold text-ink ml-1.5">{user.name}</span>
                <span className="text-muted ml-1">({user.licenseNumber || 'MCI-PN-48291'})</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/clinic"
                  className="px-3 py-1.5 bg-ink text-paper rounded-lg font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1"
                >
                  <span>Go to Queue</span>
                  <span className="text-lime font-mono">→</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-2.5 py-1.5 border border-gray-300 text-muted hover:text-ink rounded-lg font-semibold bg-white cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

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
              Enter your verified Medical Council of India (MCI) credentials and hospital passkey to access patient screening triage.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-100 border-2 border-red-400 text-red-900 text-xs rounded-xl font-bold leading-relaxed">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5" htmlFor="doctor-name">
                Clinician Full Name
              </label>
              <input
                id="doctor-name"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Priya Sharma"
                required
                className="w-full px-3.5 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-bold focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5" htmlFor="clinic-select">
                Affiliated Clinic / Memory Center
              </label>
              <select
                id="clinic-select"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-paper border border-ink rounded-lg text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-ink"
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya.sharma@rubyhall.org"
                required
                className="w-full px-3.5 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-ink"
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
                  required
                  className="w-full px-3.5 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider" htmlFor="doctor-password">
                    Password / Passkey
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-muted hover:text-ink font-bold cursor-pointer"
                  >
                    {showPassword ? 'Hide 🔒' : 'Show 👁️'}
                  </button>
                </div>
                <input
                  id="doctor-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-paper border border-ink rounded-lg text-sm text-ink font-mono font-medium focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
            </div>

            {/* Credential Reference Box */}
            <div className="p-3 bg-paper rounded-xl border border-ink/20 text-[11px] text-muted space-y-1">
              <div className="font-bold text-ink">ℹ️ Registered Clinical Directory:</div>
              <div>• <strong>Dr. Priya Sharma</strong>: <code className="font-mono text-ink">priya.sharma@rubyhall.org</code> | Reg: <code className="font-mono text-ink">MCI-PN-48291</code></div>
              <div>• <strong>Dr. Rahul Mehta</strong>: <code className="font-mono text-ink">admin.mehta@kem-pune.org</code> | Reg: <code className="font-mono text-ink">MCI-PN-19342</code></div>
              <div>• Default Passkey: <code className="font-mono text-ink font-bold">CogniSense#2026</code> (Any other valid MCI number & 6+ char password also permitted).</div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 px-4 bg-ink text-paper rounded-xl font-bold text-sm hover:bg-neutral-800 focus:outline-none focus:ring-3 focus:ring-ink shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Clinician Portal</span>
              <span className="text-lime font-mono text-base">→</span>
            </button>
          </form>

          {/* Separation Divider & Patient Portal Switcher */}
          <div className="mt-6 pt-5 border-t border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <span>Are you a patient or family caregiver?</span>
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
