import React from 'react';
import { BandSection, Button } from '../ui';

export function AskBand() {
  return (
    <BandSection tone="lime" className="text-center md:my-16" inset>
      <h2 className="text-4xl md:text-6xl font-display font-black leading-none mb-12">
        See a screening <br className="hidden md:block" />from both sides.
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <Button variant="primary" size="patient" onClick={() => window.location.href = '/clinic'}>
          Open clinician demo
        </Button>
        <Button variant="secondary" onClick={() => window.location.href = '/screen'} className="bg-white border-none shadow-sm h-[56px] px-8 text-xl rounded-full">
          Try the patient screening
        </Button>
      </div>
    </BandSection>
  );
}
