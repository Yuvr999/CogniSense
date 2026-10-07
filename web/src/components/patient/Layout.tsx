import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="flex items-center flex-1 max-w-xl mx-8" aria-hidden="true">
      {/* Background track */}
      <div className="h-2 w-full bg-gray-200 rounded-full relative">
        {/* Progress fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-ink rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
        {/* Current step dot */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-ink rounded-full transition-all duration-300 shadow-sm"
          style={{ left: `calc(${(currentStep / totalSteps) * 100}% - 8px)` }}
        ></div>
      </div>
    </div>
  );
}

export function PatientLayout({ children, currentStep, totalSteps, title, subtitle, onHelp }: { 
  children: React.ReactNode, 
  currentStep: number, 
  totalSteps: number, 
  title?: string, 
  subtitle?: string,
  onHelp?: () => void 
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col p-4 md:p-8 selection:bg-lime selection:text-ink">
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 md:mb-16">
        <div className="text-xl font-bold text-muted whitespace-nowrap">
          Step {currentStep} of {totalSteps}
        </div>
        
        <Stepper currentStep={currentStep} totalSteps={totalSteps} />
        
        <button 
          onClick={onHelp}
          className="text-xl font-bold text-ink underline underline-offset-4 decoration-2 decoration-gray-300 hover:decoration-ink focus:outline-none focus:ring-[3px] focus:ring-ink p-2 rounded-md transition-colors"
        >
          Need help?
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col">
        {(title || subtitle) && (
          <div className="mb-12">
            {title && <h1 className="text-3xl md:text-5xl font-bold text-ink mb-4 max-w-3xl leading-tight" tabIndex={-1}>{title}</h1>}
            {subtitle && <p className="text-xl text-muted max-w-3xl leading-relaxed">{subtitle}</p>}
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
