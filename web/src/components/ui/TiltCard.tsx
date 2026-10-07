import React from 'react';

type CardTone = 'cream' | 'paper' | 'white';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rotation?: number;
  tone?: CardTone;
}

const toneMap: Record<CardTone, string> = {
  cream: 'bg-cream text-ink',
  paper: 'bg-paper text-ink',
  white: 'bg-white text-ink'
};

export function TiltCard({ rotation = 0, tone = 'cream', className = '', children, ...props }: TiltCardProps) {
  const transform = rotation !== 0 ? `rotate(${rotation}deg)` : 'none';

  return (
    <div
      className={`rounded-[24px] shadow-[var(--shadow-float)] p-6 md:p-8 transition-transform hover:-translate-y-1 duration-200 ${toneMap[tone]} ${className}`}
      style={{ transform }}
      {...props}
    >
      {children}
    </div>
  );
}
