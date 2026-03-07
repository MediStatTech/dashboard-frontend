import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { PatientCreate } from '../types';
import { diseasClient } from '../api/client';
import type { Diseas } from '../gen/models/v1/diseas_dash_pb';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (patient: PatientCreate) => void;
}

const emptyForm: PatientCreate = {
  first_name: '',
  last_name: '',
  gender: 'Male',
  dob: '',
  contact_info: { phone: '', email: '', primary: true },
  address: { line_1: '', city: '', state: '' },
  diseas_ids: [],
};

const inputClass =
  'border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm';

export default function AddPatientModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<PatientCreate>({ ...emptyForm });
  const [diseases, setDiseases] = useState<Diseas[]>([]);

  useEffect(() => {
    if (open) {
      diseasClient.diseasGet({}).then((res) => {
        setDiseases(res.diseases);
      }).catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateContact = (field: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value },
    }));

  const updateAddress = (field: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));

  const toggleDisease = (id: string) =>
    setForm((prev) => ({
      ...prev,
      diseas_ids: prev.diseas_ids.includes(id)
        ? prev.diseas_ids.filter((d) => d !== id)
        : [...prev.diseas_ids, id],
    }));

  const handleSave = () => {
    onSave(form);
    setForm({ ...emptyForm });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 border border-white/50">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Add Patient</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First Name"
              className={inputClass}
              value={form.first_name}
              onChange={(e) => update('first_name', e.target.value)}
            />
            <input
              placeholder="Last Name"
              className={inputClass}
              value={form.last_name}
              onChange={(e) => update('last_name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              className={inputClass}
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
            <DatePicker
              selected={form.dob ? new Date(form.dob) : null}
              onChange={(date: Date | null) =>
                update('dob', date ? date.toISOString().split('T')[0] : '')
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="Date of Birth"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
              className={inputClass + ' w-full'}
              wrapperClassName="w-full"
            />
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">Contact</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Phone"
              className={inputClass}
              value={form.contact_info.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
            />
            <input
              placeholder="Email"
              className={inputClass}
              value={form.contact_info.email}
              onChange={(e) => updateContact('email', e.target.value)}
            />
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">Address</h3>
          <input
            placeholder="Address Line 1"
            className={`${inputClass} w-full`}
            value={form.address.line_1}
            onChange={(e) => updateAddress('line_1', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="City"
              className={inputClass}
              value={form.address.city}
              onChange={(e) => updateAddress('city', e.target.value)}
            />
            <input
              placeholder="State"
              className={inputClass}
              value={form.address.state}
              onChange={(e) => updateAddress('state', e.target.value)}
            />
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">Diseases</h3>
          <div className="flex flex-wrap gap-2">
            {diseases.map((d) => {
              const selected = form.diseas_ids.includes(d.diseasId);
              return (
                <button
                  key={d.diseasId}
                  type="button"
                  onClick={() => toggleDisease(d.diseasId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
                    selected
                      ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {d.name} ({d.code})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
