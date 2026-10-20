import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientLayout } from './Layout';
import { Button } from '../ui';
import { useScreeningStore } from '../../state/sessionStore';
import { SceneIllustration, SCENE_OPTIONS } from './SceneIllustration';

export function SpeechTask() {
  const { t } = useTranslation();
  const { setStep, saveSpeech } = useScreeningStore();
  const [status, setStatus] = useState<'idle' | 'recording' | 'done'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recordedMimeType = useRef<string>('audio/webm');

  const currentScene = SCENE_OPTIONS[selectedSceneIndex];

  const nextScene = () => {
    setSelectedSceneIndex((prev) => (prev + 1) % SCENE_OPTIONS.length);
  };

  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
      return '';
    }
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/aac',
    ];
    return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: true,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      recordedMimeType.current = mimeType || 'audio/webm';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const type = recordedMimeType.current || 'audio/webm';
        const blob = new Blob(audioChunks.current, { type });
        saveSpeech(blob, elapsed, currentScene.title);
      };
      
      // Start recording with 500ms time slice
      recorder.start(500);
      setStatus('recording');
      setElapsed(0);

      // Setup audio level visualizer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!streamRef.current || !audioContextRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < 20; i++) sum += dataArray[i];
          const avg = sum / 20;
          setAudioLevel(Math.min(100, Math.round((avg / 80) * 100)));
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        animFrameRef.current = requestAnimationFrame(updateLevel);
      } catch {
        // Visualizer is optional
      }
      
      timer.current = setInterval(() => {
        setElapsed((e) => {
          if (e >= 150) { // 2:30 max
            stopRecording();
            return e;
          }
          return e + 1;
        });
      }, 1000);
      
    } catch (e: any) {
      console.error('Speech recording error:', e);
      setMicError(e.message || 'Microphone could not be accessed. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setAudioLevel(0);
    setStatus('done');
  };

  const handleNext = () => {
    const type = recordedMimeType.current || 'audio/webm';
    saveSpeech(new Blob(audioChunks.current, { type }), elapsed || 25, currentScene.title);
    setStep('remember');
  };

  const handleSkip = () => {
    stopRecording();
    saveSpeech(new Blob(), 0, currentScene.title);
    setStep('remember');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PatientLayout 
      currentStep={4} 
      totalSteps={7} 
      title={t('speech.title')}
      subtitle={t('speech.subtitle')}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Side: Picture Display & Switcher */}
        <div className="flex-1 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col">
          {/* Top header with Scene selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">{t('speech.pictureLabel')}</span>
              <h2 className="text-lg font-bold text-ink">{currentScene.title}</h2>
            </div>

            {status === 'idle' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={nextScene}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ink"
                  title={t('speech.changePicture')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  {t('speech.changePicture')} ({selectedSceneIndex + 1}/{SCENE_OPTIONS.length})
                </button>
              </div>
            )}
          </div>

          {/* Scene Illustration Canvas */}
          <div className="w-full aspect-[4/3] bg-[#FAF8F5] rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200 p-2">
            <SceneIllustration sceneId={currentScene.id} />
          </div>

          {/* Picture Selector Pills & Skip Option */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {status === 'idle' ? (
              <div className="flex flex-wrap gap-2">
                {SCENE_OPTIONS.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedSceneIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSceneIndex === idx
                        ? 'bg-ink text-paper shadow-sm'
                        : 'bg-gray-100 text-muted hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}. {scene.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted font-medium">
                {currentScene.description}
              </div>
            )}

            <button 
              onClick={handleSkip}
              className="text-sm text-muted underline hover:text-ink font-medium focus:outline-none focus:ring-2 focus:ring-ink p-1 rounded-md ml-auto"
            >
              {t('speech.cantSeePic')}
            </button>
          </div>
        </div>

        {/* Right Side: Recording Controls */}
        <div className="w-full lg:w-88 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center relative">
          
          {status === 'idle' && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="w-20 h-20 bg-lime/30 rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-ink rounded-full flex items-center justify-center text-lime">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink mb-2">{t('speech.readyTitle')}</h3>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                {t('speech.readyDesc')}
              </p>

              {micError && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left w-full">
                  <p className="text-xs font-bold text-amber-800 mb-1">Microphone Notice</p>
                  <p className="text-xs text-amber-700 mb-3">{micError}</p>
                  <button 
                    onClick={handleSkip}
                    className="text-xs font-bold text-amber-900 underline hover:text-amber-950 block"
                  >
                    Continue screening without audio recording →
                  </button>
                </div>
              )}

              <Button variant="primary" size="patient" onClick={startRecording} className="w-full">
                <span className="w-3.5 h-3.5 bg-lime rounded-full mr-3 inline-block shadow-[0_0_0_4px_rgba(228,255,101,0.3)]"></span>
                {t('speech.startTalking')}
              </Button>
            </div>
          )}

          {status === 'recording' && (
            <div className="flex flex-col items-center w-full text-center">
              {/* Pulsing Recording Indicator */}
              <div className="relative mb-4">
                <div 
                  className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center transition-transform duration-100"
                  style={{ transform: `scale(${1 + (audioLevel / 100) * 0.25})` }}
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Timer Display */}
              <div className="text-4xl font-mono font-bold text-ink mb-1 tabular-nums">
                {formatTime(elapsed)}
              </div>

              {/* Audio meter */}
              <div className="w-full max-w-[180px] mb-3">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-75"
                    style={{ width: `${Math.max(6, audioLevel)}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted font-bold mt-1 uppercase tracking-wider">
                  {audioLevel > 6 ? '• Voice input detected' : 'Listening...'}
                </div>
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-4 flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                {t('speech.recordingInProgress')}
              </div>
              
              <p className="text-sm text-muted mb-6 leading-normal min-h-[40px]">
                {elapsed < 45 
                  ? t('speech.keepGoing')
                  : t('speech.goodJob')}
              </p>

              {/* ALWAYS AVAILABLE STOP RECORDING BUTTON */}
              <button
                onClick={stopRecording}
                className="w-full py-4 px-6 rounded-2xl bg-ink hover:bg-neutral-800 text-paper font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400"
              >
                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                {t('speech.stopRecording')}
              </button>
            </div>
          )}

          {status === 'done' && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="w-20 h-20 bg-[var(--color-risk-low-bg)] text-[var(--color-risk-low-text)] rounded-full flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink mb-1">{t('speech.recordingSaved')}</h3>
              <p className="text-sm text-muted mb-8 font-mono">{formatTime(elapsed)}</p>
              
              <Button variant="primary" size="patient" onClick={handleNext} className="w-full">
                {t('common.nextTask')} →
              </Button>
            </div>
          )}

        </div>
      </div>
    </PatientLayout>
  );
}
