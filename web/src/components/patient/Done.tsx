import React, { useEffect, useState } from 'react';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

export function Done() {
  const { reset } = useScreeningStore();
  const [uploading, setUploading] = useState(true);

  useEffect(() => {
    // Simulate upload delay
    const timer = setTimeout(() => {
      setUploading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    reset();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="max-w-2xl bg-white p-12 md:p-16 rounded-[32px] shadow-sm border border-gray-200 text-center">
        
        {uploading ? (
          <>
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-ink rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Saving your answers...</h1>
            <p className="text-xl text-muted">Please wait a moment.</p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-full flex items-center justify-center mx-auto mb-8">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-8">All done. Thank you.</h1>
            <p className="text-xl text-muted mb-16 leading-relaxed max-w-lg mx-auto">
              Your clinician will talk through the next steps with you shortly.
            </p>
            <Button variant="secondary" size="patient" onClick={handleRestart}>
              Start Next Patient
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
