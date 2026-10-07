import React from 'react';
import { RiskTierBadge, IntervalBar } from '../ui';

interface KPIStripProps {
  data: any;
}

export function KPIStrip({ data }: KPIStripProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Risk Tier Cell */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Overall Risk</div>
        <div className="flex items-center justify-between mb-3">
          <RiskTierBadge tier={data.risk_tier} size="md" />
          <span className="text-xl font-bold tabular-nums">{data.probability.toFixed(2)}</span>
        </div>
        <IntervalBar p={data.probability} low={data.probability_ci[0]} high={data.probability_ci[1]} />
      </div>

      {/* Speech Modality */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[var(--color-speech)]">
        <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Speech</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tabular-nums">{data.speech_score.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex gap-1 h-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex-1 rounded-sm ${i < data.speech_score * 7 ? 'bg-[var(--color-speech)]' : 'bg-gray-100'}`}></div>
          ))}
        </div>
      </div>

      {/* Cognitive Modality */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[var(--color-cognitive)]">
        <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Cognitive</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tabular-nums">{data.cognitive_score.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex gap-1 h-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex-1 rounded-sm ${i < data.cognitive_score * 7 ? 'bg-[var(--color-cognitive)]' : 'bg-gray-100'}`}></div>
          ))}
        </div>
      </div>

      {/* Data Quality */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Data Quality</div>
        <div className="flex items-center h-full pb-6">
          {data.data_quality.flags.length > 0 ? (
            <span className="text-lg font-bold text-[#8F6B00]">
              {data.data_quality.flags.length} flag{data.data_quality.flags.length > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-lg font-bold text-[var(--color-risk-low-text)]">All clear</span>
          )}
        </div>
      </div>
    </div>
  );
}
