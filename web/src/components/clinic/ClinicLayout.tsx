import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface ClinicLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export function ClinicLayout({ children, activePath = '/clinic' }: ClinicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'clinic');
    return () => document.documentElement.removeAttribute('data-mode');
  }, []);

  const navLinks = [
    { label: 'Queue', href: '/clinic' },
    { label: 'Evidence', href: '/evidence' },
    { label: 'Fairness', href: '/evidence/fairness' },
    { label: 'Privacy', href: '/privacy' }
  ];

  const isLinkActive = (href: string) => {
    if (activePath === href) return true;
    if (href === '/evidence/fairness' && (activePath === '/fairness' || activePath.startsWith('/evidence/fairness'))) return true;
    if (href === '/evidence' && activePath === '/evidence') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-ink text-paper h-14 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center">
          <Link to="/" className="font-display font-bold text-lg mr-8 hover:text-lime transition-colors">
            CogniSense
          </Link>
          <nav className="hidden md:flex space-x-6">
            {navLinks.map(link => {
              const active = isLinkActive(link.href);
              return (
                <Link 
                  key={link.href} 
                  to={link.href}
                  className={`text-sm font-bold transition-colors hover:text-lime focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-ink rounded-sm px-1 py-1 ${
                    active ? 'text-lime border-b-2 border-lime' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher size="sm" />
          <div className="hidden sm:block text-sm text-gray-200">Dr. Demo ▾</div>
          <button 
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink text-paper px-6 py-4 border-t border-gray-800 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-bold py-1 ${
                isLinkActive(link.href) ? 'text-lime' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
