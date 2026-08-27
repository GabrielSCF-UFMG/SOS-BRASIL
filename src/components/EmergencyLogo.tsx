import React from 'react';

interface EmergencyLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const EmergencyLogo: React.FC<EmergencyLogoProps> = ({
  size = 44,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 select-none drop-shadow-md transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 512 512"
          width="100%"
          height="100%"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="compBgGrad" cx="50%" cy="40%" r="60%" fx="50%" fy="30%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>

            <linearGradient id="compPoliceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            <linearGradient id="compFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="40%" stopColor="#ea580c" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            <linearGradient id="compHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>

            <linearGradient id="compGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Rounded Badge Base */}
          <rect width="512" height="512" rx="112" fill="url(#compBgGrad)" />
          <rect
            x="16"
            y="16"
            width="480"
            height="480"
            rx="96"
            fill="none"
            stroke="#334155"
            strokeWidth="6"
            opacity="0.6"
          />

          <g transform="translate(0, 10)">
            {/* PM (Polícia Militar): Tactical Shield */}
            <path
              d="M 256 70 L 370 120 C 370 230 320 330 256 380 C 192 330 142 230 142 120 Z"
              fill="#0f172a"
              stroke="url(#compPoliceGrad)"
              strokeWidth="14"
            />
            <path
              d="M 256 86 L 354 130 C 354 224 312 310 256 354 C 200 310 158 224 158 130 Z"
              fill="#1e293b"
              opacity="0.75"
            />

            {/* Tactical Reticles / Stars */}
            <line x1="256" y1="45" x2="256" y2="75" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="120" x2="148" y2="120" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
            <line x1="364" y1="120" x2="392" y2="120" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />

            {/* BM (Bombeiros): Rescue Flame */}
            <path
              d="M 256 125 C 278 175 330 205 330 265 C 330 320 290 355 256 355 C 222 355 182 320 182 265 C 182 215 220 180 238 140 C 246 175 270 195 264 220 C 258 200 248 185 256 125 Z"
              fill="url(#compFireGrad)"
            />
            <path
              d="M 256 190 C 270 220 298 245 298 280 C 298 312 278 335 256 335 C 234 335 214 312 214 280 C 214 250 238 225 248 200 C 252 220 262 230 258 245 C 255 232 250 222 256 190 Z"
              fill="#fef08a"
            />

            {/* SAMU (192): Vital Red Heart & Pulse Lifeline */}
            <g transform="translate(256, 280) scale(1.15) translate(-256, -280)">
              <path
                d="M 256 345 C 225 315 175 275 175 225 C 175 195 198 172 228 172 C 245 172 253 182 256 186 C 259 182 267 172 284 172 C 314 172 337 195 337 225 C 337 275 287 315 256 345 Z"
                fill="url(#compHeartGrad)"
                stroke="#ffffff"
                strokeWidth="6"
              />
              <path
                d="M 188 225 L 218 225 L 228 205 L 242 250 L 256 198 L 270 238 L 280 225 L 324 225"
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Top Star */}
            <polygon
              points="256,62 262,78 279,78 265,88 270,104 256,94 242,104 247,88 233,78 250,78"
              fill="url(#compGoldGrad)"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
            SOS CIDADÃO
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            190 PM • 193 BM • 192 SAMU
          </span>
        </div>
      )}
    </div>
  );
};
