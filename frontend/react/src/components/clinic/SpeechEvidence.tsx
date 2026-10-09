import React from 'react';

interface SpeechEvidenceProps {
  pauses: { start: number; duration: number }[];
  totalDuration: number; // in seconds
  contentScore: { found: number; total: number };
}

export function SpeechEvidence({ pauses, totalDuration, contentScore }: SpeechEvidenceProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <h3 className="text-lg font-bold mb-6">Speech evidence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-muted mb-4 uppercase tracking-wider">Pause timeline</h4>
          <p className="text-sm mb-4">Gaps between words over the {Math.round(totalDuration)}s recording.</p>
          
          <div className="relative w-full h-12 bg-gray-100 rounded-md overflow-hidden">
            {/* Timeline ticks */}
            <div className="absolute inset-0 flex justify-between px-2 text-[10px] text-gray-400 items-end pb-1 pointer-events-none">
              <span>0s</span>
              <span>{Math.round(totalDuration / 2)}s</span>
              <span>{Math.round(totalDuration)}s</span>
            </div>
            
            {/* Pause blocks */}
            {pauses.map((p, i) => {
              const left = (p.start / totalDuration) * 100;
              const width = (p.duration / totalDuration) * 100;
              const isLong = p.duration > 2.0; // Flag pauses > 2s
              return (
                <div 
                  key={i}
                  className={`absolute top-0 bottom-5 rounded-sm opacity-80 ${isLong ? 'bg-[var(--color-risk-high)]' : 'bg-ink'}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`Pause: ${p.duration}s`}
                ></div>
              );
            })}
          </div>
          <div className="mt-2 text-xs flex gap-4">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-ink rounded-sm"></div> Normal pause</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[var(--color-risk-high)] rounded-sm"></div> Long pause (&gt;2s)</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold text-muted mb-4 uppercase tracking-wider">Scene content</h4>
          <div className="flex items-end gap-4 mb-4">
            <div className="text-5xl font-display font-bold text-ink">{contentScore.found}</div>
            <div className="text-xl text-muted mb-1 font-bold">of {contentScore.total} key concepts</div>
          </div>
          
          {/* Visual grid for concepts */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: contentScore.total }).map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${i < contentScore.found ? 'bg-sky text-ink' : 'bg-gray-100 text-transparent border border-gray-200'}`}
              >
                ✓
              </div>
            ))}
          </div>
          <p className="text-sm text-muted mt-4">
            Based on standard cookie-theft picture information units.
          </p>
        </div>
      </div>
    </div>
  );
}
