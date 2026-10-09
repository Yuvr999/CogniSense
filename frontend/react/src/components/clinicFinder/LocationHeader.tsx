import React from 'react';

interface LocationHeaderProps {
  userLocation: { lat: number; lng: number; name: string; isGps: boolean };
  onUseGps: () => void;
  onResetStandard: () => void;
  isLoadingGps: boolean;
  gpsError: string | null;
}

export function LocationHeader({
  userLocation,
  onUseGps,
  onResetStandard,
  isLoadingGps,
  gpsError
}: LocationHeaderProps) {
  return (
    <div className="bg-sand/40 border border-sand rounded-3xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center text-2xl flex-shrink-0">
          📍
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {userLocation.isGps ? 'Your Exact Location' : 'Standard Reference Location'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              Pune, MH
            </span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-ink">
            {userLocation.name}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto">
        {!userLocation.isGps ? (
          <button
            onClick={onUseGps}
            disabled={isLoadingGps}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-300 text-ink font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoadingGps ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin"></span>
                <span>Locating...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="12 8 8 12 12 16 16 12 12 8"></polygon>
                </svg>
                <span>Use My Exact Location</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onResetStandard}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-300 text-muted font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <span>Reset to Pune Center</span>
          </button>
        )}
      </div>

      {gpsError && (
        <div className="w-full text-xs text-red-600 font-medium">
          {gpsError}
        </div>
      )}
    </div>
  );
}
