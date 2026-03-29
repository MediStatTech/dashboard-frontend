import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffClient } from '../api/client';
import type { Staff_Read } from '../gen/models/v1/staff_dash_pb';
import { useLocale } from '../i18n/useLocale';
import icon from '../assets/medistat_icon_transparent.png';

export default function TopBar() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff_Read | null>(null);
  const { lang, toggleLang } = useLocale();

  useEffect(() => {
    staffClient.staffRetrieve({}).then((res) => {
      if (res.staff) setStaff(res.staff);
    }).catch(() => {});
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-green-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => navigate('/patients')}
      >
        <img
          src={icon}
          alt="MediStat"
          className="w-9 h-9 drop-shadow-md group-hover:scale-110 transition-transform duration-200"
        />
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
          MediStat
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="px-2.5 py-1 rounded-full border border-green-300 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors duration-200"
        >
          {lang === 'ua' ? 'EN' : 'UA'}
        </button>
        {staff && (
          <button
            onClick={() => navigate('/doctor')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-sm text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200 shadow-sm"
          >
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
              {staff.firstName[0]}{staff.lastName[0]}
            </span>
            Dr. {staff.firstName} {staff.lastName}
          </button>
        )}
      </div>
    </header>
  );
}
