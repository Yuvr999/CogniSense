import React, { useState, useEffect } from 'react';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

const targets = [
  { id: '1', label: '1', x: 10, y: 10 },
  { id: 'A', label: 'A', x: 40, y: 30 },
  { id: '2', label: '2', x: 20, y: 60 },
  { id: 'B', label: 'B', x: 70, y: 20 },
  { id: '3', label: '3', x: 80, y: 70 },
  { id: 'C', label: 'C', x: 50, y: 80 },
];
const order = ['1', 'A', '2', 'B', '3', 'C'];

export function TraceTask() {
  const { setStep, saveTrace } = useScreeningStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorShake, setErrorShake] = useState<string | null>(null);
  const [clicks, setClicks] = useState<{ target: string; timestamp: number }[]>([]);
  
  const handleTap = (id: string) => {
    if (currentIndex >= order.length) return;
    
    if (id === order[currentIndex]) {
      setClicks(prev => [...prev, { target: id, timestamp: Date.now() }]);
      setCurrentIndex(c => c + 1);
    } else {
      setErrorShake(id);
      setTimeout(() => setErrorShake(null), 400);
    }
  };

  const handleNext = () => {
    saveTrace(clicks);
    setStep('recall');
  };

  return (
    <PatientLayout 
      currentStep={7} 
      totalSteps={7} 
      title="Trace the path"
      subtitle="Tap the numbers and letters in order: 1, then A, then 2, then B, and so on."
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 aspect-[4/3] relative overflow-hidden mt-4">
        
        {/* Draw lines between completed targets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {order.slice(0, currentIndex).map((id, idx) => {
            if (idx === 0) return null;
            const prev = targets.find(t => t.id === order[idx - 1])!;
            const curr = targets.find(t => t.id === id)!;
            return (
              <line 
                key={idx}
                x1={`${prev.x}%`} y1={`${prev.y}%`}
                x2={`${curr.x}%`} y2={`${curr.y}%`}
                stroke="#111111" strokeWidth="4" strokeLinecap="round"
              />
            );
          })}
        </svg>

        {targets.map(target => {
          const isCompleted = order.indexOf(target.id) < currentIndex;
          const isNext = order[currentIndex] === target.id;
          const isError = errorShake === target.id;
          
          let stateClasses = "bg-white border-4 border-ink text-ink";
          if (isCompleted) stateClasses = "bg-ink border-4 border-ink text-paper";
          if (isError) stateClasses = "bg-red-100 border-4 border-red-500 text-red-500 animate-shake";

          return (
            <button
              key={target.id}
              onClick={() => handleTap(target.id)}
              className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-display shadow-sm transition-colors focus:outline-none focus:ring-4 focus:ring-lime ${stateClasses}`}
              style={{ 
                left: `calc(${target.x}% - 32px)`, 
                top: `calc(${target.y}% - 32px)`,
                transform: isError ? 'translateX(0)' : undefined // Let tailwind handle animation
              }}
              aria-label={`Target ${target.label}`}
              disabled={currentIndex >= order.length}
            >
              {target.label}
            </button>
          );
        })}
        
        {currentIndex >= order.length && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <h2 className="text-4xl font-bold mb-8">Path complete!</h2>
            <Button variant="primary" size="patient" onClick={handleNext}>Next Task</Button>
          </div>
        )}

      </div>
    </PatientLayout>
  );
}
