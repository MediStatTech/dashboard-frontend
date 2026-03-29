import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../api/client';
import { useLocale } from '../i18n/useLocale';
import loginBg from '../assets/login.png';
import icon from '../assets/medistat_icon_transparent.png';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useLocale();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailError = emailTouched
    ? !email
      ? t.login.errors.emailRequired
      : !EMAIL_RE.test(email)
        ? t.login.errors.emailInvalid
        : ''
    : '';

  const passwordError = passwordTouched
    ? !password
      ? t.login.errors.passwordRequired
      : password.length < 6
        ? t.login.errors.passwordMin
        : ''
    : '';

  const isFormValid =
    email && EMAIL_RE.test(email) && password.length >= 6;

  const borderClass = (touched: boolean, err: string, value: string) =>
    !touched
      ? 'border-gray-200'
      : err
        ? 'border-red-500 bg-red-50/50'
        : value
          ? 'border-green-500 bg-green-50/30'
          : 'border-gray-200';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isFormValid) return;
    setError('');
    setLoading(true);
    try {
      const res = await authClient.signIn({ email, password });
      localStorage.setItem('token', res.token);
      navigate('/patients');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t.login.errors.signInFailed;
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
          <p className="text-xs text-gray-400 mt-1 tracking-wide">
            {t.login.title}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder={t.login.email}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm ${borderClass(emailTouched, emailError, email)}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1 ml-1">{emailError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder={t.login.password}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm ${borderClass(passwordTouched, passwordError, password)}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
            />
            {passwordError && (
              <p className="text-xs text-red-600 mt-1 ml-1">{passwordError}</p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg py-2.5 text-sm font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.login.submitting : t.login.submit}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <button
            onClick={toggleLang}
            className="text-xs text-gray-400 hover:text-green-600 transition-colors"
          >
            {lang === 'ua' ? 'English' : 'Українська'}
          </button>
        </div>
      </div>
    </div>
  );
}
