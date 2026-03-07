import type { Interceptor } from '@connectrpc/connect';
import { createClient } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { AuthService } from '../gen/services/v1/auth_dash_pb';
import { PatientService } from '../gen/services/v1/patient_dash_pb';
import { StaffService } from '../gen/services/v1/staff_dash_pb';
import { DiseasService } from '../gen/services/v1/diseas_dash_pb';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const authInterceptor: Interceptor = (next) => (req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.header.set('Authorization', `Bearer ${token}`);
  }
  return next(req);
};

const transport = createGrpcWebTransport({
  baseUrl: API_BASE_URL,
  interceptors: [authInterceptor],
});

export const authClient = createClient(AuthService, transport);
export const patientClient = createClient(PatientService, transport);
export const staffClient = createClient(StaffService, transport);
export const diseasClient = createClient(DiseasService, transport);
