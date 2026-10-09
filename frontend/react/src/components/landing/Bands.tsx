import React, { useEffect, useRef, useState } from 'react';
import { BandSection, StickyChip } from '../ui';

export function TasksBand() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <BandSection tone="sky" inset className="md:my-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <h2 
            className="text-4xl md:text-5xl lg:text-7xl font-display font-black tracking-tight leading-none text-ink lg:w-2/3 transition-all duration-700 ease-out"
            style={{
              filter: inView ? 'blur(0)' : 'blur(8px)',
              opacity: inView ? 1 : 0.4
            }}
          >
            Three short tasks. <br className="hidden md:block" />One explained result.
          </h2>
          <div className="lg:w-1/3 flex justify-center lg:justify-end">
            <StickyChip text="8 min" tone="lime" tilt={-4} className="scale-125 origin-right" />
          </div>
        </div>
      </BandSection>
    </div>
  );
}

export function Breather() {
  return (
    <section className="py-32 md:py-48 px-4 text-center bg-white flex items-center justify-center">
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-ink max-w-4xl leading-tight">
        Screening, yes.<br />Diagnosing, no.
      </h2>
    </section>
  );
}
