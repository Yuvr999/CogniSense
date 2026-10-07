import React from 'react';

type BannerLevel = 'warn' | 'error';

interface DataQualityBannerProps {
  level: BannerLevel;
  message: string;
  className?: string;
}

export function DataQualityBanner({ level, message, className = '' }: DataQualityBannerProps) {
  const isError = level === 'error';
  
  const bgClass = isError ? 'bg-[var(--color-risk-high-bg)]' : 'bg-[#FFF8E1]'; // Or a specific warning bg if defined
  const textClass = isError ? 'text-[var(--color-risk-high-text)]' : 'text-[#8F6B00]';
  const borderClass = isError ? 'border-[var(--color-risk-high)]' : 'border-[#FFC107]';

  return (
    <div className={`flex items-start p-4 border-l-4 rounded-r-md ${bgClass} ${textClass} ${borderClass} ${className}`} role="alert">
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {isError ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        )}
      </div>
      <div className="text-sm font-medium leading-tight">
        {message}
      </div>
    </div>
  );
}
