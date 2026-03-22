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
import type { RoomRead } from '../types';
import mainBg from '../assets/main.png';

// TODO: Replace mock imports with real API client when room-service backend is ready
// import { roomClient } from '../api/client';
import { mockRoomDetails } from '../data/mock';

const CHART_COLORS = [
  { stroke: '#2563eb', fill: '#bfdbfe' }, // Blue — ventilator
  { stroke: '#16a34a', fill: '#bbf7d0' }, // Green — infusion pump
  { stroke: '#dc2626', fill: '#fecaca' }, // Red — cardiac monitor
  { stroke: '#ca8a04', fill: '#fef08a' }, // Yellow — oxygen concentrator
];

const EQUIPMENT_ICONS: Record<string, string> = {
  ventilator: 'IVL',
  infusion_pump: 'PUMP',
  cardiac_monitor: 'ECG',
  oxygen_concentrator: 'O2',
};

const STATUS_STYLES: Record<string, string> = {
  occupied: 'bg-blue-100 text-blue-700',
  free: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomRead | null>(null);
  const [error, setError] = useState('');

  const fetchRoom = useCallback(async () => {
    if (!id) return;
    try {
      // TODO: Replace with real API call when room-service backend is ready
      // const res = await roomClient.roomRetrieve({ roomId: id });
      // if (res.room) { setRoom(res.room); setError(''); }
      const data = mockRoomDetails[id];
      if (data) {
        setRoom(data);
        setError('');
      } else {
        setError('Room not found');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load room';
      setError(message);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
    // TODO: Enable polling when backend is ready (equipment metrics update in real-time)
    // const interval = setInterval(fetchRoom, 1000);
    // return () => clearInterval(interval);
  }, [fetchRoom]);

  const handleHospitalize = async () => {
    // TODO: Replace with real API call
    // await roomClient.roomAdmitPatient({ roomId: id, patientId: selectedPatientId });
    alert('TODO: Implement hospitalization when backend is ready');
  };

  const handleDischarge = async () => {
    // TODO: Replace with real API call
    // await roomClient.roomDischargePatient({ roomId: id, patientId: room?.patient?.patient_id });
    alert('TODO: Implement discharge when backend is ready');
  };

  if (error && !room) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
        <TopBar />
        <main className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-red-600 bg-red-50 rounded-lg px-3 py-2 text-sm">{error}</p>
        </main>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
        <TopBar />
        <main className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
      <TopBar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/rooms')}
          className="text-sm text-green-600 hover:text-green-800 font-medium mb-5 inline-flex items-center gap-1 transition-colors"
        >
          &larr; Back to Rooms
        </button>

        {/* Room info header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-5 border border-white/50">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {room.number}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Room #{room.number}</h2>
                <p className="text-sm text-gray-500">
                  Floor {room.floor} · {room.department}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                STATUS_STYLES[room.status] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {room.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50/80 rounded-lg p-3">
              <span className="text-gray-400 text-xs block mb-0.5">Type</span>
              <span className="text-gray-700 font-medium capitalize">{room.room_type}</span>
            </div>
            <div className="bg-gray-50/80 rounded-lg p-3">
              <span className="text-gray-400 text-xs block mb-0.5">Equipment</span>
              <span className="text-gray-700 font-medium">{room.equipment.length} devices</span>
            </div>
            <div className="bg-gray-50/80 rounded-lg p-3">
              <span className="text-gray-400 text-xs block mb-0.5">Department</span>
              <span className="text-gray-700 font-medium">{room.department}</span>
            </div>
          </div>
        </div>

        {/* Patient info or hospitalize button */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-5 border border-white/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Patient</h3>
          {room.patient ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {room.patient.first_name[0]}{room.patient.last_name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {room.patient.first_name} {room.patient.last_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Admitted: {new Date(room.patient.admitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDischarge}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 shadow-sm"
              >
                Discharge
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">No patient assigned</p>
              <button
                onClick={handleHospitalize}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 shadow-md transition-all duration-200"
              >
                Hospitalize Patient
              </button>
            </div>
          )}
        </div>

        {/* Equipment & Charts */}
        {room.equipment.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/50">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Life Support Equipment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {room.equipment.map((eq, idx) => {
                const color = CHART_COLORS[idx % CHART_COLORS.length];
                const chartData = eq.metrics.map((m) => ({
                  time: new Date(m.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }),
                  value: Math.round(m.value * 100) / 100,
                }));
                const latest = eq.metrics.length > 0 ? eq.metrics[eq.metrics.length - 1] : null;

                return (
                  <div
                    key={eq.equipment_id}
                    className="bg-white/90 border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: color.stroke }}
                        >
                          {EQUIPMENT_ICONS[eq.equipment_type] || '?'}
                        </span>
                        <span className="text-sm font-bold text-gray-800">{eq.name}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          eq.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {eq.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-3">
                      {latest ? (
                        <span className="text-2xl font-bold" style={{ color: color.stroke }}>
                          {latest.value.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-2xl font-bold text-gray-300">—</span>
                      )}
                      <span className="text-xs text-gray-400 font-medium">
                        {eq.unit_symbol} · {eq.metric_name}
                      </span>
                    </div>

                    {chartData.length > 1 ? (
                      <div className="h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                            <defs>
                              <linearGradient id={`grad-${eq.equipment_id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color.fill} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={color.fill} stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                              dataKey="time"
                              tick={{ fontSize: 10, fill: '#9ca3af' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fill: '#9ca3af' }}
                              axisLine={false}
                              tickLine={false}
                              domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                              formatter={(val: number) => [
                                `${val.toFixed(2)} ${eq.unit_symbol}`,
                                eq.metric_name,
                              ]}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={color.stroke}
                              strokeWidth={2}
                              fill={`url(#grad-${eq.equipment_id})`}
                              dot={{ r: 3, fill: color.stroke, strokeWidth: 0 }}
                              activeDot={{ r: 5, fill: color.stroke, strokeWidth: 2, stroke: '#fff' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-28 flex items-center justify-center text-gray-300 text-sm">
                        No metrics available
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
