import { create } from 'zustand';

export type UserRole = 'clinician' | 'admin' | 'patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  clinicName?: string;
  licenseNumber?: string;
  patientAge?: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginClinician: (user: Partial<User>) => void;
  loginPatient: (user: Partial<User>) => void;
  logout: () => void;
}

// Preset demo accounts for quick testing
export const DEMO_CLINICIANS: User[] = [
  {
    id: 'DR-01',
    name: 'Dr. Priya Sharma',
    role: 'clinician',
    email: 'priya.sharma@rubyhall.org',
    clinicName: 'Ruby Hall Clinic - Neuro Sciences (Pune)',
    licenseNumber: 'MCI-PN-48291',
  },
  {
    id: 'DR-02',
    name: 'Dr. Rahul Mehta',
    role: 'admin',
    email: 'admin.mehta@kem-pune.org',
    clinicName: 'KEM Hospital Memory Care Unit (Pune)',
    licenseNumber: 'MCI-PN-19342',
  },
];

export const DEMO_PATIENTS: User[] = [
  {
    id: 'PT-0001',
    name: 'Anita Deshmukh',
    role: 'patient',
    phone: '+91 98220 12345',
    patientAge: 72,
  },
  {
    id: 'PT-0002',
    name: 'Gopal Joshi',
    role: 'patient',
    phone: '+91 94220 67890',
    patientAge: 68,
  },
];

const AUTH_STORAGE_KEY = 'cognisense_auth_user';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initialUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),

  loginClinician: (doctorData) => {
    const user: User = {
      id: doctorData.id || 'DR-DEMO',
      name: doctorData.name || 'Dr. Priya Sharma',
      role: (doctorData.role as UserRole) || 'clinician',
      email: doctorData.email || 'doctor@cognisense.org',
      clinicName: doctorData.clinicName || 'Pune Memory & Aging Clinic',
      licenseNumber: doctorData.licenseNumber || 'MCI-PN-48291',
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist auth state', e);
    }
    set({ user, isAuthenticated: true });
  },

  loginPatient: (patientData) => {
    const user: User = {
      id: patientData.id || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientData.name || 'Patient Guest',
      role: 'patient',
      phone: patientData.phone,
      patientAge: patientData.patientAge || 70,
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist auth state', e);
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear auth state', e);
    }
    set({ user: null, isAuthenticated: false });
  },
}));
