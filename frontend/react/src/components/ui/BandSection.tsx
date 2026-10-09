import React from 'react';

type BandTone = 'sand' | 'sky' | 'lavender' | 'lime' | 'white' | 'ink';

interface BandSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: BandTone;
  inset?: boolean;
}

const toneMap: Record<BandTone, { bg: string; text: string }> = {
  sand: { bg: 'bg-sand', text: 'text-ink' },
  sky: { bg: 'bg-sky', text: 'text-ink' },
  lavender: { bg: 'bg-lavender', text: 'text-ink' },
  lime: { bg: 'bg-lime', text: 'text-ink' },
  white: { bg: 'bg-white', text: 'text-ink' },
  ink: { bg: 'bg-ink', text: 'text-paper' },
};

export function BandSection({ tone = 'white', inset = false, className = '', children, ...props }: BandSectionProps) {
  const colors = toneMap[tone];
  
  return (
    <section 
      className={`w-full ${inset ? 'py-12 md:py-16 px-4 md:px-8' : 'py-20 md:py-32 px-4'} ${className}`}
      {...props}
    >
      <div 
        className={`mx-auto w-full ${inset ? 'max-w-6xl rounded-3xl p-8 md:p-16' : 'max-w-7xl'} ${colors.bg} ${colors.text} transition-colors duration-500`}
      >
        {children}
      </div>
    </section>
  );
}
