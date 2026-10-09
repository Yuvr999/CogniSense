import React from 'react';

interface IntervalBarProps {
  p: number;
  low: number;
  high: number;
  thresholds?: { elevated: number; high: number };
}

export function IntervalBar({ p, low, high, thresholds = { elevated: 0.3, high: 0.7 } }: IntervalBarProps) {
  // Constrain to 0-1
  const safeP = Math.max(0, Math.min(1, p));
  const safeLow = Math.max(0, Math.min(1, low));
  const safeHigh = Math.max(0, Math.min(1, high));
  
  const ciWidth = (safeHigh - safeLow) * 100;
  
  return (
    <div className="w-full relative h-4 flex items-center" role="img" aria-label={`Probability ${p.toFixed(2)}, 95% CI ${low.toFixed(2)} to ${high.toFixed(2)}`}>
      {/* Background track */}
      <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
      
      {/* Threshold markers */}
      <div className="absolute h-2 w-px bg-gray-400" style={{ left: `${thresholds.elevated * 100}%` }}></div>
      <div className="absolute h-2 w-px bg-gray-400" style={{ left: `${thresholds.high * 100}%` }}></div>
      
      {/* CI Region */}
      <div 
        className="absolute h-1.5 rounded-full opacity-60 bg-ink" 
        style={{ left: `${safeLow * 100}%`, width: `${ciWidth}%` }}
      ></div>
      
      {/* Point estimate */}
      <div 
        className="absolute w-2 h-2 rounded-full bg-ink border border-paper" 
        style={{ left: `${safeP * 100}%`, transform: 'translateX(-50%)' }}
      ></div>
    </div>
  );
}
