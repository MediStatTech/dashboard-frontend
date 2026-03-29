import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import TopBar from '../components/TopBar';
import { patientClient } from '../api/client';
import type { Patient_Read } from '../gen/models/v1/patient_dash_pb';
import { useLocale } from '../i18n/useLocale';
import mainBg from '../assets/main.png';

const CHART_COLORS = [
  { stroke: '#16a34a', fill: '#bbf7d0' },
  { stroke: '#dc2626', fill: '#fecaca' },
  { stroke: '#ca8a04', fill: '#fef08a' },
  { stroke: '#2563eb', fill: '#bfdbfe' },
];

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [patient, setPatient] = useState<Patient_Read | null>(null);
  const [error, setError] = useState('');

  const fetchPatient = useCallback(async () => {
    if (!id) return;
    try {
      const res = await patientClient.patientRetrieve({ patientId: id });
      if (res.patient) {
        setPatient(res.patient);
        setError('');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load patient';
      setError(message);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
    const interval = setInterval(fetchPatient, 1000);
    return () => clearInterval(interval);
  }, [fetchPatient]);

  if (error && !patient) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
        <TopBar />
        <main className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-red-600 bg-red-50 rounded-lg px-3 py-2 text-sm">{error}</p>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
        <TopBar />
        <main className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-gray-500">{t.patientDetail.loading}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
      <TopBar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/patients')}
          className="text-sm text-green-600 hover:text-green-800 font-medium mb-5 inline-flex items-center gap-1 transition-colors"
        >
          &larr; {t.patientDetail.back}
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-5 border border-white/50">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {patient.firstName} {patient.lastName}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                patient.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {patient.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50/80 rounded-lg p-3">
              <span className="text-gray-400 text-xs block mb-0.5">Gender</span>
              <span className="text-gray-700 font-medium">{patient.gender}</span>
            </div>
            <div className="bg-gray-50/80 rounded-lg p-3">
              <span className="text-gray-400 text-xs block mb-0.5">Date of Birth</span>
              <span className="text-gray-700 font-medium">{patient.dob}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {patient.contactInfo && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/50 hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t.patientDetail.contact}</h3>
              <p className="text-sm text-gray-700 font-medium">{patient.contactInfo.phone}</p>
              <p className="text-sm text-gray-500 mt-1">{patient.contactInfo.email}</p>
            </div>
          )}
          {patient.address && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/50 hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t.patientDetail.address}</h3>
              <p className="text-sm text-gray-700 font-medium">{patient.address.line1}</p>
              <p className="text-sm text-gray-500 mt-1">
                {patient.address.city}, {patient.address.state}
              </p>
            </div>
          )}
        </div>

        {patient.diseases.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-5 border border-white/50">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t.patientDetail.diseases}</h3>
            <div className="flex flex-wrap gap-2">
              {patient.diseases.map((d) => (
                <span
                  key={d.diseasId}
                  className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold shadow-sm border border-red-100"
                >
                  {d.name} ({d.code})
                </span>
              ))}
            </div>
          </div>
        )}

        {patient.sensors.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/50">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Sensors</h3>
            <div className="grid grid-cols-2 gap-4">
              {patient.sensors.map((s, idx) => {
                const color = CHART_COLORS[idx % CHART_COLORS.length];
                const chartData = [...s.metrics]
                  .reverse()
                  .map((m) => ({
                    time: m.createdAt
                      ? new Date(Number(m.createdAt.seconds) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '',
                    value: Math.round(m.value * 100) / 100,
                  }));
                const latest = s.metrics[0];

                return (
                  <div
                    key={s.sensorId}
                    className="bg-white/90 border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-800">
                        {s.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-3">
                      {latest && (
                        <span className="text-2xl font-bold" style={{ color: color.stroke }}>
                          {(Math.round(latest.value * 100) / 100).toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 font-medium">{s.symbol}</span>
                    </div>

                    {chartData.length > 1 && (
                      <div className="h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                            <defs>
                              <linearGradient id={`grad-${s.sensorId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color.fill} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={color.fill} stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip
                              contentStyle={{ borderRadius: '0.5rem', fontSize: '0.75rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              formatter={(val: number) => [`${(Math.round(val * 100) / 100).toFixed(2)} ${s.symbol}`, s.name]}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={color.stroke}
                              strokeWidth={2}
                              fill={`url(#grad-${s.sensorId})`}
                              dot={{ r: 3, fill: color.stroke, strokeWidth: 0 }}
                              activeDot={{ r: 5, fill: color.stroke, strokeWidth: 2, stroke: '#fff' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
