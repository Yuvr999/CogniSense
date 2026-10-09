import React from 'react';

const items = [
  "ADReSS",
  "ADNI / TADPOLE",
  "HL7 FHIR R4",
  "WCAG 2.2 AA",
  "faster-whisper",
  "openSMILE"
];

export function Marquee() {
  return (
    <div className="w-full bg-paper border-y border-gray-200 py-6 overflow-hidden flex items-center">
      <div className="flex w-max animate-marquee hover:pause-marquee focus-within:pause-marquee motion-reduce:animate-none">
        {/* Double the items to allow seamless looping */}
        {[...items, ...items, ...items].map((item, i) => (
          <React.Fragment key={i}>
            <span className="text-xl font-bold text-muted whitespace-nowrap mx-8 uppercase tracking-wide">
              {item}
            </span>
            <span className="text-lime text-xl" aria-hidden="true">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
