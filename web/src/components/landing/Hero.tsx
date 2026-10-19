import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';

export function Hero() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const headlineLines = [
    t('landing.heroHeadline1'),
    t('landing.heroHeadline2'),
    t('landing.heroHeadline3')
  ];

  return (
    <section className="bg-sand pt-40 pb-24 px-4 flex flex-col items-center overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="font-display font-black text-[clamp(48px,8vw,130px)] leading-[0.98] tracking-tighter text-ink mb-8">
          {headlineLines.map((line, i) => (
            <span 
              key={i} 
              className="block transition-all duration-900 ease-out"
              style={{
                filter: isLoaded ? 'blur(0)' : 'blur(10px)',
                opacity: isLoaded ? 1 : 0.55,
                transitionDelay: `${i * 120}ms`
              }}
            >
              {line}
            </span>
          ))}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-10 font-medium">
          {t('landing.heroSub')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="patient" onClick={() => window.location.href = '/login/clinic'}>
            🩺 Doctor & Admin Login
          </Button>
          <Button variant="secondary" size="patient" onClick={() => window.location.href = '/login/patient'}>
            👤 Patient Login & Portal
          </Button>
          <Button variant="link-arrow" onClick={() => window.location.href = '/clinics'}>
            Find Pune Clinics →
          </Button>
        </div>
      </div>
    </section>
  );
}
