import { useEffect, useState } from 'react';

interface GameLogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export default function GameLogo({ size = 'medium', animated = true }: GameLogoProps) {
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const next = prev + 0.02;
        return next > 1 ? 0.3 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [animated]);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const iconSizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} relative group cursor-pointer`}>
      {/* Outer ring with rotating border */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-green-500 via-cyan-500 to-blue-500 animate-spin-slow"
        style={{
          borderImage: 'linear-gradient(45deg, #22c55e, #06b6d4, #3b82f6, #22c55e) 1',
          animation: 'spin 8s linear infinite'
        }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      </div>
      
      {/* Middle ring */}
      <div className="absolute inset-2 rounded-full border border-cyan-400/40 bg-slate-900/80 backdrop-blur-sm">
        {/* Inner glow effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(34, 197, 94, ${glowIntensity * 0.3}) 0%, transparent 70%)`,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        ></div>
      </div>
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${iconSizeClasses[size]} text-green-400 relative z-10`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield shape */}
            <path
              d="M12 2L3 7V12C3 16.55 6.84 20.74 9.91 21.79C11.12 22.27 12.88 22.27 14.09 21.79C17.16 20.74 21 16.55 21 12V7L12 2Z"
              fill="currentColor"
              opacity="0.2"
            />
            {/* Inner circuit pattern */}
            <path
              d="M12 6L8 9V13C8 15.21 10.03 17.26 11.23 17.65C11.74 17.88 12.26 17.88 12.77 17.65C13.97 17.26 16 15.21 16 13V9L12 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Central core */}
            <circle cx="12" cy="12" r="2" fill="#06b6d4" opacity="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
            </circle>
            {/* Connection lines */}
            <path
              d="M12 10V8M12 16V14M10 12H8M16 12H14"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            >
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Pulse rings */}
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
        </>
      )}
    </div>
  );
}
