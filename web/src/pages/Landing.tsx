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

export function Landing() {
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'landing');
    return () => document.documentElement.removeAttribute('data-mode');
  }, []);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'For clinicians', href: '#clinicians' },
    { label: 'Evidence', href: '#evidence' },
    { label: 'Privacy', href: '#privacy' }
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
