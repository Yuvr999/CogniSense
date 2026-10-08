import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'segmented' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'HI' },
  { code: 'mr', label: 'मराठी', short: 'MR' }
] as const;

export function LanguageSwitcher({ className = '', variant = 'segmented', size = 'md' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (code: 'en' | 'hi' | 'mr') => {
    changeAppLanguage(code);
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 bg-white/90 border border-gray-300 rounded-full p-1 shadow-sm ${className}`} role="group" aria-label="Select Language">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5 text-muted">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                isActive
                  ? 'bg-ink text-paper shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-gray-100'
              }`}
              aria-pressed={isActive}
            >
              {lang.short}
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented variant (default)
  const sizeClasses = {
    sm: 'text-xs py-1 px-2.5 gap-1',
    md: 'text-sm py-1.5 px-3.5 gap-1.5',
    lg: 'text-base py-2 px-5 gap-2 font-bold'
  }[size];

  return (
    <div 
      className={`inline-flex items-center bg-sand/60 border border-gray-300 rounded-full p-1 shadow-sm backdrop-blur-xs ${className}`}
      role="group" 
      aria-label="Language Selector"
    >
      <div className="flex items-center pl-2 pr-1 text-muted" title="Language">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>
      {LANGUAGES.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-ink ${sizeClasses} ${
              isActive
                ? 'bg-ink text-paper font-bold shadow-sm scale-102'
                : 'text-ink/80 hover:text-ink hover:bg-white/80 font-medium'
            }`}
            aria-pressed={isActive}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
