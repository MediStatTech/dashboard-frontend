import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../api/client';
import loginBg from '../assets/login.png';
import icon from '../assets/medistat_icon_transparent.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authClient.signIn({ email, password });
      localStorage.setItem('token', res.token);
      navigate('/patients');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-sm border border-white/50">
        <div className="flex flex-col items-center mb-8">
          <img
            src={icon}
            alt="MediStat"
            className="w-16 h-16 drop-shadow-lg mb-3"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            MediStat
          </h1>
          <p className="text-xs text-gray-400 mt-1 tracking-wide">Medical Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
