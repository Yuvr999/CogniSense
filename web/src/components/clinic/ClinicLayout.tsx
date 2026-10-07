import React, { useEffect } from 'react';

interface ClinicLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export function ClinicLayout({ children, activePath = '/clinic' }: ClinicLayoutProps) {
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

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-ink text-paper h-14 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center">
          <div className="font-display font-bold text-lg mr-8">CogniSense</div>
          <nav className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href}
                className={`text-sm font-bold transition-colors hover:text-lime focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-ink rounded-sm px-1 ${activePath === link.href ? 'text-lime border-b-2 border-lime' : 'text-gray-300'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">Dr. Demo ▾</div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
