import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LANGUAGES = [
  { code: 'en', label: 'English', sub: 'English' },
  { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
  { code: 'mr', label: 'मराठी', sub: 'Marathi' },
  { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' }
] as const;

export function LanguageSwitcher({ className = '', size = 'md' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLangCode = i18n.language || 'en';
  const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: 'en' | 'hi' | 'mr' | 'kn') => {
    changeAppLanguage(code);
    setIsOpen(false);
  };

  const buttonSizeClasses = {
    sm: 'text-xs py-1 px-2.5 gap-1.5',
    md: 'text-sm py-1.5 px-3.5 gap-2',
    lg: 'text-base py-2 px-4 gap-2.5 font-bold'
  }[size];

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center rounded-full border border-gray-300 bg-white/95 hover:bg-white text-ink shadow-xs transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-1 select-none whitespace-nowrap ${buttonSizeClasses}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Globe Icon */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-muted flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>

        {/* Current Language Label */}
        <span className="font-bold text-ink">{currentLang.label}</span>

        {/* Chevron Icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Floating Popover Dropdown Card */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          role="listbox"
          aria-label="Languages"
        >
          {/* Header */}
          <div className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
            Language
          </div>

          {/* Language Options */}
          <div className="space-y-1">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLangCode === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gray-100/90 text-ink shadow-xs'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ink leading-snug">{lang.label}</span>
                    <span className="text-xs text-muted leading-tight">{lang.sub}</span>
                  </div>

                  {/* Green Checkmark for Selected Language */}
                  {isSelected && (
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#16A34A" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="flex-shrink-0 ml-2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
