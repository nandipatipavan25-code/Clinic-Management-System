import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { ROLE_CONFIG } from '../../utils/roleConfig';

const ROLES = [
  { id: 'senior_doctor', label: 'Senior Doctor', badge: 'Admin', icon: '🩺', defaultEmail: 'seniordoctor@clinic.com' },
  { id: 'doctor',        label: 'Doctor',        badge: 'Doctor', icon: '👨‍⚕️', defaultEmail: 'doctor@clinic.com' },
  { id: 'receptionist',  label: 'Receptionist',  badge: 'Front Desk', icon: '📋', defaultEmail: 'receptionist@clinic.com' },
  { id: 'technician',    label: 'Technician',    badge: 'Lab / Scan', icon: '🔬', defaultEmail: 'technician@clinic.com' },
  { id: 'patient',       label: 'Patient',       badge: 'Patient', icon: '👤', defaultEmail: 'patient@clinic.com' },
];

const SignInPage = () => {
  const [role, setRole]         = useState('doctor');
  const [email, setEmail]       = useState('doctor@clinic.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const { setAuth }             = useAuthStore();
  const navigate                = useNavigate();
  const location                = useLocation();

  const currentRole = ROLES.find(r => r.id === role) || ROLES[1];

  const handleRoleSelect = (selectedId) => {
    setRole(selectedId);
    setError(null);
    const target = ROLES.find(r => r.id === selectedId);
    // If email is empty or matches one of the preset emails, auto-populate the selected role's email
    const isPresetEmail = !email || ROLES.some(r => r.defaultEmail === email);
    if (isPresetEmail && target) {
      setEmail(target.defaultEmail);
    }
    if (!password) {
      setPassword('123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true);

    try {
      // Direct login: any email with password 123 logs in directly to the chosen role
      const res = await authApi.login(email, password, role);
      setAuth(res.user, res.access);
      const cfg = ROLE_CONFIG[res.user.role];
      const from = (location.state?.from?.pathname && !location.state?.from?.pathname.startsWith('/dashboard/'))
        ? location.state.from.pathname
        : (cfg ? cfg.dashboardRoute : '/login');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Tip: Use password 123 for demo login.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (cred) => {
    setLoading(true); setError(null);
    try {
      const res  = await authApi.googleLogin(cred.credential);
      setAuth(res.user, res.access);
      const cfg  = ROLE_CONFIG[res.user.role];
      const from = location.state?.from?.pathname || (cfg ? cfg.dashboardRoute : '/login');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Account not found. Contact your administrator.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(160deg,#020b18 0%,#041530 50%,#071e45 100%)' }}>

      <button onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Home
      </button>

      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/50 mb-3"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/>
            </svg>
          </div>
          <p className="text-white font-black text-2xl tracking-tight">Smart Clinic</p>
          <p className="text-white/40 text-xs mt-1">
            Select a role and sign in with password 123
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(8,22,52,0.95)', boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,#1d4ed8,#0ea5e9,#a78bfa)' }} />

          <div className="p-6 sm:p-8">
            {/* ── Role Selector ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Select Role
                </label>
                <span className="text-[11px] text-cyan-400 font-medium">
                  Active: {currentRole.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLES.map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`relative flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-400 bg-blue-500/20 text-white shadow-md shadow-blue-900/40'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg leading-none">{r.icon}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate leading-tight">{r.label}</p>
                        <p className="text-[10px] text-white/40 truncate">{r.badge}</p>
                      </div>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Demo Notice Pill ── */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-5 border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs">
              <span className="text-base">⚡</span>
              <div className="leading-tight">
                <span className="font-semibold text-white">Direct Login:</span> Any email with password <span className="font-mono font-bold text-cyan-200">123</span> can sign in as {currentRole.label}.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={`e.g. ${currentRole.defaultEmail} or any@email.com`}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border border-white/10 focus:border-blue-500/60 transition-colors placeholder-white/20"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-cyan-400/80 font-mono">Use: 123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="123"
                    required
                    className="w-full rounded-xl pl-4 pr-11 py-3 text-sm text-white outline-none border border-white/10 focus:border-blue-500/60 transition-colors placeholder-white/20 font-mono"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs transition-colors p-1"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && <ErrorBox msg={error} />}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm mt-1 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' }}
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as {currentRole.label}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/25 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed.')}
                useOneTap={false}
                shape="rectangular"
                theme="filled_blue"
                size="large"
                text="signin_with"
                width="320"
              />
            </div>

            <p className="text-center text-white/20 text-xs mt-6">
              Need a patient registration?{' '}
              <button onClick={() => navigate('/signup')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign Up</button>
            </p>
          </div>
        </div>
        <p className="text-center text-white/15 text-xs mt-5">🔒 256-bit encrypted · Direct Login</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const ErrorBox = ({ msg }) => (
  <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 border border-red-400/20" style={{ background: 'rgba(239,68,68,0.08)' }}>
    <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    <p className="text-red-400 text-xs leading-relaxed">{msg}</p>
  </div>
);

export default SignInPage;
