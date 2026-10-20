import { create } from 'zustand';

export type ScreeningStep = 
  | 'idle' 
  | 'consent' 
  | 'profile' 
  | 'micCheck' 
  | 'speech' 
  | 'remember' 
  | 'fluency' 
  | 'trace' 
  | 'recall' 
  | 'uploading' 
  | 'done' 
  | 'error';

export interface PatientProfile {
  age?: number;
  sex?: string;
  educationYears?: number;
  language?: string;
  assistedMode?: boolean;
}

interface ScreeningState {
  step: ScreeningStep;
  sessionId: string | null;
  consented: boolean;
  researchConsent: boolean;
  profile: PatientProfile;
  audioBlob: Blob | null;
  speechDuration: number;
  speechScene: string;
  fluencyText: string | null;
  fluencyAudio: Blob | null;
  traceData: { target: string, timestamp: number }[];
  recallText: string | null;
  recallAudio: Blob | null;
  hasCompletedScreening: boolean;
  completedSessionId: string | null;
  
  // Actions
  setStep: (step: ScreeningStep) => void;
  setConsents: (screening: boolean, research: boolean) => void;
  setProfile: (profile: Partial<PatientProfile>) => void;
  setSessionId: (id: string) => void;
  saveSpeech: (audio: Blob, duration?: number, sceneTitle?: string) => void;
  saveFluency: (data: { text?: string, audio?: Blob }) => void;
  saveTrace: (data: { target: string, timestamp: number }[]) => void;
  saveRecall: (data: { text?: string, audio?: Blob }) => void;
  setHasCompletedScreening: (completed: boolean, sessionId?: string) => void;
  reset: (clearCompletion?: boolean) => void;
}

const getStoredCompletion = (): { completed: boolean; id: string | null } => {
  try {
    const raw = sessionStorage.getItem('cognisense_has_completed_screening');
    const id = sessionStorage.getItem('cognisense_completed_session_id');
    return { completed: raw === 'true', id };
  } catch {
    return { completed: false, id: null };
  }
};

const initialCompletion = getStoredCompletion();

export const useScreeningStore = create<ScreeningState>((set) => ({
  step: 'idle',
  sessionId: null,
  consented: false,
  researchConsent: false,
  profile: {},
  audioBlob: null,
  speechDuration: 0,
  speechScene: 'The Cookie Theft Kitchen Scene',
  fluencyText: null,
  fluencyAudio: null,
  traceData: [],
  recallText: null,
  recallAudio: null,
  hasCompletedScreening: initialCompletion.completed,
  completedSessionId: initialCompletion.id,

  setStep: (step) => set({ step }),
  setConsents: (screening, research) => set({ consented: screening, researchConsent: research }),
  setProfile: (update) => set((state) => ({ profile: { ...state.profile, ...update } })),
  setSessionId: (id) => set({ sessionId: id }),
  saveSpeech: (audio, duration = 0, scene = 'The Cookie Theft Kitchen Scene') => 
    set({ audioBlob: audio, speechDuration: duration, speechScene: scene }),
  saveFluency: (data) => set({ fluencyText: data.text || null, fluencyAudio: data.audio || null }),
  saveTrace: (data) => set({ traceData: data }),
  saveRecall: (data) => set({ recallText: data.text || null, recallAudio: data.audio || null }),
  setHasCompletedScreening: (completed, sessionId) => {
    try {
      if (completed) {
        sessionStorage.setItem('cognisense_has_completed_screening', 'true');
        if (sessionId) sessionStorage.setItem('cognisense_completed_session_id', sessionId);
      } else {
        sessionStorage.removeItem('cognisense_has_completed_screening');
        sessionStorage.removeItem('cognisense_completed_session_id');
      }
    } catch {
      // ignore
    }
    set({ hasCompletedScreening: completed, completedSessionId: sessionId || null });
  },
  reset: (clearCompletion = false) => {
    if (clearCompletion) {
      try {
        sessionStorage.removeItem('cognisense_has_completed_screening');
        sessionStorage.removeItem('cognisense_completed_session_id');
      } catch {
        // ignore
      }
    }
    set((state) => ({
      step: 'idle',
      sessionId: null,
      consented: false,
      researchConsent: false,
      profile: {},
      audioBlob: null,
      speechDuration: 0,
      speechScene: 'The Cookie Theft Kitchen Scene',
      fluencyText: null,
      fluencyAudio: null,
      traceData: [],
      recallText: null,
      recallAudio: null,
      hasCompletedScreening: clearCompletion ? false : state.hasCompletedScreening,
      completedSessionId: clearCompletion ? null : state.completedSessionId,
    }));
  }
}));
