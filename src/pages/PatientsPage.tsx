import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from '@bufbuild/protobuf';
import TopBar from '../components/TopBar';
import AddPatientModal from '../components/AddPatientModal';
import { patientClient } from '../api/client';
import { Patient_CreateSchema } from '../gen/models/v1/patient_dash_pb';
import type { Patient_ListItem } from '../gen/models/v1/patient_dash_pb';
import type { PatientCreate } from '../types';
import mainBg from '../assets/main.png';

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient_ListItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchPatients = useCallback(async () => {
    try {
      const res = await patientClient.patientGet({});
      setPatients(res.patients);
      setError('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load patients';
      setError(message);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 3000);
    return () => clearInterval(interval);
  }, [fetchPatients]);

  const handleAddPatient = async (data: PatientCreate) => {
    try {
      await patientClient.patientCreate({
        patient: create(Patient_CreateSchema, {
          firstName: data.first_name,
          lastName: data.last_name,
          gender: data.gender,
          dob: data.dob,
          contactInfo: {
            phone: data.contact_info.phone,
            email: data.contact_info.email,
            primary: data.contact_info.primary,
          },
          address: {
            line1: data.address.line_1,
            city: data.address.city,
            state: data.address.state,
          },
          diseasIds: data.diseas_ids,
        }),
      });
      await fetchPatients();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create patient';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
      <TopBar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 drop-shadow-sm">Patients</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            + Add Patient
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/50">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-50/80 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Gender</th>
                <th className="px-5 py-3.5 font-semibold">Date of Birth</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {patients.map((p) => (
                <tr
                  key={p.patientId}
                  className="hover:bg-green-50/50 cursor-pointer transition-all duration-150"
                  onClick={() => navigate(`/patients/${p.patientId}`)}
                >
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.gender}</td>
                  <td className="px-5 py-4 text-gray-600">{p.dob}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        p.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <AddPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddPatient}
      />
    </div>
  );
}
