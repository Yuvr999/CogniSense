import React, { useState } from 'react';

interface IconArrayProps {
  initialPrevalence?: number; // percent
  initialThreshold?: number; // 0-1 probability
}

export function IconArray({ initialPrevalence = 20, initialThreshold = 0.5 }: IconArrayProps) {
  const [prevalence, setPrevalence] = useState(initialPrevalence);
  const [threshold, setThreshold] = useState(initialThreshold);

  // Simplified calculation for demo purposes
  // Assuming a model with fixed sensitivity ~0.85 and specificity ~0.80
  const sensitivity = 0.85;
  const specificity = 0.80;
  
  // Actually, modifying threshold should theoretically change sens/spec. 
  // For the UI simulation, we'll approximate the effect.
  const adjustedSens = Math.max(0.1, Math.min(0.99, sensitivity - (threshold - 0.5)));
  const adjustedSpec = Math.max(0.1, Math.min(0.99, specificity + (threshold - 0.5)));

  const totalPositive = Math.round(prevalence); // True Positives + False Negatives
  const totalNegative = 100 - totalPositive; // True Negatives + False Positives

  const truePositives = Math.round(totalPositive * adjustedSens);
  const falseNegatives = totalPositive - truePositives;
  const trueNegatives = Math.round(totalNegative * adjustedSpec);
  const falsePositives = totalNegative - trueNegatives;

  const icons = [
    ...Array(truePositives).fill({ type: 'tp', label: 'True Positive (Flagged correctly)' }),
    ...Array(falsePositives).fill({ type: 'fp', label: 'False Positive (Flagged incorrectly)' }),
    ...Array(falseNegatives).fill({ type: 'fn', label: 'False Negative (Missed)' }),
    ...Array(trueNegatives).fill({ type: 'tn', label: 'True Negative (Cleared correctly)' }),
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold">If you screen 100 people like this</h3>
        
        <div className="flex flex-wrap gap-6 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-muted">Threshold</label>
            <input 
              type="range" min="0.1" max="0.9" step="0.1" 
              value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))}
              className="w-24 accent-ink"
            />
            <span className="text-xs font-mono w-8">{threshold.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-muted">Prevalence</label>
            <input 
              type="range" min="5" max="50" step="5" 
              value={prevalence} onChange={e => setPrevalence(parseInt(e.target.value))}
              className="w-24 accent-ink"
            />
            <span className="text-xs font-mono w-8">{prevalence}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="flex flex-wrap gap-1 content-start h-full">
            {icons.map((icon, i) => {
              let colorClass = "bg-gray-100 text-gray-300"; // tn
              if (icon.type === 'tp') colorClass = "bg-[var(--color-risk-high)] text-white";
              if (icon.type === 'fp') colorClass = "bg-[var(--color-risk-high-bg)] text-[var(--color-risk-high)] border border-[var(--color-risk-high)]";
              if (icon.type === 'fn') colorClass = "bg-gray-300 text-gray-600 border border-gray-400";

              return (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${colorClass}`}
                  title={icon.label}
                >
                  {icon.type === 'tn' ? '●' : '!' }
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[var(--color-risk-high)]"></div>
              <span>Correctly flagged</span>
            </div>
            <span className="font-bold">{truePositives}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high)]"></div>
              <span>False alarm</span>
            </div>
            <span className="font-bold">{falsePositives}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-100"></div>
              <span>Correctly cleared</span>
            </div>
            <span className="font-bold">{trueNegatives}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 border border-gray-400"></div>
              <span>Missed</span>
            </div>
            <span className="font-bold">{falseNegatives}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
