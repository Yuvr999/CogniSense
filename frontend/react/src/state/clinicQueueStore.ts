/**
 * CogniSense Clinician Screening Queue Store
 * 
 * Zustand store with local storage persistence to manage:
 * - Patient screening queue items
 * - Search query filtering
 * - Tab selection ('all' | 'needs-review' | 'reviewed')
 * - Clinician sign-off workflow, notes, and timestamp
 * - Ingestion of newly completed screenings from the patient flow
 * 
 * Rule 7 Compliance: Screening aid, not a diagnosis.
 */

import { create } from 'zustand';
import { updateSessionSignOff } from '../api/sessionRepository';

export interface QueueItem {
  id: string;
  patientName?: string;
  patientId?: string;
  date: string;
  age: string;
  tier: 'Low' | 'Elevated' | 'High' | 'Indeterminate';
  p: number;
  mods: string;
  qc: number;
  status: 'Needs review' | 'Reviewed';
  clinicianNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

const INITIAL_QUEUE: QueueItem[] = [
  { 
    id: '7F3A', 
    patientName: 'Ramesh Varma',
    patientId: 'PT-7F3A',
    date: 'Oct 7, 10:45 AM', 
    age: '70-74', 
    tier: 'Elevated', 
    p: 0.62, 
    mods: 'Speech, Cog, Motor', 
    qc: 1, 
    status: 'Needs review' 
  },
  { 
    id: '2B9C', 
    patientName: 'Sunita Kulkarni',
    patientId: 'PT-2B9C',
    date: 'Oct 7, 09:12 AM', 
    age: '65-69', 
    tier: 'Low', 
    p: 0.15, 
    mods: 'Speech, Cog, Motor', 
    qc: 0, 
    status: 'Reviewed',
    clinicianNotes: 'Routine screen. Speech metrics intact. Patient advised to return in 12 months for routine annual follow-up.',
    reviewedAt: 'Oct 7, 10:00 AM',
    reviewedBy: 'Dr. Priya Sharma'
  },
  { 
    id: '8E4D', 
    patientName: 'Mohan Lal',
    patientId: 'PT-8E4D',
    date: 'Oct 6, 03:30 PM', 
    age: '80-84', 
    tier: 'High', 
    p: 0.88, 
    mods: 'Speech only', 
    qc: 0, 
    status: 'Needs review' 
  },
  { 
    id: '1A5B', 
    patientName: 'Sarita Patil',
    patientId: 'PT-1A5B',
    date: 'Oct 6, 11:15 AM', 
    age: '75-79', 
    tier: 'Indeterminate', 
    p: 0.45, 
    mods: 'Speech, Cog, Motor', 
    qc: 2, 
    status: 'Needs review' 
  }
];

const QUEUE_STORAGE_KEY = 'cognisense_clinic_queue_items';

function loadStoredQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return INITIAL_QUEUE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_QUEUE;
  } catch {
    return INITIAL_QUEUE;
  }
}

function persistQueue(items: QueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to persist clinic queue', e);
  }
}

interface ClinicQueueState {
  items: QueueItem[];
  searchQuery: string;
  activeTab: 'all' | 'needs-review' | 'reviewed';
  
  // Actions
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: 'all' | 'needs-review' | 'reviewed') => void;
  signOffSession: (id: string, notes: string, doctorName?: string) => void;
  addSession: (item: QueueItem) => void;
  deleteSession: (id: string) => void;
  resetQueue: () => void;
  
  // Computed helpers
  getFilteredItems: () => QueueItem[];
}

export const useClinicQueueStore = create<ClinicQueueState>((set, get) => ({
  items: loadStoredQueue(),
  searchQuery: '',
  activeTab: 'needs-review',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveTab: (activeTab) => set({ activeTab }),

  signOffSession: (id, notes, doctorName = 'Dr. Priya Sharma') => {
    const current = get().items;
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const updated = current.map(item => {
      if (item.id.toUpperCase() === id.toUpperCase()) {
        return {
          ...item,
          status: 'Reviewed' as const,
          clinicianNotes: notes,
          reviewedAt: formattedDate,
          reviewedBy: doctorName
        };
      }
      return item;
    });

    // Also update sessionRepository so session details and patient portal stay in sync
    updateSessionSignOff(id, notes, doctorName, formattedDate);

    persistQueue(updated);
    set({ items: updated });
  },

  addSession: (newItem) => {
    const current = get().items;
    // Check if session ID already exists
    const exists = current.some(i => i.id.toUpperCase() === newItem.id.toUpperCase());
    const updated = exists 
      ? current.map(i => i.id.toUpperCase() === newItem.id.toUpperCase() ? newItem : i)
      : [newItem, ...current];
    
    persistQueue(updated);
    set({ items: updated });
  },

  deleteSession: (id) => {
    const current = get().items;
    const updated = current.filter(i => i.id.toUpperCase() !== id.toUpperCase());
    persistQueue(updated);
    set({ items: updated });
  },

  resetQueue: () => {
    persistQueue(INITIAL_QUEUE);
    set({ items: INITIAL_QUEUE, searchQuery: '', activeTab: 'needs-review' });
  },

  getFilteredItems: () => {
    const { items, searchQuery, activeTab } = get();
    const q = searchQuery.trim().toLowerCase();

    return items.filter(item => {
      // Tab filter
      if (activeTab === 'needs-review' && item.status !== 'Needs review') return false;
      if (activeTab === 'reviewed' && item.status !== 'Reviewed') return false;

      // Search filter
      if (q) {
        const matchId = item.id.toLowerCase().includes(q);
        const matchPatient = (item.patientName || '').toLowerCase().includes(q);
        const matchAge = item.age.toLowerCase().includes(q);
        const matchTier = item.tier.toLowerCase().includes(q);
        const matchMods = item.mods.toLowerCase().includes(q);
        const matchStatus = item.status.toLowerCase().includes(q);
        return matchId || matchPatient || matchAge || matchTier || matchMods || matchStatus;
      }

      return true;
    });
  }
}));
