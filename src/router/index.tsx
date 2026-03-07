import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PatientsPage from '../pages/PatientsPage';
import PatientDetailPage from '../pages/PatientDetailPage';
import DoctorProfilePage from '../pages/DoctorProfilePage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/patients', element: <PatientsPage /> },
  { path: '/patients/:id', element: <PatientDetailPage /> },
  { path: '/doctor', element: <DoctorProfilePage /> },
]);
