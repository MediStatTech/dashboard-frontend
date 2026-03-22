import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PatientsPage from '../pages/PatientsPage';
import PatientDetailPage from '../pages/PatientDetailPage';
import DoctorProfilePage from '../pages/DoctorProfilePage';
import RoomsPage from '../pages/RoomsPage';
import RoomDetailPage from '../pages/RoomDetailPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/patients', element: <PatientsPage /> },
  { path: '/patients/:id', element: <PatientDetailPage /> },
  { path: '/rooms', element: <RoomsPage /> },
  { path: '/rooms/:id', element: <RoomDetailPage /> },
  { path: '/doctor', element: <DoctorProfilePage /> },
]);
