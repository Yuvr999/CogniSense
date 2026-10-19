import { Routes, Route } from 'react-router-dom';
import { Styleguide } from '../pages/Styleguide';
import { Landing } from '../pages/Landing';
import { Screen } from '../pages/Screen';
import { Queue, Session } from '../components/clinic';
import { Evidence } from '../pages/Evidence';
import { Fairness } from '../pages/Fairness';
import { Privacy } from '../pages/Privacy';
import { ClinicFinder } from '../pages/ClinicFinder';
import { DigitalTwin } from '../pages/DigitalTwin';
import { ClinicLogin } from '../pages/ClinicLogin';
import { PatientLogin } from '../pages/PatientLogin';
import { PatientPortal } from '../pages/PatientPortal';
import { ClinicianRoute, PatientRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login/clinic" element={<ClinicLogin />} />
      <Route path="/login/doctor" element={<ClinicLogin />} />
      <Route path="/login/admin" element={<ClinicLogin />} />
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/clinics" element={<ClinicFinder />} />
      <Route path="/find-clinic" element={<ClinicFinder />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/styleguide" element={<Styleguide />} />

      {/* Patient Portal & Screen Flow (Protected) */}
      <Route
        path="/patient"
        element={
          <PatientRoute>
            <PatientPortal />
          </PatientRoute>
        }
      />
      <Route
        path="/screen"
        element={
          <PatientRoute>
            <Screen />
          </PatientRoute>
        }
      />

      {/* Clinic Doctor & Admin Portal (Protected) */}
      <Route
        path="/clinic"
        element={
          <ClinicianRoute>
            <Queue />
          </ClinicianRoute>
        }
      />
      <Route
        path="/clinic/session/:id"
        element={
          <ClinicianRoute>
            <Session />
          </ClinicianRoute>
        }
      />
      <Route
        path="/twin"
        element={
          <ClinicianRoute>
            <DigitalTwin />
          </ClinicianRoute>
        }
      />
      <Route
        path="/clinician"
        element={
          <ClinicianRoute>
            <DigitalTwin />
          </ClinicianRoute>
        }
      />
      <Route
        path="/evidence"
        element={
          <ClinicianRoute>
            <Evidence />
          </ClinicianRoute>
        }
      />
      <Route
        path="/evidence/fairness"
        element={
          <ClinicianRoute>
            <Fairness />
          </ClinicianRoute>
        }
      />
      <Route
        path="/fairness"
        element={
          <ClinicianRoute>
            <Fairness />
          </ClinicianRoute>
        }
      />
    </Routes>
  );
}
