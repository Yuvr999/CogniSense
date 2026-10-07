import { Routes, Route } from 'react-router-dom';
import { Styleguide } from '../pages/Styleguide';
import { Landing } from '../pages/Landing';
import { Screen } from '../pages/Screen';
import { Queue, Session } from '../components/clinic';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/styleguide" element={<Styleguide />} />
      <Route path="/screen" element={<Screen />} />
      <Route path="/clinic" element={<Queue />} />
      <Route path="/clinic/session/:id" element={<Session />} />
    </Routes>
  );
}
