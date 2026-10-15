import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Eye,
  EyeOff,
  Phone,
  Layers,
  Key,
  Info,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { calculateDistanceKm, formatDistance, estimateTravelTime } from '../utils/geoUtils';

// Fix Leaflet's default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons for Leaflet
function createCustomMarkerIcon(type, isSharing = false) {
  let bgColor = '#2563EB'; // Worker blue
  let iconHtml = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <polyline points="16 11 18 13 22 9"></polyline>
    </svg>
  `;

  if (type === 'job') {
    bgColor = '#D97706'; // Job Amber/Orange
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    `;
  } else if (type === 'user') {
    bgColor = '#10B981'; // Green User Location
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
    `;
  }

  const pulseRing = isSharing
    ? `<span style="position: absolute; inset: -5px; border-radius: 50%; background: ${bgColor}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>`
    : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        ${pulseRing}
        <div style="width: 36px; height: 36px; border-radius: 50%; background-color: ${bgColor}; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
          ${iconHtml}
        </div>
        <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid ${bgColor}; z-index: 1;"></div>
      </div>
    `,
    iconSize: [38, 44],
    iconAnchor: [19, 44],
    popupAnchor: [0, -42],
  });
}

export default function InteractiveMap({
  workers = [],
  jobs = [],
  userLocation = null,
  selectedWorker = null,
  selectedJob = null,
  onSelectWorker = null,
  onSelectJob = null,
  onBookWorker = null,
  isLiveSharingActive = true,
  onToggleLiveSharing = null,
  onRefreshGps = null,
  gpsStatus = 'idle',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [mapTileType, setMapTileType] = useState('osm'); // 'osm' or 'carto'
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [customKey, setCustomKey] = useState(localStorage.getItem('wf_custom_maps_key') || '');
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    const initialCenter = selectedJob
      ? [selectedJob.lat, selectedJob.lng]
      : selectedWorker
      ? [selectedWorker.lat, selectedWorker.lng]
      : userLocation?.lat
      ? [userLocation.lat, userLocation.lng]
      : [19.076, 72.8777];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Default Tile Layer: OpenStreetMap
    const tileUrl =
      mapTileType === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    });
    tiles.addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if switched
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Iterate and update tile layer
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    const tileUrl =
      mapTileType === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap & CartoDB',
    }).addTo(mapInstanceRef.current);
  }, [mapTileType]);

  // Render Markers and Two-Way Route
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // Remove existing route line
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    const bounds = L.latLngBounds();

    // 1. Plot User / Employer GPS Marker if available
    if (userLocation?.lat && userLocation?.lng && isLiveSharingActive) {
      const userLatLng = [userLocation.lat, userLocation.lng];
      bounds.extend(userLatLng);

      const userMarker = L.marker(userLatLng, {
        icon: createCustomMarkerIcon('user', true),
      });

      userMarker.bindPopup(`
        <div class="p-3 max-w-[220px]">
          <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Your Shared Position
          </div>
          <p class="text-xs font-semibold text-slate-800">${userLocation.address || 'Active Device Location'}</p>
          <p class="text-[11px] text-slate-500 mt-1">Accuracy: ${userLocation.accuracy || 'GPS Standard'}</p>
          <div class="mt-2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Live Location Sharing: ACTIVE
          </div>
        </div>
      `);

      layer.addLayer(userMarker);
    }

    // 2. Plot Workers
    workers.forEach((w) => {
      if (!w.lat || !w.lng) return;
      const latLng = [w.lat, w.lng];
      bounds.extend(latLng);

      const isSelected = selectedWorker?.id === w.id;
      const marker = L.marker(latLng, {
        icon: createCustomMarkerIcon('worker', w.isLiveSharing),
      });

      const dist = userLocation?.lat
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, w.lat, w.lng)
        : null;

      marker.bindPopup(`
        <div class="p-3.5 max-w-[250px] font-sans">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Daily Worker
            </span>
            <span class="text-xs font-bold text-slate-900">₹${w.dailyWage}/day</span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm leading-tight">${w.name}</h4>
          <p class="text-xs text-slate-600 capitalize mt-0.5">${w.category.replace('-', ' ')} • ${w.experience} yrs exp</p>
          
          <div class="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
            <div class="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${w.location} ${dist ? `(${formatDistance(dist)})` : ''}</span>
            </div>
            <div class="flex items-center gap-1 text-emerald-600 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>${w.availability}</span>
            </div>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <a href="tel:${w.phone}" class="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 text-center transition">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Call Direct
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectWorker) onSelectWorker(w);
      });

      layer.addLayer(marker);
    });

    // 3. Plot Jobs / Employer Locations
    jobs.forEach((j) => {
      if (!j.lat || !j.lng) return;
      const latLng = [j.lat, j.lng];
      bounds.extend(latLng);

      const marker = L.marker(latLng, {
        icon: createCustomMarkerIcon('job', false),
      });

      const dist = userLocation?.lat
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, j.lat, j.lng)
        : null;

      marker.bindPopup(`
        <div class="p-3.5 max-w-[250px] font-sans">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Job Site
            </span>
            <span class="text-xs font-bold text-amber-700">₹${j.offeredWage}/day</span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm leading-tight">${j.title}</h4>
          <p class="text-xs text-slate-600 mt-0.5">${j.employerName} • ${j.workersNeeded} workers needed</p>
          
          <div class="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
            <div class="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${j.location} ${dist ? `(${formatDistance(dist)})` : ''}</span>
            </div>
            <div class="flex items-center gap-1 text-slate-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Date: ${j.workDate} (${j.duration})</span>
            </div>
          </div>

          <div class="mt-3">
            <a href="tel:${j.employerPhone}" class="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Call Employer
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectJob) onSelectJob(j);
      });

      layer.addLayer(marker);
    });

    // 4. Two-Way Location Route Line (When worker & job or worker & user are paired)
    const pointA = selectedJob
      ? [selectedJob.lat, selectedJob.lng]
      : userLocation?.lat
      ? [userLocation.lat, userLocation.lng]
      : null;

    const pointB = selectedWorker
      ? [selectedWorker.lat, selectedWorker.lng]
      : null;

    if (pointA && pointB) {
      const line = L.polyline([pointA, pointB], {
        color: '#2563EB',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(map);

      routeLineRef.current = line;

      // Fit map to view both points
      const pairBounds = L.latLngBounds([pointA, pointB]);
      map.fitBounds(pairBounds, { padding: [60, 60], maxZoom: 14 });
    } else if (bounds.isValid() && workers.length + jobs.length > 0) {
      // Fit to all markers once
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [workers, jobs, userLocation, selectedWorker, selectedJob, isLiveSharingActive]);

  // Two-way calculation stats
  const routeDist =
    selectedWorker && (selectedJob || userLocation)
      ? calculateDistanceKm(
          selectedWorker.lat,
          selectedWorker.lng,
          selectedJob ? selectedJob.lat : userLocation.lat,
          selectedJob ? selectedJob.lng : userLocation.lng
        )
      : null;

  const handleSaveApiKey = () => {
    localStorage.setItem('wf_custom_maps_key', customKey.trim());
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setApiKeyModalOpen(false);
    }, 1500);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50">
      
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status & Location Sharing Controls */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md pointer-events-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveSharingActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-800">
              {isLiveSharingActive ? 'Location Sharing: ACTIVE' : 'Sharing Paused'}
            </span>
          </div>

          <button
            onClick={onToggleLiveSharing}
            aria-label="Toggle location sharing"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              isLiveSharingActive
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title={isLiveSharingActive ? 'Click to stop sharing location' : 'Click to share location'}
          >
            {isLiveSharingActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLiveSharingActive ? 'Pause' : 'Share'}</span>
          </button>
        </div>

        {/* Right Tools (GPS Refresh, Map Style, API Key Config) */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md pointer-events-auto">
          {/* GPS Auto-detect Button */}
          <button
            onClick={onRefreshGps}
            disabled={gpsStatus === 'requesting'}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            title="Detect My Real-Time GPS Location"
          >
            <Navigation className={`w-3.5 h-3.5 ${gpsStatus === 'requesting' ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden md:inline">
              {gpsStatus === 'requesting' ? 'Locating...' : 'My GPS'}
            </span>
          </button>

          <div className="w-px h-5 bg-slate-200 my-auto" />

          {/* Map Layer Switcher */}
          <button
            onClick={() => setMapTileType(mapTileType === 'osm' ? 'carto' : 'osm')}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            title="Switch Map Tiles (Street / Clean Voyager)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{mapTileType === 'osm' ? 'OSM' : 'Voyager'}</span>
          </button>

          <div className="w-px h-5 bg-slate-200 my-auto" />

          {/* Secure API Key / Backend Settings Modal Trigger */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            title="Configure Custom Google Maps or Backend Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">API Config</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] flex-1 z-10" />

      {/* Two-Way Pairing Information Banner (Displays when worker and job/user are selected) */}
      {selectedWorker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-blue-200 shadow-xl pointer-events-auto animate-in slide-in-from-bottom">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedWorker.photo}
                alt={selectedWorker.name}
                className="w-12 h-12 rounded-xl object-cover border border-blue-200 shadow-sm"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {selectedWorker.category.replace('-', ' ')}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{selectedWorker.name}</h4>
                <p className="text-xs text-slate-500">{selectedWorker.location}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Daily Wage</span>
              <p className="font-extrabold text-blue-700 text-base">₹{selectedWorker.dailyWage}</p>
            </div>
          </div>

          {/* Distance & Commute Metrics */}
          {routeDist !== null && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Distance: <strong className="text-slate-900">{formatDistance(routeDist)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Est. Commute: <strong className="text-slate-900">{estimateTravelTime(routeDist)}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Two-way actions */}
          <div className="mt-3 flex items-center gap-2">
            <a
              href={`tel:${selectedWorker.phone}`}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Worker</span>
            </a>

            {onBookWorker && (
              <button
                onClick={() => onBookWorker(selectedWorker)}
                className="flex-1 btn-primary py-2 px-3 text-xs justify-center"
              >
                <span>Initiate Booking</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend & Transparent Disclaimer Overlay */}
      <div className="absolute bottom-3 right-3 z-20 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 shadow-sm pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white"></span>
          <span>Worker</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></span>
          <span>Job Site</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          <span>You</span>
        </div>
      </div>

      {/* API Key / Provider Configuration Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Map & API Configuration</h3>
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-blue-950 font-bold mb-0.5">Active Mapping Provider: OpenStreetMap</strong>
                  WorkForce Connect is actively running on Leaflet + OpenStreetMap with zero external API key requirements. Markers, bidirectional route calculation, and GPS work out of the box without any credit card setup.
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Optional Google Maps Platform API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-blue-600"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Stored securely in your local browser storage. Used if enterprise Google Maps Services (Directions / Places) are linked.
                </p>
              </div>

              {keySavedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Configuration saved successfully!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApiKeyModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
