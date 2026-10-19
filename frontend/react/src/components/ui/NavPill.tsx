import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuthStore } from '../../state/authStore';

interface NavPillProps {
  links: { label: string; href: string }[];
  activeHref?: string;
}

export function NavPill({ links, activeHref }: NavPillProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-ink text-paper px-4 py-2 rounded-full z-50 font-bold focus:ring-[3px] focus:ring-lime"
      >
        Skip to content
      </a>

      <div className={`fixed z-40 transition-all duration-300 ${scrolled ? 'top-2' : 'top-5'} left-1/2 -translate-x-1/2 max-w-[98vw]`}>
        <nav 
          className={`bg-cream rounded-full shadow-[var(--shadow-float)] transition-all duration-300 flex items-center justify-between gap-2 md:gap-4 ${scrolled ? 'py-1 px-3' : 'py-2 px-5'}`}
          aria-label="Main Navigation"
        >
          {/* Logo area */}
          <div className="font-display font-bold text-ink whitespace-nowrap pl-1 pr-2 flex-shrink-0 text-base md:text-lg">
            CogniSense
          </div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center space-x-1 flex-shrink-0">
            {links.map(link => (
              <li key={link.href} className="whitespace-nowrap">
                <a 
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors focus:outline-none focus:ring-[3px] focus:ring-ink ${
                    activeHref === link.href 
                      ? 'bg-ink text-paper' 
                      : 'text-ink hover:bg-paper-dim'
                  }`}
                  aria-current={activeHref === link.href ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Language Switcher Dropdown */}
          <div className="hidden sm:block flex-shrink-0 ml-1">
            <LanguageSwitcher size="sm" />
          </div>

          {/* Portal / Login Actions */}
          <div className="hidden md:flex items-center gap-2 pl-1 flex-shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'patient' ? '/patient' : '/clinic'}
                  className="inline-flex items-center whitespace-nowrap px-3 py-1.5 bg-paper border border-ink rounded-full font-bold text-xs text-ink hover:bg-paper-dim transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                  <span>{user.name}</span>
                  <span className="ml-1 text-muted">({user.role === 'patient' ? 'Patient' : 'Doctor'})</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-2.5 py-1 text-xs font-bold text-muted hover:text-ink hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login/patient"
                  className="inline-flex items-center whitespace-nowrap px-3.5 py-1.5 bg-paper border border-ink rounded-full font-bold text-xs text-ink hover:bg-paper-dim focus:outline-none focus:ring-2 focus:ring-ink transition-transform active:scale-95"
                >
                  <span>Patient Login</span>
                </Link>
                <Link
                  to="/login/clinic"
                  className="inline-flex items-center whitespace-nowrap px-3.5 py-1.5 bg-ink text-paper rounded-full font-bold text-xs hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ink shadow-xs transition-transform active:scale-95"
                >
                  <span>Doctor Login</span>
                  <span className="ml-1.5 text-lime font-mono">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button 
            className="md:hidden ml-1 p-2 rounded-full text-ink focus:outline-none focus:ring-[3px] focus:ring-ink"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-paper p-6 md:hidden overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="font-display font-bold text-ink text-2xl">CogniSense</div>
            <button 
              className="p-2 rounded-full text-ink focus:outline-none focus:ring-[3px] focus:ring-ink"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <ul className="space-y-4">
            {links.map(link => (
              <li key={link.href}>
                <a 
                  href={link.href}
                  className="block text-2xl font-bold text-ink hover:text-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-4 pb-2 border-t border-gray-200">
              <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Language</div>
              <LanguageSwitcher size="md" />
            </li>
            <li className="pt-4 space-y-3">
              <Link 
                to="/login/patient" 
                onClick={() => setMobileOpen(false)}
                className="block text-xl font-bold text-ink hover:text-muted"
              >
                👤 Patient Portal & Screening →
              </Link>
              <Link 
                to="/login/clinic" 
                onClick={() => setMobileOpen(false)}
                className="block text-xl font-bold text-ink underline decoration-lime decoration-4 underline-offset-4"
              >
                🩺 Doctor & Admin Login <span className="text-lime ml-1">→</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
