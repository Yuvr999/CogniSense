import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '../ui';

export function Hero() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [96, 0]);
  const scale = useTransform(scrollY, [0, 500], [0.94, 1]);

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
    <section className="bg-sand pt-40 px-4 flex flex-col items-center overflow-hidden">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button variant="primary" size="patient" onClick={() => window.location.href = '/clinic'}>
            {t('common.openClinicianDemo')}
          </Button>
          <Button variant="link-arrow" onClick={() => window.location.href = '/screen'}>
            {t('common.tryPatientScreening')}
          </Button>
        </div>
      </div>

      {/* Tablet Mockup rising from bottom */}
      <motion.div 
        className="w-full max-w-5xl bg-ink rounded-t-3xl border-8 border-b-0 border-ink shadow-2xl overflow-hidden relative z-20 will-change-transform"
        style={{ y, scale, minHeight: '400px' }}
      >
        {/* Screen Content - A simple representation of patient flow */}
        <div className="bg-paper w-full h-full p-8 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <span className="text-muted font-bold">{t('common.stepOf', { current: 3, total: 7 })}</span>
            <Button variant="secondary" size="clinic">{t('common.needHelp')}</Button>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 max-w-2xl">{t('speech.title')}</h2>
          <p className="text-xl text-muted mb-12">{t('speech.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-xl aspect-[4/3] flex items-center justify-center text-muted font-bold text-lg">
              {t('speech.pictureLabel')}
            </div>
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200">
              <Button variant="primary" size="patient" className="mb-4">{t('speech.startTalking')}</Button>
              <span className="text-2xl font-bold font-mono text-muted">00:00</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
