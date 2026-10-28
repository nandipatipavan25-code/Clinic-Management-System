import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { ROLE_CONFIG } from '../../utils/roleConfig';
import { GoogleLogin } from '@react-oauth/google';

const ROLES = [
  { id: 'patient',       label: 'Patient',       badge: 'User' },
  { id: 'doctor',        label: 'Doctor',        badge: 'Doctor' },
  { id: 'receptionist',  label: 'Receptionist',  badge: 'Front Desk' },
  { id: 'technician',    label: 'Technician',    badge: 'Lab' },
  { id: 'senior_doctor', label: 'Senior Doctor', badge: 'Admin' },
];

const SignUpPage = () => {
  const [userId, setUserId]     = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState('patient');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const { setAuth }             = useAuthStore();
  const navigate                = useNavigate();

  const handleGoogleSuccess = async (cred) => {
    setLoading(true); setError(null);
    try {
      const res  = await authApi.googleLogin(cred.credential);
      setAuth(res.user, res.access);
      const cfg  = ROLE_CONFIG[res.user.role];
      navigate(cfg ? cfg.dashboardRoute : '/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Account creation failed. Contact your administrator.');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!userId || !email || !password || !role) { setError('All fields are required.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 3) { setError('Password must be at least 3 characters.'); return; }
    setLoading(true);
    try {
      const res = await authApi.register(userId, email, password, role);
      setAuth(res.user, res.access);
      const cfg = ROLE_CONFIG[res.user.role];
      navigate(cfg ? cfg.dashboardRoute : '/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
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

      <div className="w-full max-w-[460px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/50 mb-3"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/>
            </svg>
          </div>
          <p className="text-white font-black text-2xl tracking-tight">MediSmart</p>
          <p className="text-white/40 text-xs mt-1">
            Create an account directly
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(8,22,52,0.95)', boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,#1d4ed8,#0ea5e9,#a78bfa)' }} />

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Role selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Select Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                        role === r.id
                          ? 'border-blue-400 bg-blue-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">User ID</label>
                <input type="text" value={userId} onChange={e => setUserId(e.target.value)}
                  placeholder="e.g. johndoe" autoFocus required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border border-white/10 focus:border-blue-500/60 transition-colors placeholder-white/20"
                  style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border border-white/10 focus:border-blue-500/60 transition-colors placeholder-white/20"
                  style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border border-white/10 focus:border-blue-500/60 transition-colors placeholder-white/20"
                  style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {/* Confirm */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password" required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border border-white/10 focus:border-blue-500/60 transition-colors placeholder-white/20"
                  style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {error && <ErrorBox msg={error} />}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/40 disabled:opacity-60 cursor-pointer mt-1"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' }}>
                {loading ? 'Creating Account…' : 'Create Account & Sign In →'}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/25 text-xs">or continue with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-up failed.')}
                  useOneTap={false} shape="rectangular" theme="filled_blue" size="large" text="signup_with" width="320" />
              </div>
            </form>

            <p className="text-center text-white/25 text-xs mt-5">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign In</button>
            </p>
          </div>
        </div>

        <p className="text-center text-white/15 text-xs mt-5">🔒 256-bit encrypted · Direct Access</p>
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

export default SignUpPage;
