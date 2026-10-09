import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';
import { PUNE_CLINICS } from '../../data/puneClinics';

export function Done() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'hi' | 'mr' | 'kn';
  const { reset } = useScreeningStore();
  const [uploading, setUploading] = useState(true);

  // Top recommended Pune memory clinic (Deenanath Mangeshkar Hospital)
  const topClinic = PUNE_CLINICS[0];
  const localizedClinicName = topClinic.name[lang] || topClinic.name.en;
  const localizedArea = topClinic.area[lang] || topClinic.area.en;

  useEffect(() => {
    // Simulate upload delay
    const timer = setTimeout(() => {
      setUploading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    reset();
    window.location.href = '/';
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

            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('done.allDoneTitle')}</h1>
            <p className="text-lg text-muted mb-8 leading-relaxed max-w-xl mx-auto">
              {t('done.allDoneSub')}
            </p>

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

                <a
                  href="/clinics"
                  className="ml-auto text-sm font-bold text-ink underline underline-offset-4 hover:text-muted"
                >
                  View All Pune Clinics on Map →
                </a>
              </div>
            </div>

            {/* Restart Button */}
            <div className="flex justify-center">
              <Button variant="secondary" size="patient" onClick={handleRestart}>
                {t('common.startNextPatient')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
