import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (room: { number: string; floor: number; department: string; room_type: string }) => void;
}

const inputClass =
  'border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm';

const emptyForm = { number: '', floor: 1, department: '', room_type: 'general' };

export default function AddRoomModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...emptyForm });

  if (!open) return null;

  const handleSave = () => {
    // TODO: Replace with real API call when room-service backend is ready
    // await roomClient.roomCreate({ room: create(Room_CreateSchema, { ... }) });
    onSave(form);
    setForm({ ...emptyForm });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-7 border border-white/50">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Add Room</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Room Number"
              className={inputClass}
              value={form.number}
              onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
            />
            <input
              placeholder="Floor"
              type="number"
              min={1}
              className={inputClass}
              value={form.floor}
              onChange={(e) => setForm((p) => ({ ...p, floor: Number(e.target.value) }))}
            />
          </div>

          <input
            placeholder="Department"
            className={`${inputClass} w-full`}
            value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
          />

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Room Type</h3>
            <div className="flex flex-wrap gap-2">
              {(['general', 'icu', 'surgery', 'recovery'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, room_type: t }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border capitalize ${
                    form.room_type === t
                      ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t === 'icu' ? 'ICU' : t}
                </button>
              ))}
            </div>
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
