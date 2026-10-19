import React, { useEffect } from 'react';
import { NavPill } from '../components/ui';
import { 
  Hero, 
  TheGap, 
  TasksBand, 
  Breather, 
  Marquee, 
  TheWholeVisit, 
  NumbersBand, 
  WhereItFits, 
  AskBand, 
  Footer 
} from '../components/landing';

import { useTranslation } from 'react-i18next';

export function Landing() {
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'landing');
    return () => document.documentElement.removeAttribute('data-mode');
  }, []);

  const navLinks = [
    { label: 'Patient Portal', href: '/patient' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: 'Find Clinics (Pune)', href: '/clinics' },
    { label: t('nav.evidence'), href: '#evidence' },
    { label: t('nav.forClinicians'), href: '/login/clinic' }
  ];



  return (
    <div className="bg-paper min-h-screen">
      <NavPill links={navLinks} />
      
      <main id="main-content">
        <Hero />
        <TheGap />
        
        <div id="how-it-works">
          <TasksBand />
        </div>
        
        <Marquee />
        <Breather />
        <TheWholeVisit />
        
        <div id="evidence">
          <NumbersBand />
        </div>
        
        <div id="clinicians">
          <WhereItFits />
        </div>
        
        <AskBand />
      </main>

      <div id="privacy">
        <Footer />
      </div>
    </div>
  );
}
