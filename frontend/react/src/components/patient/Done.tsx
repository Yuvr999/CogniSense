import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';
import { useAuthStore } from '../../state/authStore';
import { useClinicQueueStore } from '../../state/clinicQueueStore';
import { registerCompletedScreening, generateDynamicSession } from '../../api/sessionRepository';
import { PUNE_CLINICS } from '../../data/puneClinics';

export function Done() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'hi' | 'mr' | 'kn';
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile, reset, sessionId, setSessionId } = useScreeningStore();
  const { addSession } = useClinicQueueStore();
  const [uploading, setUploading] = useState(true);
  const registeredRef = useRef(false);

  // Generate or reuse session ID
  const activeSessionId = useRef(
    sessionId || `PT-${Math.floor(1000 + Math.random() * 9000)}`
  ).current;

  // Top recommended Pune memory clinic (Deenanath Mangeshkar Hospital)
  const topClinic = PUNE_CLINICS[0];
  const localizedClinicName = topClinic.name[lang] || topClinic.name.en;
  const localizedArea = topClinic.area[lang] || topClinic.area.en;

  useEffect(() => {
    if (!sessionId) {
      setSessionId(activeSessionId);
    }

    if (!registeredRef.current) {
      registeredRef.current = true;
      const patientAge = profile.age || user?.patientAge || 72;
      const ageBand = patientAge >= 80 ? '80-84' : patientAge >= 75 ? '75-79' : patientAge >= 70 ? '70-74' : '65-69';
      
      // Create session result in repository
      const fullResult = generateDynamicSession(activeSessionId);
      fullResult.patient.age_band = ageBand;
      fullResult.patient.education_years = profile.educationYears || 14;
      registerCompletedScreening(fullResult);

      // Register session in clinician queue
      const now = new Date();
      const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      addSession({
        id: activeSessionId,
        date: formattedDate,
        age: ageBand,
        tier: fullResult.risk_tier,
        p: fullResult.probability,
        mods: 'Speech, Cog',
        qc: fullResult.data_quality.flags.length,
        status: 'Needs review'
      });
    }

    // Simulate upload delay
    const timer = setTimeout(() => {
      setUploading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeSessionId, profile, user, sessionId, setSessionId, addSession]);

  const handleRestart = () => {
    reset();
    navigate('/patient');
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full bg-white p-8 md:p-14 rounded-[32px] shadow-sm border border-gray-200 text-center">
        
        {uploading ? (
          <div className="py-12">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-ink rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('done.savingTitle')}</h1>
            <p className="text-xl text-muted">{t('done.savingSub')}</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('done.allDoneTitle')}</h1>
            <p className="text-lg text-muted mb-4 leading-relaxed max-w-xl mx-auto">
              {t('done.allDoneSub')}
            </p>

            {/* Session Token Badge */}
            <div className="inline-flex items-center gap-2 bg-cream border border-ink/20 px-4 py-1.5 rounded-full text-xs font-mono mb-8">
              <span className="text-muted">Screening Token:</span>
              <strong className="text-ink text-sm">{activeSessionId}</strong>
              <span className="text-emerald-700 font-bold ml-1">✓ Sent to Clinic Queue</span>
            </div>

            {/* Nearest Pune Clinic Recommendation Card */}
            <div className="bg-sand/30 border border-sand rounded-3xl p-6 mb-8 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <span>📍</span>
                  <span>Nearest Memory Care Center (Pune)</span>
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
                  2.6 km away
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink mb-1">
                {localizedClinicName}
              </h3>
              <p className="text-sm text-muted mb-4 font-medium">
                {localizedArea}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={topClinic.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-ink text-paper text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 shadow-xs"
                >
                  <span>Get Directions</span>
                  <span className="text-lime font-mono">→</span>
                </a>

                <a
                  href={`tel:${topClinic.phone.replace(/\\s+/g, '')}`}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-ink text-sm font-bold hover:bg-gray-50"
                >
                  📞 Call Hospital
                </a>

                <button
                  onClick={() => navigate('/clinics')}
                  className="ml-auto text-sm font-bold text-ink underline underline-offset-4 hover:text-muted"
                >
                  View All Pune Clinics on Map →
                </button>
              </div>
            </div>

            {/* Restart Button */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button variant="secondary" size="patient" onClick={handleRestart}>
                {t('common.startNextPatient')}
              </Button>
              <button
                onClick={() => navigate('/clinic')}
                className="text-xs font-bold text-muted hover:text-ink underline underline-offset-4"
              >
                Inspect in Doctor Queue (Clinician Preview) →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
