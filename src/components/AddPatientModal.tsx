import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { PatientCreate } from '../types';
import { diseasClient } from '../api/client';
import type { Diseas } from '../gen/models/v1/diseas_dash_pb';
import { useLocale } from '../i18n/useLocale';

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+380\d{9}$/;

type Touched = Record<string, boolean>;

export default function AddPatientModal({ open, onClose, onSave }: Props) {
  const { t } = useLocale();
  const [form, setForm] = useState<PatientCreate>({ ...emptyForm });
  const [diseases, setDiseases] = useState<Diseas[]>([]);
  const [touched, setTouched] = useState<Touched>({});

  useEffect(() => {
    if (open) {
      diseasClient.diseasGet({}).then((res) => {
        setDiseases(res.diseases);
      }).catch(() => {});
      setForm({ ...emptyForm });
      setTouched({});
    }
  }, [open]);

  if (!open) return null;

  const touch = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

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

  const toggleDisease = (id: string) => {
    touch('diseases');
    setForm((prev) => ({
      ...prev,
      diseas_ids: prev.diseas_ids.includes(id)
        ? prev.diseas_ids.filter((d) => d !== id)
        : [...prev.diseas_ids, id],
    }));
  };

  // Validation
  const errors: Record<string, string> = {};
  if (!form.first_name || form.first_name.length < 2)
    errors.first_name = t.modal.errors.firstNameMin;
  if (!form.last_name || form.last_name.length < 2)
    errors.last_name = t.modal.errors.lastNameMin;
  if (!form.dob) errors.dob = t.modal.errors.dobRequired;
  if (!form.contact_info.phone) errors.phone = t.modal.errors.phoneRequired;
  else if (!PHONE_RE.test(form.contact_info.phone))
    errors.phone = t.modal.errors.phoneFormat;
  if (
    form.contact_info.email &&
    !EMAIL_RE.test(form.contact_info.email)
  )
    errors.email = t.modal.errors.emailInvalid;
  if (form.diseas_ids.length === 0)
    errors.diseases = t.modal.errors.diseasesRequired;

  const isFormValid = Object.keys(errors).length === 0;

  const inputCls = (field: string) => {
    const base =
      'border rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm';
    if (!touched[field]) return `${base} border-gray-200`;
    if (errors[field]) return `${base} border-red-500 bg-red-50/50`;
    return `${base} border-green-500 bg-green-50/30`;
  };

  const fieldError = (field: string) =>
    touched[field] && errors[field] ? (
      <p className="text-xs text-red-600 mt-1 ml-1">{errors[field]}</p>
    ) : null;

  const handleSave = () => {
    // Touch all fields
    const allTouched: Touched = {
      first_name: true, last_name: true, dob: true,
      phone: true, email: true, diseases: true,
    };
    setTouched(allTouched);
    if (!isFormValid) return;
    onSave(form);
    setForm({ ...emptyForm });
    setTouched({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 border border-white/50">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {t.modal.title}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                placeholder={t.modal.firstName + ' *'}
                className={inputCls('first_name')}
                value={form.first_name}
                onChange={(e) => update('first_name', e.target.value)}
                onBlur={() => touch('first_name')}
              />
              {fieldError('first_name')}
            </div>
            <div>
              <input
                placeholder={t.modal.lastName + ' *'}
                className={inputCls('last_name')}
                value={form.last_name}
                onChange={(e) => update('last_name', e.target.value)}
                onBlur={() => touch('last_name')}
              />
              {fieldError('last_name')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              className={inputCls('gender') + ' border-gray-200'}
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
            >
              <option value="Male">{t.modal.male}</option>
              <option value="Female">{t.modal.female}</option>
            </select>
            <div>
              <DatePicker
                selected={form.dob ? new Date(form.dob) : null}
                onChange={(date: Date | null) => {
                  update('dob', date ? date.toISOString().split('T')[0] : '');
                  touch('dob');
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText={t.modal.dob + ' *'}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                className={inputCls('dob') + ' w-full'}
                wrapperClassName="w-full"
              />
              {fieldError('dob')}
            </div>
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">
            {t.patientDetail.contact}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                placeholder={t.modal.phone + ' *'}
                className={inputCls('phone')}
                value={form.contact_info.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                onBlur={() => touch('phone')}
              />
              {fieldError('phone')}
            </div>
            <div>
              <input
                placeholder={t.modal.email}
                className={inputCls('email')}
                value={form.contact_info.email}
                onChange={(e) => updateContact('email', e.target.value)}
                onBlur={() => touch('email')}
              />
              {fieldError('email')}
            </div>
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">
            {t.modal.address}
          </h3>
          <input
            placeholder={t.modal.line1}
            className={inputCls('line1') + ' w-full border-gray-200'}
            value={form.address.line_1}
            onChange={(e) => updateAddress('line_1', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder={t.modal.city}
              className={inputCls('city') + ' border-gray-200'}
              value={form.address.city}
              onChange={(e) => updateAddress('city', e.target.value)}
            />
            <input
              placeholder={t.modal.state}
              className={inputCls('state') + ' border-gray-200'}
              value={form.address.state}
              onChange={(e) => updateAddress('state', e.target.value)}
            />
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">
            {t.modal.diseases} *
          </h3>
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
          {fieldError('diseases')}
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {t.modal.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.modal.save}
          </button>
        </div>
      </div>
    </div>
  );
}
