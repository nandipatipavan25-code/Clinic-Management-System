import React from 'react';

/**
 * MediSmart Brand Logo Component
 * Combines the stylized 'M' cross glyph with glowing gradients and optional text label.
 */
export const MediSmartLogo = ({ 
  size = 40, 
  showText = false, 
  variant = 'gradient', // 'gradient' | 'image' | 'minimal'
  className = '' 
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant === 'image' ? (
        <img 
          src="/medismart-logo.png" 
          alt="MediSmart Logo" 
          className="rounded-2xl shadow-md shadow-blue-500/20 object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <div 
          className="relative rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 overflow-hidden shrink-0 border border-white/20"
          style={{ 
            width: size, 
            height: size, 
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #06b6d4 100%)' 
          }}
        >
          {/* Subtle ambient light highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

          {/* MediSmart M-Cross Pulse SVG Icon */}
          <svg 
            viewBox="0 0 64 64" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: size * 0.72, height: size * 0.72 }}
          >
            {/* Medical Cross Base */}
            <rect x="26" y="14" width="12" height="36" rx="6" fill="#ffffff" fillOpacity="0.95" />
            <rect x="14" y="26" width="36" height="12" rx="6" fill="#ffffff" fillOpacity="0.95" />

            {/* Smart Digital Pulse 'M' Wave Overlay */}
            <path 
              d="M 16 32 H 23 L 28 21 L 32 43 L 36 21 L 41 32 H 48" 
              stroke="#0284c7" 
              strokeWidth="3.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M 16 32 H 23 L 28 21 L 32 43 L 36 21 L 41 32 H 48" 
              stroke="#38bdf8" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Glowing Heartbeat Core */}
            <circle cx="32" cy="32" r="3.5" fill="#1e40af" />
            <circle cx="32" cy="32" r="1.5" fill="#67e8f9" />
          </svg>
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tight leading-none text-white">
            Medi<span className="text-cyan-400">Smart</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400/80 mt-0.5">
            Healthcare OS
          </span>
        </div>
      )}
    </div>
  );
};

export default MediSmartLogo;
