import React from 'react';

interface DisclaimerBarProps {
  className?: string;
}

export function DisclaimerBar({ className = '' }: DisclaimerBarProps) {
  return (
    <div className={`w-full bg-ink text-paper text-center py-2 px-4 text-sm font-medium ${className}`} role="contentinfo">
      Screening aid, not a diagnosis.
    </div>
  );
}
