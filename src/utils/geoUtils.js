/**
 * Geolocation & Distance Utilities for WorkForce Connect
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates distance in kilometers between two lat/lng pairs using the Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Formats distance into a human readable string
 */
export function formatDistance(km) {
  if (km === null || km === undefined) return 'Distance unknown';
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

/**
 * Estimates travel time based on typical urban transit / auto
 */
export function estimateTravelTime(km) {
  if (!km) return '15-20 mins';
  if (km < 2) return '5-10 mins (Quick reach)';
  if (km < 5) return '12-20 mins';
  if (km < 10) return '25-35 mins';
  return '45-60 mins';
}

/**
 * Default fallback coordinates (Mumbai Metro center)
 */
export const DEFAULT_MAP_CENTER = {
  lat: 19.0760,
  lng: 72.8777,
  zoom: 12,
  city: 'Mumbai Metro',
};

/**
 * Known local area coordinates for instant geocoding when typed in forms
 */
export const KNOWN_LOCAL_AREAS = [
  { name: 'Andheri East', lat: 19.1136, lng: 72.8697 },
  { name: 'Andheri West', lat: 19.1197, lng: 72.8468 },
  { name: 'Bandra West', lat: 19.0596, lng: 72.8295 },
  { name: 'Bandra Kurla Complex (BKC)', lat: 19.0660, lng: 72.8670 },
  { name: 'Kurla West', lat: 19.0726, lng: 72.8845 },
  { name: 'Dadar Central', lat: 19.0178, lng: 72.8478 },
  { name: 'Lower Parel', lat: 18.9950, lng: 72.8300 },
  { name: 'Goregaon East', lat: 19.1646, lng: 72.8595 },
  { name: 'Powai Tech City', lat: 19.1176, lng: 72.9060 },
  { name: 'Malad West', lat: 19.1860, lng: 72.8485 },
  { name: 'Borivali West', lat: 19.2307, lng: 72.8567 },
  { name: 'Thane West', lat: 19.2183, lng: 72.9781 },
  { name: 'Navi Mumbai (Vashi)', lat: 19.0771, lng: 72.9986 },
];

/**
 * Geocode helper to estimate coordinates from string location
 */
export function estimateCoordinates(locationString) {
  if (!locationString) return { lat: DEFAULT_MAP_CENTER.lat, lng: DEFAULT_MAP_CENTER.lng };
  
  const lower = locationString.toLowerCase();
  for (const area of KNOWN_LOCAL_AREAS) {
    if (lower.includes(area.name.toLowerCase().split(' ')[0])) {
      // Add slight randomized jitter (±0.005) so multiple workers in same area don't stack perfectly on top of each other
      const jitterLat = (Math.random() - 0.5) * 0.008;
      const jitterLng = (Math.random() - 0.5) * 0.008;
      return {
        lat: Number((area.lat + jitterLat).toFixed(4)),
        lng: Number((area.lng + jitterLng).toFixed(4)),
      };
    }
  }

  // Fallback around default center with small jitter
  return {
    lat: Number((DEFAULT_MAP_CENTER.lat + (Math.random() - 0.5) * 0.04).toFixed(4)),
    lng: Number((DEFAULT_MAP_CENTER.lng + (Math.random() - 0.5) * 0.04).toFixed(4)),
  };
}

/**
 * Safe Browser Geolocation wrapper
 */
export function requestBrowserGpsLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 'NOT_SUPPORTED',
        message: 'Browser does not support GPS Geolocation.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date(position.timestamp).toLocaleTimeString(),
        });
      },
      (error) => {
        let errorMsg = 'Failed to retrieve location.';
        let code = 'UNKNOWN';

        if (error.code === error.PERMISSION_DENIED) {
          code = 'PERMISSION_DENIED';
          errorMsg = 'Location permission was denied by the user. You can manually enter an address instead.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          code = 'POSITION_UNAVAILABLE';
          errorMsg = 'Location information is currently unavailable on this device.';
        } else if (error.code === error.TIMEOUT) {
          code = 'TIMEOUT';
          errorMsg = 'GPS location request timed out. Retrying or manual selection recommended.';
        }

        reject({ code, message: errorMsg });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}
