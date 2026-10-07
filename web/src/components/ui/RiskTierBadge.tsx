import React from 'react';

export type RiskTier = 'Low' | 'Elevated' | 'High' | 'Indeterminate';

interface RiskTierBadgeProps {
  tier: RiskTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const tierConfig = {
  Low: {
    bgClass: 'bg-[var(--color-risk-low-bg)]',
    textClass: 'text-[var(--color-risk-low-text)]',
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
    pattern: 'none' // solid
  },
  Elevated: {
    bgClass: 'bg-[var(--color-risk-elevated-bg)]',
    textClass: 'text-[var(--color-risk-elevated-text)]',
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    pattern: 'radial-gradient(var(--color-risk-elevated) 1px, transparent 1px)' // dotted
  },
  High: {
    bgClass: 'bg-[var(--color-risk-high-bg)]',
    textClass: 'text-[var(--color-risk-high-text)]',
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
        {/* Double alert visual */}
        <path d="M6 2L-4 22h20L6 2z" opacity="0.5" transform="translate(6, 0) scale(0.7)"></path>
      </svg>
    ),
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(179,38,30,0.1) 5px, rgba(179,38,30,0.1) 10px)' // dense diagonal
  },
  Indeterminate: {
    bgClass: 'bg-[var(--color-risk-indet-bg)]',
    textClass: 'text-[var(--color-risk-indet-text)]',
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    pattern: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(71,85,105,0.05) 10px, rgba(71,85,105,0.05) 20px)' // light diagonal
  }
};

export function RiskTierBadge({ tier, size = 'md', className = '' }: RiskTierBadgeProps) {
  const config = tierConfig[tier];
  
  let sizeClasses = '';
  let iconSize = '';
  if (size === 'sm') {
    sizeClasses = 'px-2 py-0.5 text-xs rounded-md';
    iconSize = 'w-3 h-3';
  } else if (size === 'md') {
    sizeClasses = 'px-3 py-1 text-sm rounded-lg';
    iconSize = 'w-4 h-4';
  } else {
    sizeClasses = 'px-4 py-2 text-base rounded-xl';
    iconSize = 'w-5 h-5';
  }

  const style = config.pattern !== 'none' 
    ? { backgroundImage: config.pattern, backgroundSize: tier === 'Elevated' ? '4px 4px' : 'auto' } 
    : {};

  return (
    <div 
      className={`inline-flex items-center font-bold relative overflow-hidden ${config.bgClass} ${config.textClass} ${sizeClasses} ${className}`}
    >
      <div className="absolute inset-0 z-0 opacity-50" style={style}></div>
      <div className={`relative z-10 mr-1.5 flex-shrink-0 ${iconSize}`}>
        {config.icon}
      </div>
      <span className="relative z-10">{tier}</span>
    </div>
  );
}
