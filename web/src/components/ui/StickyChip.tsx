import React from 'react';

type ChipTone = 'lime' | 'pink-deco' | 'sky';

interface StickyChipProps {
  text: string;
  tone?: ChipTone;
  tilt?: number; // e.g., -5 to 5 degrees
  className?: string;
}

const toneStyles: Record<ChipTone, string> = {
  lime: 'bg-lime text-ink',
  'pink-deco': 'bg-pink-deco text-paper',
  sky: 'bg-sky text-ink'
};

export function StickyChip({ text, tone = 'lime', tilt = 0, className = '' }: StickyChipProps) {
  const rotation = tilt !== 0 ? `rotate(${tilt}deg)` : 'none';
  
  return (
    <div 
      className={`inline-flex items-center justify-center px-6 py-3 font-display font-bold text-xl md:text-2xl shadow-[var(--shadow-float)] transition-transform hover:scale-105 duration-200 ${toneStyles[tone]} ${className}`}
      style={{ transform: rotation, borderRadius: '2px' }}
    >
      {/* Tape effect at the top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/30 backdrop-blur-sm -rotate-2" style={{ clipPath: 'polygon(0 10%, 100% 0, 95% 100%, 5% 90%)' }}></div>
      <span className="relative z-10">{text}</span>
    </div>
  );
}
