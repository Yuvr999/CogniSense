import React from 'react';

export type PuneZone = 'all' | 'central' | 'west' | 'east' | 'south' | 'pcmc';

interface ClinicFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedZone: PuneZone;
  onSelectZone: (zone: PuneZone) => void;
  onlyMemoryClinics: boolean;
  onToggleMemoryOnly: () => void;
}

const ZONES: { id: PuneZone; label: string; countHint?: string }[] = [
  { id: 'all', label: 'All Pune' },
  { id: 'central', label: 'Central / Deccan' },
  { id: 'west', label: 'West (Baner / Aundh)' },
  { id: 'east', label: 'East (Kharadi / Nagar Rd)' },
  { id: 'south', label: 'South (Katraj / Dhankawadi)' },
  { id: 'pcmc', label: 'PCMC / Pimpri' }
];

export function ClinicFilters({
  searchQuery,
  onSearchChange,
  selectedZone,
  onSelectZone,
  onlyMemoryClinics,
  onToggleMemoryOnly
}: ClinicFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Input + Memory Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by hospital name, area (e.g. Erandwane, Baner)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-300 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ink shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>

        {/* Memory Clinic Priority Filter */}
        <button
          type="button"
          onClick={onToggleMemoryOnly}
          className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
            onlyMemoryClinics
              ? 'bg-purple-900 text-purple-100 border-purple-950 ring-2 ring-purple-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span>🧠</span>
          <span>Memory Clinics Only</span>
        </button>
      </div>

      {/* Pune Zone Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1 whitespace-nowrap hidden md:inline">
          Area:
        </span>
        {ZONES.map((zone) => {
          const isActive = selectedZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-ink ${
                isActive
                  ? 'bg-ink text-paper shadow-xs scale-102'
                  : 'bg-white/80 hover:bg-white text-muted hover:text-ink border border-gray-200'
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
