import React from 'react';

export function Footer() {
  return (
    <footer className="bg-ink text-paper py-20 px-8 relative overflow-hidden mt-32">
      {/* Tilted top edge effect using a pseudo-element style approach or clip-path */}
      <div 
        className="absolute top-0 left-0 w-full h-16 bg-paper origin-top-left -skew-y-2 z-0 transform -translate-y-1/2"
      ></div>
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        <div>
          <h2 className="text-3xl font-display font-bold mb-4">CogniSense</h2>
          <p className="text-gray-400 max-w-sm mb-6">
            A multimodal screening prototype for cognitive decline.
          </p>
          <div className="text-sm font-bold bg-gray-800 inline-block px-4 py-2 rounded-md">
            Research prototype, not a medical device
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wider text-gray-400">Documentation</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-lime transition-colors">Model card</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Data sheet</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Fairness report</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wider text-gray-400">Project</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-lime transition-colors">Privacy design</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Source code</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
