import React from 'react';
import { StickyChip, TiltCard } from '../ui';

export function TheGap() {
  return (
    <section className="bg-sand pt-32 pb-48 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-tight mb-8">
            Memory changes start years before the first symptoms.
          </h2>
          <p className="text-xl text-muted">
            Early detection allows for better care planning, clinical trial matching, and lifestyle interventions. But time in the clinic is limited.
          </p>
        </div>
        
        <div className="lg:w-1/2 relative h-[500px] w-full mt-12 lg:mt-0">
          <TiltCard rotation={-4} tone="cream" className="absolute top-10 left-0 max-w-sm z-10 w-4/5">
            <h3 className="text-lg font-bold mb-2">Transcript Flag</h3>
            <p className="text-sm text-muted">Frequent pauses and word-finding delays compared to age-matched norms.</p>
          </TiltCard>
          
          <TiltCard rotation={3} tone="white" className="absolute top-48 left-12 max-w-sm z-20 w-4/5 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Cognitive Result</h3>
            <p className="text-sm text-muted">Delayed recall score indicates a need for comprehensive assessment.</p>
          </TiltCard>

          <div className="absolute top-0 right-10 z-30">
            <StickyChip text="15–20 years" tone="lime" tilt={5} />
            <div className="text-xs text-muted text-center mt-2 max-w-[150px]">Before symptoms*</div>
          </div>
          
          <div className="absolute top-40 right-0 z-30">
            <StickyChip text="60–80%" tone="pink-deco" tilt={-3} />
            <div className="text-xs text-muted text-center mt-2 max-w-[150px]">Of dementia cases*</div>
          </div>

          <div className="absolute bottom-10 right-20 z-30">
            <StickyChip text="under 10 min" tone="sky" tilt={2} />
            <div className="text-xs text-muted text-center mt-2">Screening time</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 text-xs text-muted opacity-60">
        * Estimates from Alzheimer's Association
      </div>
    </section>
  );
}
