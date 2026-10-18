import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Geometric Social Automation Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 rounded-xl blur-[6px] opacity-60"></div>
        
        {/* SVG Emblem */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-md"
        >
          {/* Base rounded square container */}
          <rect width="48" height="48" rx="12" fill="#0f172a" stroke="#312e81" strokeWidth="1.5" />
          
          {/* Background subtle grid/energy matrix */}
          <circle cx="24" cy="24" r="16" stroke="url(#samp_ring)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Central Automation Nodes & Signal Mesh */}
          <path
            d="M14 26L22 15L28 22L34 13"
            stroke="url(#samp_pulse)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Social Network Node Pulses */}
          <circle cx="14" cy="26" r="3" fill="#6366f1" />
          <circle cx="22" cy="15" r="3" fill="#8b5cf6" />
          <circle cx="28" cy="22" r="3" fill="#06b6d4" />
          <circle cx="34" cy="13" r="3" fill="#10b981" />

          {/* Real-Time Sync Wave Arc */}
          <path
            d="M13 34C17 31 31 31 35 34"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="24" cy="32" r="1.5" fill="#38bdf8" />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="samp_pulse" x1="14" y1="26" x2="34" y2="13" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.4" stopColor="#8b5cf6" />
              <stop offset="0.8" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="samp_ring" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 font-['Plus_Jakarta_Sans'] ${textSizes[size]}`}>
            SAMP
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 rounded">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium text-slate-400 tracking-tight mt-0.5 truncate max-w-[190px]">
            Social Automation & Marketing
          </span>
        )}
      </div>
    </div>
  );
};
