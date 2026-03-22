import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import AddRoomModal from '../components/AddRoomModal';
import type { RoomListItem } from '../types';
import mainBg from '../assets/main.png';

// TODO: Replace mock imports with real API client when room-service backend is ready
// import { roomClient } from '../api/client';
import { mockRoomsList } from '../data/mock';

const STATUS_STYLES: Record<string, string> = {
  occupied: 'bg-blue-100 text-blue-700',
  free: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
};

const ROOM_TYPE_LABELS: Record<string, string> = {
  icu: 'ICU',
  general: 'General',
  surgery: 'Surgery',
  recovery: 'Recovery',
};

export default function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchRooms = useCallback(async () => {
    try {
      // TODO: Replace with real API call when room-service backend is ready
      // const res = await roomClient.roomGet({});
      // setRooms(res.rooms);
      setRooms(mockRoomsList);
      setError('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load rooms';
      setError(message);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  const handleAddRoom = async (data: { number: string; floor: number; department: string; room_type: string }) => {
    // TODO: Replace with real API call when room-service backend is ready
    // await roomClient.roomCreate({ room: { number: data.number, floor: data.floor, ... } });
    const newRoom: RoomListItem = {
      room_id: `room-${Date.now()}`,
      number: data.number,
      floor: data.floor,
      department: data.department,
      room_type: data.room_type,
      status: 'free',
      equipment_count: 0,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${mainBg})` }}>
      <TopBar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 drop-shadow-sm">Rooms</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            + Add Room
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/50">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-50/80 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Room</th>
                <th className="px-5 py-3.5 font-semibold">Floor</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Patient</th>
                <th className="px-5 py-3.5 font-semibold">Equipment</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {rooms.map((r) => (
                <tr
                  key={r.room_id}
                  className="hover:bg-green-50/50 cursor-pointer transition-all duration-150"
                  onClick={() => navigate(`/rooms/${r.room_id}`)}
                >
                  <td className="px-5 py-4 font-medium text-gray-800">#{r.number}</td>
                  <td className="px-5 py-4 text-gray-600">{r.floor}</td>
                  <td className="px-5 py-4 text-gray-600">{r.department}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {ROOM_TYPE_LABELS[r.room_type] || r.room_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {r.patient_name || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{r.equipment_count}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <AddRoomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddRoom}
      />
    </div>
  );
}
