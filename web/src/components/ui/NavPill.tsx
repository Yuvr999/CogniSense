import React, { useState, useEffect } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavPillProps {
  links: { label: string; href: string }[];
  activeHref?: string;
}

export function NavPill({ links, activeHref }: NavPillProps) {
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

      <div className={`fixed z-40 transition-all duration-300 ${scrolled ? 'top-2' : 'top-6'} left-1/2 -translate-x-1/2`}>
        <nav 
          className={`bg-cream rounded-full shadow-[var(--shadow-float)] transition-all duration-300 overflow-hidden flex items-center ${scrolled ? 'py-1 px-2' : 'py-2 px-4'}`}
          aria-label="Main Navigation"
        >
          {/* Logo area */}
          <div className="font-display font-bold text-ink mr-6 whitespace-nowrap pl-2">
            CogniSense
          </div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center space-x-1">
            {links.map(link => (
              <li key={link.href}>
                <a 
                  href={link.href}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors focus:outline-none focus:ring-[3px] focus:ring-ink ${
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
          
          <div className="hidden lg:block ml-2">
            <LanguageSwitcher size="sm" />
          </div>

          <div className="hidden md:block ml-3 pr-1">
            <a href="/clinic" className="inline-flex items-center px-4 py-2 bg-ink text-paper rounded-full font-bold text-sm hover:bg-muted focus:outline-none focus:ring-[3px] focus:ring-ink focus:ring-offset-2">
              Open clinician demo 
              <span className="ml-2 text-lime">→</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button 
            className="md:hidden ml-auto p-2 rounded-full text-ink focus:outline-none focus:ring-[3px] focus:ring-ink"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile sheet (simplified for now) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-paper p-6 md:hidden">
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
            <li className="pt-4 pb-2">
              <LanguageSwitcher size="md" />
            </li>
            <li className="pt-4">
               <a href="/clinic" className="inline-flex items-center text-2xl font-bold text-ink underline decoration-lime decoration-4 underline-offset-4">
                Open clinician demo <span className="text-lime ml-2">→</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
