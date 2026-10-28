import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLE_CONFIG } from '../../utils/roleConfig';

/* ── Main Landing Page ── */
const LoginPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [modal, setModal]   = useState(null);
  const { isAuthenticated, user } = useAuthStore();
  const navigate            = useNavigate();
  const location            = useLocation();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const cfg = ROLE_CONFIG[user.role];
      const from = location.state?.from?.pathname || (cfg ? cfg.dashboardRoute : '/');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const services = [
    {
      icon: '🗓️',
      title: 'Smart Appointments',
      desc: 'Seamless scheduling for in-person and virtual consults. Real-time slot allocation with automated doctor availability.',
      color: '#3b82f6',
      light: 'rgba(59,130,246,0.08)',
      glow: 'rgba(59,130,246,0.2)',
    },
    {
      icon: '💊',
      title: 'Digital Prescriptions',
      desc: 'Instant e-prescriptions with interaction warnings, drug lookup, and automatic dosage tracking for patient refills.',
      color: '#a855f7',
      light: 'rgba(168,85,247,0.08)',
      glow: 'rgba(168,85,247,0.2)',
    },
    {
      icon: '🔬',
      title: 'Diagnostic & Lab Scans',
      desc: 'Technician scan orders, radiological imaging reports, and automated results delivery directly to the doctor and patient.',
      color: '#06b6d4',
      light: 'rgba(6,182,212,0.08)',
      glow: 'rgba(6,182,212,0.2)',
    },
  ];

  const stats = [
    ['2,000+', 'Patients Treated'],
    ['15+', 'Specialist Doctors'],
    ['50+', 'Diagnostic Tests'],
    ['99.4%', 'Satisfaction Rate']
  ];

  return (
    <div className="min-h-screen flex flex-col text-white selection:bg-blue-500 selection:text-white"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #061938 0%, #030d1d 55%, #020712 100%)' }}>

      {/* ── Navbar (No harsh line, clean glass glow) ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4 backdrop-blur-xl"
        style={{ background: 'rgba(3,13,29,0.75)' }}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tight">Smart Clinic</p>
            <p className="text-cyan-400 text-[10px] uppercase tracking-widest font-semibold mt-0.5">Healthcare OS</p>
          </div>
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {['Platform', 'Services', 'Patient Journey', 'Portals'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full text-white/80 text-sm font-semibold hover:text-white hover:bg-white/10 transition-all bg-white/5 border border-white/10">
            Sign In
          </button>
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
            style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            Demo Access
          </button>
        </div>
      </nav>

      {/* ── Ambient Radial Glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-96 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[600px] right-1/4 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 max-w-5xl mx-auto">
        
        {/* Pill Badge with Reveal */}
        <div className="animate-reveal-1 inline-flex items-center gap-2.5 bg-blue-500/10 border border-blue-400/25 rounded-full px-4 py-1.5 mb-8 shadow-inner shadow-blue-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 text-xs font-bold uppercase tracking-wider">Next-Gen Clinical Management</span>
        </div>

        {/* Headline with Text Reveal */}
        <h1 className="animate-reveal-2 font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-8">
          Quality Healthcare<br />
          <span className="gradient-text-shimmer">
            At Your Fingertips.
          </span>
        </h1>

        {/* Subtitle with Text Reveal */}
        <p className="animate-reveal-3 text-white/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-normal">
          A unified healthcare operating system connecting patients, doctors, technicians, and front desk staff with instant consultations, live queues, and digital medical records.
        </p>

        {/* Action Buttons with Reveal */}
        <div className="animate-reveal-4 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <button onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-bold text-base hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-blue-600/35 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0284c7)' }}>
            Launch Live Demo →
          </button>
          <button onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white/80 font-bold text-base border border-white/10 hover:border-white/30 hover:text-white transition-all bg-white/[0.04] backdrop-blur-md cursor-pointer">
            Explore 5 Roles
          </button>
        </div>

        {/* ── High-Res App Interface Showcase (HERO IMAGE) ── */}
        <div className="animate-reveal-4 mt-16 w-full max-w-5xl relative group">
          {/* Outer Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-300" />
          
          <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#071733]/90 shadow-2xl shadow-black/80 backdrop-blur-2xl">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-white/10 text-white/40 text-xs font-mono">
                <span className="text-cyan-400">🔒</span>
                <span>https://smartclinic.health/dashboard/doctor</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">
                Live Preview
              </div>
            </div>

            {/* Dashboard Image */}
            <div className="relative overflow-hidden aspect-[16/9] sm:aspect-[16/9.5]">
              <img
                src="/hero-dashboard.jpg"
                alt="Smart Clinic Dashboard Interface"
                className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030d1d] via-transparent to-transparent opacity-60" />

              {/* Floating Live Badges */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-[#051630]/90 border border-cyan-400/30 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl shadow-black/60">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <p className="text-xs font-bold text-white">Interactive Portals Live</p>
                  <p className="text-[10px] text-cyan-300">Admin · Doctor · Reception · Lab · Patient</p>
                </div>
              </div>

              <div className="absolute top-6 right-6 hidden sm:flex items-center gap-2 bg-[#051630]/90 border border-blue-400/30 backdrop-blur-xl px-4 py-2 rounded-2xl text-xs text-white/80 shadow-lg">
                <span className="text-base">⚡</span>
                <span>Password <strong className="text-cyan-300 font-mono">123</strong> for Any Role</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Island (No harsh lines, smooth floating glass card) ── */}
      <section className="relative z-10 px-6 py-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
            {stats.map(([val, lbl]) => (
              <div key={lbl} className="pt-4 md:pt-0">
                <p className="text-white font-black text-3xl sm:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                  {val}
                </p>
                <p className="text-white/40 text-xs sm:text-sm mt-1 font-medium">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Patient Journey Showcase Section (PATIENT IMAGE) ── */}
      <section id="patient-journey" className="relative z-10 px-6 lg:px-16 py-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Journey Image in Frame */}
          <div className="relative group order-2 lg:order-1">
            <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition duration-500" />
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#051630] shadow-2xl shadow-black/70">
              <img
                src="/patient-journey.jpg"
                alt="Smart Clinical Care Journey"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span className="font-semibold text-cyan-300">✓ Frictionless Healthcare Flow</span>
                  <span className="text-white/40">Zero Waiting Confusion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content & Highlights */}
          <div className="order-1 lg:order-2">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">Modern Patient Journey</p>
            <h2 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              Designed for Speed, Clarity, and Patient Trust.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              From online booking and real-time live queue management to instant prescription fulfillment and diagnostic scan reports — every touchpoint is unified in a single, secure interface.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { title: 'Instant Online Booking', desc: 'Patients book in under 60 seconds with live slot availability.' },
                { title: 'Live Queue & Token Sync', desc: 'Receptionist check-in synchronizes live with the doctor queue.' },
                { title: 'Digital Rx & Scan Delivery', desc: 'Doctors prescribe medications and technicians deliver scan results online.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                    <p className="text-white/45 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Services Section ── */}
      <section id="services" className="relative z-10 px-6 lg:px-16 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">Core Modules</p>
          <h2 className="text-white font-black text-4xl lg:text-5xl tracking-tight">Everything in One Platform</h2>
          <p className="text-white/50 text-base sm:text-lg mt-4 max-w-xl mx-auto">
            Engineered to streamline outpatient workflow and administrative clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(({ icon, title, desc, color, light, glow }) => (
            <div key={title}
              className="rounded-3xl p-8 border border-white/10 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group relative overflow-hidden"
              style={{ background: light }}>
              
              {/* Corner soft glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ background: color }} />

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner"
                style={{ background: glow, border: `1px solid ${color}40` }}>
                {icon}
              </div>
              <h3 className="text-white font-black text-xl mb-3 group-hover:text-cyan-300 transition-colors">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{desc}</p>
              
              <button onClick={() => navigate('/login')}
                className="text-xs font-bold transition-all flex items-center gap-1.5 group-hover:gap-2.5 text-cyan-400 hover:text-cyan-300">
                <span>Access Module</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ready to Start CTA Card (No harsh lines) ── */}
      <section className="relative z-10 px-6 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto rounded-3xl p-10 lg:p-14 text-center border border-white/10 relative overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.25) 0%, rgba(6,182,212,0.15) 100%)' }}>
          
          <div className="relative z-10">
            <h2 className="text-white font-black text-3xl sm:text-4xl mb-4 tracking-tight">
              Ready to Experience Smart Clinic?
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Test all 5 clinical workflows instantly with pre-seeded demo data and password <span className="text-cyan-300 font-mono font-bold">123</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-2xl text-white font-bold hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-blue-600/40 cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                Try Live Demo Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (Soft fade, no harsh white line) ── */}
      <footer className="relative z-10 px-6 lg:px-16 py-10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-6 14h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/>
              </svg>
            </div>
            <span className="text-white/80 text-sm font-bold tracking-tight">Smart Clinic</span>
          </div>
          <p className="text-white/30 text-xs">© 2026 Smart Clinic System · All rights reserved</p>
          <div className="flex gap-6 text-xs text-white/40">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/login')}>Sign In</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/signup')}>Sign Up</span>
          </div>
        </div>
      </footer>

      {/* ── Text Reveal & Fluid Animation Styles ── */}
      <style>{`
        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes shineGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.2; transform: scale(1) translateX(-50%); }
          50% { opacity: 0.35; transform: scale(1.08) translateX(-50%); }
        }
        .animate-reveal-1 {
          animation: textReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-reveal-2 {
          animation: textReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }
        .animate-reveal-3 {
          animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }
        .animate-reveal-4 {
          animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        .gradient-text-shimmer {
          background: linear-gradient(90deg, #60a5fa 0%, #38bdf8 30%, #c084fc 70%, #60a5fa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shineGradient 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
