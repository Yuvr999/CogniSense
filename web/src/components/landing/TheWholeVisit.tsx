import React, { useState, useEffect, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui';

const tabs = [
  { id: 'speak', label: 'Speak', desc: 'Describe a picture for about a minute to analyze speech patterns.', bg: 'bg-sky' },
  { id: 'remember', label: 'Remember', desc: 'Recall a short list of words after a delay.', bg: 'bg-lavender' },
  { id: 'trace', label: 'Trace', desc: 'Connect letters and numbers in order to check executive function.', bg: 'bg-sand' },
  { id: 'review', label: 'Review', desc: 'The clinician reviews the explained risk estimate and data quality.', bg: 'bg-paper' },
  { id: 'share', label: 'Share', desc: 'Results are safely exported to the EHR for next steps.', bg: 'bg-cream' }
];

export function TheWholeVisit() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isHovered, setIsHovered] = useState(false);
  const [motionOk, setMotionOk] = useState(true);
  
  useEffect(() => {
    setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!motionOk || isHovered) return;
    
    const interval = setInterval(() => {
      setActiveTab(current => {
        const idx = tabs.findIndex(t => t.id === current);
        return tabs[(idx + 1) % tabs.length].id;
      });
    }, 6000);
    
    return () => clearInterval(interval);
  }, [motionOk, isHovered]);

  const activeContent = tabs.find(t => t.id === activeTab);

  return (
    <section className="py-24 px-4 bg-white max-w-7xl mx-auto">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onFocus={() => setIsHovered(true)} onBlur={() => setIsHovered(false)}>
        <Tabs.List className="flex flex-wrap justify-center gap-2 md:gap-8 mb-12 border-b border-gray-200">
          {tabs.map((tab, idx) => (
            <Tabs.Trigger 
              key={tab.id}
              value={tab.id}
              className={`pb-4 px-2 text-xl font-bold transition-colors border-b-4 focus:outline-none focus:ring-[3px] focus:ring-ink focus:ring-offset-2 ${activeTab === tab.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
            >
              {idx + 1}. {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="relative max-w-5xl mx-auto rounded-[32px] border-[12px] border-ink bg-ink shadow-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: motionOk ? 0 : 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: motionOk ? 0 : 1 }}
              transition={{ duration: 0.32 }}
              className={`absolute inset-0 ${activeContent?.bg} p-8 md:p-16 flex flex-col justify-center`}
            >
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl max-w-xl">
                <h3 className="text-3xl font-bold mb-4">{activeContent?.label}</h3>
                <p className="text-xl text-muted mb-8">{activeContent?.desc}</p>
                <Button variant="primary">Preview Action</Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs.Root>
    </section>
  );
}
