import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { ROLE_CONFIG } from '../../utils/roleConfig';

const ROLES = [
  { id: 'senior_doctor', label: 'Senior Doctor', badge: 'Admin', icon: '🩺', defaultEmail: 'seniordoctor@clinic.com' },
  { id: 'doctor',        label: 'Doctor',        badge: 'Clinician', icon: '👨‍⚕️', defaultEmail: 'doctor@clinic.com' },
  { id: 'receptionist',  label: 'Receptionist',  badge: 'Front Desk', icon: '📋', defaultEmail: 'receptionist@clinic.com' },
  { id: 'technician',    label: 'Technician',    badge: 'Lab & Diagnostics', icon: '🔬', defaultEmail: 'technician@clinic.com' },
  { id: 'patient',       label: 'Patient',       badge: 'Patient Portal', icon: '👤', defaultEmail: 'patient@clinic.com' },
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative selection:bg-blue-500 selection:text-white"
      style={{ background: 'radial-gradient(ellipse at 50% 10%, #061938 0%, #030d1d 55%, #020712 100%)' }}>

      {/* Ambient Radial Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-all backdrop-blur-md cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-[540px] relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3"
            style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/>
            </svg>
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">Smart Clinic CMS</h1>
          <p className="text-white/50 text-xs mt-1">
            Choose a role below to sign in directly with password <span className="text-cyan-300 font-mono font-bold">123</span>
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden border border-white/12 backdrop-blur-2xl bg-[#06142c]/90 shadow-2xl shadow-black/80">
          <div className="h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" />

          <div className="p-6 sm:p-8">
            {/* ── Role Selector ── */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-[11px] font-bold uppercase tracking-wider">
                  Select Role Portal
                </label>
                <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Active: {currentRole.label}
                </span>
              </div>

              {/* Row 1: 3 roles (Doctor, Senior Doctor, Receptionist) */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {ROLES.slice(0, 3).map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`relative flex flex-col p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400/80 bg-gradient-to-b from-blue-600/30 to-cyan-500/15 text-white shadow-lg shadow-blue-500/20'
                          : 'border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-base">{r.icon}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </div>
                      <p className="text-xs font-bold leading-snug whitespace-nowrap">{r.label}</p>
                      <p className="text-[10px] text-white/40 mt-0.5 whitespace-nowrap">{r.badge}</p>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: 2 roles (Technician, Patient) — evenly balanced */}
              <div className="grid grid-cols-2 gap-2">
                {ROLES.slice(3, 5).map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`relative flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400/80 bg-gradient-to-b from-blue-600/30 to-cyan-500/15 text-white shadow-lg shadow-blue-500/20'
                          : 'border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="text-xl shrink-0">{r.icon}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold leading-snug">{r.label}</p>
                        <p className="text-[10px] text-white/40 leading-snug">{r.badge}</p>
                      </div>
                      {isSelected && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Demo Notice Pill ── */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl mb-4 bg-cyan-500/[0.08] border border-cyan-400/20 text-cyan-200 text-xs">
              <span className="text-sm">⚡</span>
              <p className="leading-tight text-[11px]">
                <strong className="text-white">Direct Demo Mode:</strong> Use password <span className="font-mono font-bold text-cyan-300">123</span> to enter the {currentRole.label} portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={`e.g. ${currentRole.defaultEmail}`}
                  required
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none border border-white/12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-white/25 bg-white/[0.04]"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-cyan-400/90 font-mono font-semibold">Demo: 123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="123"
                    required
                    className="w-full rounded-xl pl-4 pr-11 py-2.5 text-sm text-white outline-none border border-white/12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-white/25 bg-white/[0.04] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs transition-colors p-1"
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
                className="w-full py-3 rounded-xl text-white font-bold text-sm mt-1 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to {currentRole.label} Portal</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[11px]">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed.')}
                useOneTap={false}
                shape="rectangular"
                theme="filled_blue"
                size="medium"
                text="signin_with"
                width="300"
              />
            </div>

            <p className="text-center text-white/30 text-xs mt-4">
              Need patient registration?{' '}
              <button onClick={() => navigate('/signup')} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer">
                Sign Up
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-white/20 text-[11px] mt-4">🔒 256-bit encrypted · Multi-Portal Direct Access</p>
      </div>
    </div>
  );
};

const ErrorBox = ({ msg }) => (
  <div className="flex items-start gap-2 rounded-xl px-3 py-2 border border-red-400/25 bg-red-500/10 text-red-300 text-xs leading-relaxed">
    <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    <p>{msg}</p>
  </div>
);

export default SignInPage;
