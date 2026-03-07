import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from '@bufbuild/protobuf';
import TopBar from '../components/TopBar';
import AddPatientModal from '../components/AddPatientModal';
import { staffClient, patientClient } from '../api/client';
import { Patient_CreateSchema } from '../gen/models/v1/patient_dash_pb';
import type { Staff_Read } from '../gen/models/v1/staff_dash_pb';
import type { PatientCreate } from '../types';
import mainBg from '../assets/main.png';

export default function DoctorProfilePage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff_Read | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    staffClient.staffRetrieve({}).then((res) => {
      if (res.staff) setStaff(res.staff);
    }).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
    });
  }, []);

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
      navigate('/patients');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create patient';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
      <TopBar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/patients')}
          className="text-sm text-green-600 hover:text-green-800 font-medium mb-5 inline-flex items-center gap-1 transition-colors"
        >
          &larr; Back to Patients
        </button>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        {staff && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-green-100">
                {staff.firstName[0]}
                {staff.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Dr. {staff.firstName} {staff.lastName}
                </h2>
                {staff.position && (
                  <p className="text-sm text-gray-500 mt-0.5">{staff.position.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-8">
              <div className="bg-gray-50/80 rounded-lg p-4">
                <span className="text-gray-400 text-xs block mb-1">Email</span>
                <span className="text-gray-700 font-medium">{staff.email}</span>
              </div>
              <div className="bg-gray-50/80 rounded-lg p-4">
                <span className="text-gray-400 text-xs block mb-1">Status</span>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    staff.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {staff.status}
                </span>
              </div>
              {staff.position && (
                <div className="bg-gray-50/80 rounded-lg p-4">
                  <span className="text-gray-400 text-xs block mb-1">Position</span>
                  <span className="text-gray-700 font-medium">{staff.position.name}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              + Add Patient
            </button>
          </div>
        )}
      </main>

      <AddPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddPatient}
      />
    </div>
  );
}
