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
  fluencyText: string | null;
  fluencyAudio: Blob | null;
  traceData: { target: string, timestamp: number }[];
  recallText: string | null;
  recallAudio: Blob | null;
  
  // Actions
  setStep: (step: ScreeningStep) => void;
  setConsents: (screening: boolean, research: boolean) => void;
  setProfile: (profile: Partial<PatientProfile>) => void;
  setSessionId: (id: string) => void;
  saveSpeech: (audio: Blob) => void;
  saveFluency: (data: { text?: string, audio?: Blob }) => void;
  saveTrace: (data: { target: string, timestamp: number }[]) => void;
  saveRecall: (data: { text?: string, audio?: Blob }) => void;
  reset: () => void;
}

export const useScreeningStore = create<ScreeningState>((set) => ({
  step: 'idle',
  sessionId: null,
  consented: false,
  researchConsent: false,
  profile: {},
  audioBlob: null,
  fluencyText: null,
  fluencyAudio: null,
  traceData: [],
  recallText: null,
  recallAudio: null,

  setStep: (step) => set({ step }),
  setConsents: (screening, research) => set({ consented: screening, researchConsent: research }),
  setProfile: (update) => set((state) => ({ profile: { ...state.profile, ...update } })),
  setSessionId: (id) => set({ sessionId: id }),
  saveSpeech: (audio) => set({ audioBlob: audio }),
  saveFluency: (data) => set({ fluencyText: data.text || null, fluencyAudio: data.audio || null }),
  saveTrace: (data) => set({ traceData: data }),
  saveRecall: (data) => set({ recallText: data.text || null, recallAudio: data.audio || null }),
  reset: () => set({
    step: 'idle',
    sessionId: null,
    consented: false,
    researchConsent: false,
    profile: {},
    audioBlob: null,
    fluencyText: null,
    fluencyAudio: null,
    traceData: [],
    recallText: null,
    recallAudio: null,
  })
}));
