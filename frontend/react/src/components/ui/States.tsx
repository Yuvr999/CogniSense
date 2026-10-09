import React from 'react';
import { Button } from './Button';

interface StateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, message, actionLabel, onAction, className = '' }: StateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

export function ErrorState({ title, message, actionLabel, onAction, className = '' }: StateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-[var(--color-risk-high-bg)] shadow-sm ${className}`}>
      <div className="w-16 h-16 bg-[var(--color-risk-high-bg)] rounded-full flex items-center justify-center mb-4 text-[var(--color-risk-high)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
