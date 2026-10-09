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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/twin" element={<DigitalTwin />} />
      <Route path="/clinician" element={<DigitalTwin />} />
      <Route path="/styleguide" element={<Styleguide />} />
      <Route path="/screen" element={<Screen />} />
      <Route path="/clinic" element={<Queue />} />
      <Route path="/clinic/session/:id" element={<Session />} />
      <Route path="/clinics" element={<ClinicFinder />} />
      <Route path="/find-clinic" element={<ClinicFinder />} />
      <Route path="/evidence" element={<Evidence />} />
      <Route path="/evidence/fairness" element={<Fairness />} />
      <Route path="/fairness" element={<Fairness />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}
