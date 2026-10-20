import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavPill, DisclaimerBar } from '../components/ui';
import { ClinicFinderView } from '../components/clinicFinder/ClinicFinderView';

export function ClinicFinder() {
  const { t } = useTranslation();

  const navLinks = [
    { label: t('nav.howItWorks'), href: '/#how-it-works' },
    { label: 'Find Clinics (Pune)', href: '/clinics' },
    { label: t('nav.evidence'), href: '/#evidence' },
    { label: t('nav.forClinicians'), href: '/login/clinic' }
  ];

  return (
    <div className="bg-paper min-h-screen pb-20">
      <NavPill links={navLinks} activeHref="/clinics" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36">
        <ClinicFinderView />
      </main>

      <DisclaimerBar className="fixed bottom-0 left-0 right-0 z-40" />
    </div>
  );
}
