import React, { useState, useEffect, useRef } from 'react';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';

export function SpeechTask() {
  const { setStep, saveSpeech } = useScreeningStore();
  const [status, setStatus] = useState<'idle' | 'recording' | 'done'>('idle');
  const [elapsed, setElapsed] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        saveSpeech(blob);
      };
      
      mediaRecorder.current.start();
      setStatus('recording');
      
      timer.current = setInterval(() => {
        setElapsed(e => {
          if (e >= 150) { // 2:30 max
            stopRecording();
            return e;
          }
          return e + 1;
        });
      }, 1000);
      
    } catch (e) {
      console.error(e);
      // Fallback
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
    }
    if (timer.current) clearInterval(timer.current);
    setStatus('done');
  };

  const handleNext = () => setStep('remember');
  const handleSkip = () => setStep('remember'); // Should flag as skipped modality

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PatientLayout 
      currentStep={4} 
      totalSteps={7} 
      title="Describe everything you see in this picture."
      subtitle="Talk for about a minute. There are no wrong answers."
    >
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <div className="flex-1 bg-white rounded-3xl p-4 border border-gray-200 shadow-sm flex flex-col">
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {/* The cookie theft picture or similar goes here. Placeholder for now. */}
            <div className="text-gray-400 font-bold text-xl">[ Clinical Scene Image ]</div>
          </div>
          <div className="mt-6 text-center">
            <button 
              onClick={handleSkip}
              className="text-muted underline hover:text-ink font-medium focus:outline-none focus:ring-[3px] focus:ring-ink p-2 rounded-md"
            >
              I can't see the picture
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center relative">
          
          {status === 'idle' && (
            <Button variant="primary" size="patient" onClick={startRecording} className="w-full mb-6">
              <span className="w-4 h-4 bg-lime rounded-full mr-4 inline-block shadow-[0_0_0_4px_rgba(228,255,101,0.3)]"></span>
              Start talking
            </Button>
          )}

          {status === 'recording' && (
            <div className="flex flex-col items-center w-full">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full"></div>
              </div>
              <div className="text-4xl font-mono font-bold text-ink mb-12 tabular-nums">
                {formatTime(elapsed)}
              </div>
              
              {elapsed < 45 ? (
                <p className="text-xl text-muted text-center h-16">Keep going if you can...</p>
              ) : (
                <div className="h-16 flex items-center">
                  <Button variant="secondary" size="patient" onClick={stopRecording} className="w-full border-ink">
                    I'm finished <span className="ml-2">→</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {status === 'done' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-full flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-xl font-bold mb-8">Recording saved.</p>
              <Button variant="primary" size="patient" onClick={handleNext} className="w-full">
                Next Task
              </Button>
            </div>
          )}

        </div>
      </div>
    </PatientLayout>
  );
}
