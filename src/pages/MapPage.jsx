import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Phone,
  Compass,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { KNOWN_LOCAL_AREAS, calculateDistanceKm, formatDistance, estimateTravelTime } from '../utils/geoUtils';
import InteractiveMap from '../components/InteractiveMap';
import BookingModal from '../components/BookingModal';

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const {
    workers,
    jobs,
    userLocation,
    refreshGpsLocation,
    setManualLocation,
    isLiveSharingActive,
    setIsLiveSharingActive,
  } = useWorkForce();

  const queryWorkerId = searchParams.get('workerId');
  const queryJobId = searchParams.get('jobId');

  const [selectedWorkerId, setSelectedWorkerId] = useState(queryWorkerId || '');
  const [selectedJobId, setSelectedJobId] = useState(queryJobId || '');
  const [bookingWorker, setBookingWorker] = useState(null);
  const [manualAddressInput, setManualAddressInput] = useState('');

  useEffect(() => {
    if (queryWorkerId) setSelectedWorkerId(queryWorkerId);
    if (queryJobId) setSelectedJobId(queryJobId);
  }, [queryWorkerId, queryJobId]);

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || null;
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    if (manualAddressInput.trim()) {
      setManualLocation(manualAddressInput.trim());
      setManualAddressInput('');
    }
  };

  const handleQuickAreaSelect = (area) => {
    setManualLocation(area.name, { lat: area.lat, lng: area.lng });
  };

  const handleToggleSharing = () => {
    setIsLiveSharingActive(!isLiveSharingActive);
  };

  // Distance between selected worker and selected job/user
  const mutualDistance =
    selectedWorker && (selectedJob || userLocation)
      ? calculateDistanceKm(
          selectedWorker.lat,
          selectedWorker.lng,
          selectedJob ? selectedJob.lat : userLocation.lat,
          selectedJob ? selectedJob.lng : userLocation.lng
        )
      : null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Two-Way Location Sharing & Transit Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Interactive Workforce Navigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Workers view job site coordinates; employers inspect incoming worker locations with complete privacy control.
          </p>
        </div>

        {/* Live Sharing Status Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveSharingActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-800">
              {isLiveSharingActive ? 'My Live Sharing: ACTIVE' : 'Sharing Paused'}
            </span>
            <button
              onClick={handleToggleSharing}
              className="ml-2 text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
            >
              {isLiveSharingActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Permission / Denied Notice if applicable */}
      {userLocation?.status === 'denied' && (
        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-bold">GPS Permission Denied in Browser:</strong>
            Location access was blocked. No worries! You can select any local area below or type your manual site address.
          </div>
        </div>
      )}

      {/* Main Map & Control Layout */}
      <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 h-[600px] flex flex-col">
          <InteractiveMap
            workers={workers}
            jobs={jobs}
            userLocation={userLocation}
            selectedWorker={selectedWorker}
            selectedJob={selectedJob}
            onSelectWorker={(w) => setSelectedWorkerId(w.id)}
            onSelectJob={(j) => setSelectedJobId(j.id)}
            onBookWorker={(w) => setBookingWorker(w)}
            isLiveSharingActive={isLiveSharingActive}
            onToggleLiveSharing={handleToggleSharing}
            onRefreshGps={refreshGpsLocation}
            gpsStatus={userLocation?.status || 'idle'}
          />
        </div>

        {/* Right Column: Two-Way Pairing Controls & Location Customization */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* 1. Pairing Selector Card */}
          <div className="card-base p-5 border-blue-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Two-Way Route Pairing</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </h3>

            {/* Select Job / Employer Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                A. Employer / Job Site
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="">Use My Device Location ({userLocation?.address?.slice(0, 24)}...)</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    Job: {j.title.slice(0, 32)}... (₹{j.offeredWage}/day)
                  </option>
                ))}
              </select>
            </div>

            {/* Select Worker Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                B. Daily-Wage Worker
              </label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="">-- Choose a Worker to Pair --</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.category.replace('-', ' ')}) — {w.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Route & Distance Output */}
            {selectedWorker && (
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Calculated Distance:</span>
                  <strong className="text-blue-700 font-extrabold text-sm">
                    {formatDistance(mutualDistance)}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Est. Travel Time:</span>
                  <strong className="text-slate-900">{estimateTravelTime(mutualDistance)}</strong>
                </div>

                <div className="pt-2 border-t border-blue-200 flex items-center gap-2">
                  <a
                    href={`tel:${selectedWorker.phone}`}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Worker</span>
                  </a>
                  <button
                    onClick={() => setBookingWorker(selectedWorker)}
                    className="flex-1 btn-primary py-1.5 px-2 text-xs justify-center font-bold"
                  >
                    <span>Book Worker</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Device Location / Manual Geocoding Card */}
          <div className="card-base p-5 border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Your Device Location</span>
              <button
                onClick={refreshGpsLocation}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>GPS Refresh</span>
              </button>
            </h3>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <p className="text-slate-700 font-medium truncate">{userLocation?.address}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Lat: {userLocation?.lat?.toFixed(4)}, Lng: {userLocation?.lng?.toFixed(4)}</span>
                <span className="text-emerald-600 font-semibold">{userLocation?.accuracy || 'Set'}</span>
              </div>
            </div>

            {/* Manual Address Input */}
            <form onSubmit={handleManualLocationSubmit} className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Or Manually Set Area / Landmark:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Bandra, Dadar, Powai..."
                  value={manualAddressInput}
                  onChange={(e) => setManualAddressInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="btn-secondary py-1.5 px-3 text-xs font-bold shrink-0"
                >
                  Set
                </button>
              </div>
            </form>

            {/* Quick Click Local Areas */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Quick Select Hubs:</span>
              <div className="flex flex-wrap gap-1">
                {KNOWN_LOCAL_AREAS.slice(0, 6).map((area) => (
                  <button
                    key={area.name}
                    type="button"
                    onClick={() => handleQuickAreaSelect(area)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    {area.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Real-Time Tracking & Backend Limitations Notice */}
          <div className="card-base p-4 border-slate-200 shadow-sm bg-slate-50/50 text-xs space-y-2 text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Location Architecture Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • Real-time continuous GPS tracking operates only with user permission and an active WebSocket/MQTT service.
              <br />
              • In this prototype, the last known / manually selected coordinates are plotted to protect battery and privacy.
              <br />
              • Powered by OpenStreetMap (free, zero API key required).
            </p>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {bookingWorker && (
        <BookingModal
          isOpen={Boolean(bookingWorker)}
          onClose={() => setBookingWorker(null)}
          worker={bookingWorker}
          preselectedJob={selectedJob}
        />
      )}

    </div>
  );
}
