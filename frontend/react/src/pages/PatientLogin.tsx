import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, DEMO_PATIENTS } from '../state/authStore';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function PatientLogin() {
  const navigate = useNavigate();
  const { user, loginPatient } = useAuthStore();

  const [name, setName] = useState('Anita Deshmukh');
  const [phone, setPhone] = useState('+91 98220 12345');
  const [age, setAge] = useState<number>(72);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'patient');
    // If already logged in as patient, redirect to patient portal
    if (user && user.role === 'patient') {
      navigate('/patient', { replace: true });
    }
    return () => document.documentElement.removeAttribute('data-mode');
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    loginPatient({
      name: name.trim(),
      phone: phone.trim(),
      patientAge: Number(age) || 70,
    });
    navigate('/patient', { replace: true });
  };

  const handleQuickDemo = (demoPatient: typeof DEMO_PATIENTS[0]) => {
    loginPatient(demoPatient);
    navigate('/patient', { replace: true });
  };

  const handleGuestEntry = () => {
    loginPatient({
      name: 'Guest Participant',
      phone: '',
      patientAge: 68,
    });
    navigate('/patient', { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between">
      {/* Patient Friendly Top Bar */}
      <header className="bg-cream border-b-2 border-ink/15 h-20 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="font-display font-black text-2xl text-ink hover:opacity-80 transition-opacity">
            CogniSense
          </Link>
          <span className="text-sm font-bold bg-lavender/30 text-ink px-3 py-1 rounded-full border border-lavender">
            Patient Portal
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher size="md" />
          <Link 
            to="/" 
            className="text-base font-bold text-ink underline decoration-2 underline-offset-4 hover:opacity-75"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Main Patient Sign-In Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 my-4">
        <div className="w-full max-w-xl bg-paper border-3 border-ink rounded-3xl shadow-[var(--shadow-float)] p-6 sm:p-10">
          
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-lime text-ink font-bold text-sm rounded-full mb-3 border border-ink/20">
              Welcome
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-ink leading-tight">
              Patient & Family Sign In
            </h1>
            <p className="text-base sm:text-lg text-muted mt-3">
              Access your personalized cognitive health check, view Pune clinic recommendations, and track your screening results.
            </p>
          </div>

          {/* Quick Demo Selection */}
          <div className="mb-8 p-4 bg-cream/70 rounded-2xl border-2 border-ink/20">
            <p className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <span>👤</span> Choose a demo profile or sign in below:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PATIENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickDemo(p)}
                  className="p-3 bg-paper hover:bg-lime/20 border-2 border-ink/30 rounded-xl text-left transition-colors font-medium flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-base text-ink">{p.name}</div>
                    <div className="text-xs text-muted">Age {p.patientAge} • Pune</div>
                  </div>
                  <span className="text-ink font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              ))}
            </div>
            <div className="mt-2.5 text-center">
              <button
                type="button"
                onClick={handleGuestEntry}
                className="text-sm font-bold text-ink underline hover:text-muted"
              >
                Or enter quickly as a Guest Participant →
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-400 text-red-900 rounded-xl font-bold text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-ink mb-2" htmlFor="patient-name">
                Your Full Name
              </label>
              <input
                id="patient-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anita Deshmukh"
                required
                className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-xl text-base font-bold text-ink focus:outline-none focus:ring-4 focus:ring-lime"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-2" htmlFor="patient-phone">
                  Mobile Number (Optional)
                </label>
                <input
                  id="patient-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-xl text-base font-medium text-ink focus:outline-none focus:ring-4 focus:ring-lime"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2" htmlFor="patient-age">
                  Age
                </label>
                <input
                  id="patient-age"
                  type="number"
                  min="40"
                  max="105"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-xl text-base font-bold text-ink focus:outline-none focus:ring-4 focus:ring-lime"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-ink text-paper rounded-2xl font-bold text-lg hover:bg-muted focus:outline-none focus:ring-4 focus:ring-lime shadow-md transition-transform active:scale-98 flex items-center justify-center gap-3"
            >
              <span>Continue to Patient Portal</span>
              <span className="text-lime font-mono text-xl">→</span>
            </button>
          </form>

          {/* Privacy note */}
          <div className="mt-8 p-4 bg-sky/20 rounded-2xl border border-sky/40 flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div className="text-xs text-ink leading-relaxed">
              <strong>Your privacy is protected:</strong> Audio from voice exercises is processed locally on your device. We do not store or transmit raw voice recordings to cloud servers.
            </div>
          </div>

          {/* Switch to Clinic Doctor Login */}
          <div className="mt-6 pt-5 border-t-2 border-ink/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
            <span>Are you a doctor or clinical staff?</span>
            <Link
              to="/login/clinic"
              className="font-bold text-ink underline underline-offset-4 hover:opacity-80"
            >
              Doctor & Admin Sign In →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="py-4 text-center text-xs text-muted px-4 border-t border-ink/10">
        <p className="font-bold text-ink">
          Important: CogniSense is a screening aid, not a diagnosis.
        </p>
        <p className="text-[12px] text-muted mt-1">
          Always consult a qualified neurologist or physician for clinical evaluation.
        </p>
      </footer>
    </div>
  );
}
