import React from 'react';
import type { PuneClinic } from '../../data/puneClinics';
import { useTranslation } from 'react-i18next';

interface ClinicCardProps {
  clinic: PuneClinic & { distanceKm: number; travelMins: number };
  isSelected: boolean;
  onSelect: () => void;
}

export function ClinicCard({ clinic, isSelected, onSelect }: ClinicCardProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'hi' | 'mr' | 'kn';

  const localizedName = clinic.name[lang] || clinic.name.en;
  const localizedArea = clinic.area[lang] || clinic.area.en;
  const localizedSpecialties = clinic.specialties[lang] || clinic.specialties.en;

  const isMemory = clinic.type === 'memory_clinic';

  return (
    <div
      onClick={onSelect}
      className={`p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer text-left relative ${
        isSelected
          ? 'bg-white border-ink shadow-xl ring-4 ring-lime/50 -translate-y-0.5'
          : 'bg-white/90 hover:bg-white border-gray-200/90 shadow-sm hover:shadow-md hover:border-gray-300'
      }`}
    >
      {/* Top badges: Distance + Facility Type */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs font-mono">
            <span>📍</span>
            <span>{clinic.distanceKm} km away</span>
            <span className="opacity-60 font-sans font-medium">· ~{clinic.travelMins} mins</span>
          </span>

          {isMemory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
              <span>🧠 Memory Clinic</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <span>⭐</span>
          <span>{clinic.rating}</span>
          <span className="text-muted font-normal">({clinic.reviewsCount})</span>
        </div>
      </div>

      {/* Hospital Name & Area */}
      <h3 className="text-xl font-bold text-ink leading-snug mb-1">
        {localizedName}
      </h3>
      <p className="text-sm text-muted font-medium mb-4 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>{localizedArea}</span>
      </p>

      {/* Specialties pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {localizedSpecialties.slice(0, 3).map((spec, i) => (
          <span 
            key={i} 
            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200/80"
          >
            {spec}
          </span>
        ))}
        {localizedSpecialties.length > 3 && (
          <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500">
            +{localizedSpecialties.length - 3} more
          </span>
        )}
      </div>

      {/* Address & Timings */}
      <div className="text-xs text-muted space-y-1 mb-5 border-t border-gray-100 pt-3">
        <div className="flex items-start gap-2">
          <span className="font-bold text-gray-500 min-w-[50px]">Address:</span>
          <span className="text-gray-700 line-clamp-1">{clinic.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 min-w-[50px]">Hours:</span>
          <span className="text-gray-700">{clinic.timing}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100" onClick={e => e.stopPropagation()}>
        <a
          href={clinic.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 rounded-xl bg-ink text-paper text-sm font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-transform active:scale-98 shadow-xs"
        >
          <span>Get Directions</span>
          <span className="text-lime font-mono">→</span>
        </a>

        <a
          href={`tel:${clinic.phone.replace(/\\s+/g, '')}`}
          className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-ink text-sm font-bold flex items-center justify-center gap-1.5 transition-colors border border-gray-300"
          title={`Call ${clinic.phone}`}
        >
          <span>📞</span>
          <span className="hidden sm:inline">Call</span>
        </a>
      </div>
    </div>
  );
}
