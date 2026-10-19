import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that only permits authenticated Clinicians or Administrators.
 * Unauthenticated users are redirected to /login/clinic.
 * Patients attempting to access clinical portals are blocked and redirected to /patient.
 */
export function ClinicianRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login/clinic" state={{ from: location }} replace />;
  }

  if (user.role === 'patient') {
    // Patients cannot access clinician tools or queue
    return <Navigate to="/patient" replace />;
  }

  return <>{children}</>;
}

/**
 * Route guard for Patient Portal and Screening features.
 * Unauthenticated users are redirected to /login/patient.
 * Clinicians can inspect patient features with preview capability.
 */
export function PatientRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login/patient" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
