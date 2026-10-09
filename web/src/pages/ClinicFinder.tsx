import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavPill, DisclaimerBar } from '../components/ui';
import { 
  ClinicMap, 
  ClinicCard, 
  ClinicFilters, 
  LocationHeader
} from '../components/clinicFinder';
import type { PuneZone } from '../components/clinicFinder';

import { 
  PUNE_CLINICS, 
  PUNE_REFERENCE_LOCATION, 
  calculateDistanceKm, 
  estimateTravelTimeMinutes 
} from '../data/puneClinics';

export function ClinicFinder() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'hi' | 'mr' | 'kn';

  // User location state (Standard Pune Reference default)
  const [userLocation, setUserLocation] = useState({
    lat: PUNE_REFERENCE_LOCATION.lat,
    lng: PUNE_REFERENCE_LOCATION.lng,
    name: PUNE_REFERENCE_LOCATION.name,
    isGps: false
  });
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<PuneZone>('all');
  const [onlyMemoryClinics, setOnlyMemoryClinics] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

  // Geolocation Handler
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoadingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
          isGps: true
        });
        setIsLoadingGps(false);
      },
      (err) => {
        setIsLoadingGps(false);
        setGpsError(`Unable to retrieve GPS: ${err.message}. Using Pune Standard Location.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetStandard = () => {
    setUserLocation({
      lat: PUNE_REFERENCE_LOCATION.lat,
      lng: PUNE_REFERENCE_LOCATION.lng,
      name: PUNE_REFERENCE_LOCATION.name,
      isGps: false
    });
    setGpsError(null);
  };

  // Calculate distances & sort
  const clinicsWithDistance = useMemo(() => {
    return PUNE_CLINICS.map(clinic => {
      const distanceKm = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        clinic.coordinates.lat,
        clinic.coordinates.lng
      );
      const travelMins = estimateTravelTimeMinutes(distanceKm);
      return {
        ...clinic,
        distanceKm,
        travelMins
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation]);

  // Filtered clinics
  const filteredClinics = useMemo(() => {
    return clinicsWithDistance.filter(clinic => {
      // Zone filter
      if (selectedZone !== 'all' && clinic.zone !== selectedZone) {
        return false;
      }
      // Memory clinic toggle
      if (onlyMemoryClinics && clinic.type !== 'memory_clinic') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNameEn = clinic.name.en.toLowerCase().includes(query);
        const matchNameMr = clinic.name.mr?.toLowerCase().includes(query);
        const matchNameHi = clinic.name.hi?.toLowerCase().includes(query);
        const matchArea = clinic.area.en.toLowerCase().includes(query);
        const matchAddress = clinic.address.toLowerCase().includes(query);
        return matchNameEn || matchNameMr || matchNameHi || matchArea || matchAddress;
      }
      return true;
    });
  }, [clinicsWithDistance, selectedZone, onlyMemoryClinics, searchQuery]);

  const navLinks = [
    { label: t('nav.howItWorks'), href: '/#how-it-works' },
    { label: 'Find Clinics (Pune)', href: '/clinics' },
    { label: t('nav.evidence'), href: '/#evidence' },
    { label: t('nav.forClinicians'), href: '/clinic' }
  ];

  return (
    <div className="bg-paper min-h-screen pb-20">
      <NavPill links={navLinks} activeHref="/clinics" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36">
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/80 text-ink text-xs font-bold uppercase tracking-wider mb-3">
            <span>📍</span>
            <span>Pune Region · Care Network</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-ink tracking-tight leading-tight mb-3">
            Nearest Memory & Neurology Clinics
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl leading-relaxed">
            Connect with verified cognitive assessment units, geriatric care OPDs, and tertiary neurology hospitals across Pune.
          </p>
        </div>

        {/* Location Selector Bar */}
        <LocationHeader
          userLocation={userLocation}
          onUseGps={handleUseGps}
          onResetStandard={handleResetStandard}
          isLoadingGps={isLoadingGps}
          gpsError={gpsError}
        />

        {/* Filters */}
        <ClinicFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          onlyMemoryClinics={onlyMemoryClinics}
          onToggleMemoryOnly={() => setOnlyMemoryClinics(!onlyMemoryClinics)}
        />

        {/* Results Info & Count */}
        <div className="flex items-center justify-between mb-4 text-xs font-bold text-muted uppercase tracking-wider">
          <span>{filteredClinics.length} Clinics found in Pune</span>
          <span>Sorted by proximity (nearest first)</span>
        </div>

        {/* Split Grid: Interactive Map + Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Top: Interactive Leaflet Map */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 h-[450px] lg:h-[680px]">
            <ClinicMap
              clinics={filteredClinics}
              userLocation={userLocation}
              selectedClinicId={selectedClinicId}
              onSelectClinic={setSelectedClinicId}
            />
          </div>

          {/* Right / Bottom: Scrollable List of Clinic Cards */}
          <div className="lg:col-span-6 space-y-4">
            {filteredClinics.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 shadow-sm">
                <div className="text-4xl mb-3">🏥</div>
                <h3 className="text-lg font-bold text-ink mb-1">No clinics match your filters</h3>
                <p className="text-sm text-muted mb-4">Try clearing your search query or selecting "All Pune".</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedZone('all');
                    setOnlyMemoryClinics(false);
                  }}
                  className="px-4 py-2 bg-ink text-paper rounded-xl text-xs font-bold hover:bg-neutral-800"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredClinics.map((clinic) => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  isSelected={selectedClinicId === clinic.id}
                  onSelect={() => setSelectedClinicId(clinic.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <DisclaimerBar className="fixed bottom-0 left-0 right-0 z-40" />
    </div>
  );
}
