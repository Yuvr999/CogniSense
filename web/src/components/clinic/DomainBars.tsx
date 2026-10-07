import React from 'react';

interface DomainBarsProps {
  domains: { name: string; zScore: number }[];
}

export function DomainBars({ domains }: DomainBarsProps) {
  // We represent z-scores typically from -3 to +3
  const scale = (z: number) => {
    const clamped = Math.max(-3, Math.min(3, z));
    // -3 -> 0%, 0 -> 50%, 3 -> 100%
    return ((clamped + 3) / 6) * 100;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
      <h3 className="text-lg font-bold mb-6">Cognitive domains</h3>
      <div className="text-xs text-muted flex justify-between mb-2">
        <span>Impaired (-3)</span>
        <span>Average (0)</span>
        <span>Strong (+3)</span>
      </div>
      
      <div className="space-y-6 mt-4">
        {domains.map(d => (
          <div key={d.name}>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>{d.name}</span>
              <span className={d.zScore < -1.5 ? 'text-[var(--color-risk-high)]' : 'text-ink'}>
                {d.zScore > 0 ? '+' : ''}{d.zScore.toFixed(1)}
              </span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full w-full">
              {/* Zero line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400 -translate-x-1/2 z-10"></div>
              
              {/* Bar */}
              <div 
                className={`absolute top-0 bottom-0 rounded-full ${d.zScore < -1.5 ? 'bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high)]' : 'bg-ink'}`}
                style={{
                  left: d.zScore < 0 ? `${scale(d.zScore)}%` : '50%',
                  right: d.zScore > 0 ? `${100 - scale(d.zScore)}%` : '50%'
                }}
              ></div>
              
              {/* Marker dot */}
              <div 
                className="absolute top-1/2 w-3 h-3 bg-ink rounded-full -translate-y-1/2 -translate-x-1/2 z-20 shadow-sm"
                style={{ left: `${scale(d.zScore)}%`, backgroundColor: d.zScore < -1.5 ? 'var(--color-risk-high)' : 'var(--color-ink)' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
