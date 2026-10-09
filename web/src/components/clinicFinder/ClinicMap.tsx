import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PuneClinic } from '../../data/puneClinics';
import { useTranslation } from 'react-i18next';

interface ClinicMapProps {
  clinics: (PuneClinic & { distanceKm: number; travelMins: number })[];
  userLocation: { lat: number; lng: number; name: string; isGps: boolean };
  selectedClinicId: string | null;
  onSelectClinic: (id: string) => void;
  className?: string;
}

export function ClinicMap({
  clinics,
  userLocation,
  selectedClinicId,
  onSelectClinic,
  className = ''
}: ClinicMapProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'hi' | 'mr' | 'kn';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map centered on Pune
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 12.5,
      zoomControl: false
    });

    // Add zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap CartoDB Positron (clean, light, clinical look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Custom pulsing user location icon
    const userIcon = L.divIcon({
      className: 'custom-user-location-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-sky-400/40 animate-ping absolute"></div>
          <div class="w-5 h-5 rounded-full bg-blue-600 border-3 border-white shadow-lg relative z-10 flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`
        <div class="p-1 text-center font-sans">
          <div class="text-xs font-bold text-blue-600 uppercase tracking-wider">${userLocation.isGps ? 'Your Location' : 'Standard Reference'}</div>
          <div class="font-bold text-sm text-gray-900 mt-0.5">${userLocation.name}</div>
        </div>
      `);

    userMarkerRef.current = userMarker;
  }, [userLocation]);

  // Update Clinic Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    clinics.forEach(clinic => {
      const isSelected = selectedClinicId === clinic.id;
      const isMemory = clinic.type === 'memory_clinic';

      const clinicIcon = L.divIcon({
        className: 'custom-clinic-marker',
        html: `
          <div class="relative cursor-pointer transition-transform duration-200 transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="px-2.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border-2 ${
              isSelected
                ? 'bg-ink text-lime border-lime ring-4 ring-lime/40'
                : isMemory
                ? 'bg-purple-700 text-white border-white'
                : 'bg-emerald-700 text-white border-white'
            }">
              <span class="text-[11px]">${isMemory ? '🧠' : '🏥'}</span>
              <span class="font-mono text-[11px]">${clinic.distanceKm}km</span>
            </div>
            <div class="w-2 h-2 rotate-45 mx-auto -mt-1 ${
              isSelected ? 'bg-ink border-r border-b border-lime' : isMemory ? 'bg-purple-700' : 'bg-emerald-700'
            }"></div>
          </div>
        `,
        iconSize: [80, 36],
        iconAnchor: [40, 34]
      });

      const localizedName = clinic.name[lang] || clinic.name.en;
      const localizedArea = clinic.area[lang] || clinic.area.en;

      const marker = L.marker([clinic.coordinates.lat, clinic.coordinates.lng], { icon: clinicIcon })
        .addTo(map)
        .on('click', () => {
          onSelectClinic(clinic.id);
        })
        .bindPopup(`
          <div class="p-2 min-w-[220px] font-sans">
            <div class="flex items-center justify-between text-xs text-muted font-bold mb-1">
              <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">${clinic.distanceKm} km (~${clinic.travelMins} mins)</span>
              <span>⭐ ${clinic.rating}</span>
            </div>
            <h4 class="font-bold text-sm text-gray-900 leading-tight mb-1">${localizedName}</h4>
            <p class="text-xs text-gray-600 mb-3">${localizedArea}</p>
            <div class="flex gap-2">
              <a href="${clinic.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-1.5 px-2 bg-ink text-paper rounded-lg text-xs font-bold hover:bg-neutral-800">
                Directions →
              </a>
              <a href="tel:${clinic.phone.replace(/\\s+/g, '')}" class="py-1.5 px-2 bg-gray-100 text-ink rounded-lg text-xs font-bold hover:bg-gray-200">
                📞 Call
              </a>
            </div>
          </div>
        `);

      markersRef.current[clinic.id] = marker;
    });
  }, [clinics, selectedClinicId, lang]);

  // Center on selected clinic if selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedClinicId) return;

    const selectedClinic = clinics.find(c => c.id === selectedClinicId);
    if (selectedClinic) {
      map.flyTo([selectedClinic.coordinates.lat, selectedClinic.coordinates.lng], 14, {
        duration: 0.8
      });
      const marker = markersRef.current[selectedClinicId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedClinicId]);

  return (
    <div className={`relative w-full h-full rounded-3xl overflow-hidden border border-gray-200 shadow-md ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
      
      {/* Map Legend Floating Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-gray-200 text-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <span className="w-3 h-3 rounded-full bg-blue-600 border border-white inline-block"></span>
          <span>You / Reference</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <span className="w-3 h-3 rounded-full bg-purple-700 inline-block"></span>
          <span>Memory Clinic</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <span className="w-3 h-3 rounded-full bg-emerald-700 inline-block"></span>
          <span>Tertiary Neurology</span>
        </div>
      </div>
    </div>
  );
}
