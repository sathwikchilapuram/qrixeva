'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'auto' | 'light' | 'dark';
}

export function Logo({ size = 'md', showText = true, className = '', variant = 'auto' }: LogoProps) {
  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const svgSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 60,
  };

  const dim = svgSizes[size];

  const textColorClass =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-gray-900'
      : 'text-gray-900 dark:text-white';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative group cursor-pointer shrink-0">
        {/* Ambient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>

        {/* Logo Container */}
        <div className="relative flex items-center justify-center bg-gray-950 border border-gray-800 rounded-xl p-1.5 shadow-xl">
          <svg
            width={dim}
            height={dim}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform duration-300 group-hover:scale-105"
          >
            {/* Outer Orbit Path */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#orbit-grad)"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="animate-spin-slow origin-center opacity-80"
            />

            {/* QR Geometric Outer Corners */}
            <rect x="10" y="10" width="10" height="10" rx="3" fill="#4f46e5" />
            <rect x="12" y="12" width="6" height="6" rx="1.5" fill="#ffffff" />
            <rect x="14" y="14" width="2" height="2" fill="#4f46e5" />

            <rect x="28" y="10" width="10" height="10" rx="3" fill="#818cf8" />
            <rect x="30" y="12" width="6" height="6" rx="1.5" fill="#ffffff" />
            <rect x="32" y="14" width="2" height="2" fill="#818cf8" />

            <rect x="10" y="28" width="10" height="10" rx="3" fill="#c084fc" />
            <rect x="12" y="30" width="6" height="6" rx="1.5" fill="#ffffff" />
            <rect x="14" y="32" width="2" height="2" fill="#c084fc" />

            {/* Universe Spark Central Node */}
            <circle cx="33" cy="33" r="3" fill="url(#spark-grad)" />
            <circle cx="24" cy="24" r="2.5" fill="#38bdf8" />
            <rect x="23" y="18" width="2" height="3" rx="1" fill="#818cf8" />
            <rect x="18" y="23" width="3" height="2" rx="1" fill="#818cf8" />

            {/* Gradients */}
            <defs>
              <linearGradient id="orbit-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="0.5" stopColor="#a855f7" />
                <stop offset="1" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="spark-grad" x1="28" y1="28" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight font-sans leading-none ${textColorClass} ${textSizeMap[size]}`}>
          Qrix<span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">eva</span>
        </span>
      )}
    </div>
  );
}

