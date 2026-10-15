import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_WORKERS, INITIAL_JOBS, INITIAL_BOOKINGS, WORKER_CATEGORIES } from '../data/mockData';
import { estimateCoordinates, requestBrowserGpsLocation } from '../utils/geoUtils';

const WorkForceContext = createContext(null);

const STORAGE_KEYS = {
  WORKERS: 'workforce_workers_v1',
  JOBS: 'workforce_jobs_v1',
  BOOKINGS: 'workforce_bookings_v1',
  MAP_SETTINGS: 'workforce_map_settings_v1',
  USER_LOCATION: 'workforce_user_location_v1',
  LIVE_SHARING: 'workforce_live_sharing_v1',
};

export function WorkForceProvider({ children }) {
  // 1. Workers State
  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKERS);
      return saved ? JSON.parse(saved) : INITIAL_WORKERS;
    } catch (e) {
      console.warn('Failed to parse saved workers, loading seed data:', e);
      return INITIAL_WORKERS;
    }
  });

  // 2. Jobs State
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch (e) {
      console.warn('Failed to parse saved jobs, loading seed data:', e);
      return INITIAL_JOBS;
    }
  });

  // 3. Bookings State
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch (e) {
      console.warn('Failed to parse saved bookings, loading seed data:', e);
      return INITIAL_BOOKINGS;
    }
  });

  // 4. Map & API Settings
  const [mapSettings, setMapSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAP_SETTINGS);
      return saved
        ? JSON.parse(saved)
        : {
            provider: 'leaflet', // 'leaflet' (OpenStreetMap) or 'google'
            googleApiKey: '',
            enableLiveWatch: false,
          };
    } catch (e) {
      return { provider: 'leaflet', googleApiKey: '', enableLiveWatch: false };
    }
  });

  // 5. Current User / Device Location & Privacy Sharing State
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      return saved
        ? JSON.parse(saved)
        : {
            lat: 19.1136,
            lng: 72.8697,
            address: 'Andheri East, Mumbai',
            isGps: false,
            accuracy: null,
            status: 'idle', // 'idle' | 'requesting' | 'granted' | 'denied' | 'error'
            errorMessage: null,
            lastUpdated: new Date().toLocaleTimeString(),
          };
    } catch (e) {
      return {
        lat: 19.1136,
        lng: 72.8697,
        address: 'Andheri East, Mumbai',
        isGps: false,
        accuracy: null,
        status: 'idle',
        errorMessage: null,
        lastUpdated: new Date().toLocaleTimeString(),
      };
    }
  });

  const [isLiveSharingActive, setIsLiveSharingActive] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIVE_SHARING);
      return saved ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
    } catch (e) {
      console.error('Storage quota or error saving workers:', e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error('Storage quota or error saving jobs:', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Storage quota or error saving bookings:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MAP_SETTINGS, JSON.stringify(mapSettings));
    } catch (e) {
      console.error('Error saving map settings:', e);
    }
  }, [mapSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(userLocation));
    } catch (e) {
      console.error('Error saving user location:', e);
    }
  }, [userLocation]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIVE_SHARING, JSON.stringify(isLiveSharingActive));
    } catch (e) {
      console.error('Error saving live sharing toggle:', e);
    }
  }, [isLiveSharingActive]);

  // Request browser GPS position with full graceful handling
  const refreshGpsLocation = async () => {
    setUserLocation((prev) => ({ ...prev, status: 'requesting', errorMessage: null }));
    try {
      const pos = await requestBrowserGpsLocation();
      const updated = {
        lat: pos.lat,
        lng: pos.lng,
        address: `GPS Location (Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)})`,
        isGps: true,
        accuracy: `${pos.accuracy}m`,
        status: 'granted',
        errorMessage: null,
        lastUpdated: pos.timestamp,
      };
      setUserLocation(updated);
      return { success: true, location: updated };
    } catch (err) {
      const updated = {
        ...userLocation,
        status: err.code === 'PERMISSION_DENIED' ? 'denied' : 'error',
        errorMessage: err.message,
      };
      setUserLocation(updated);
      return { success: false, error: err };
    }
  };

  // Set manual user location
  const setManualLocation = (address, customCoords = null) => {
    const coords = customCoords || estimateCoordinates(address);
    const updated = {
      lat: coords.lat,
      lng: coords.lng,
      address: address || 'Custom Selected Location',
      isGps: false,
      accuracy: 'Manual Entry',
      status: 'granted',
      errorMessage: null,
      lastUpdated: new Date().toLocaleTimeString(),
    };
    setUserLocation(updated);
  };

  // Worker Registration Action
  const registerWorker = (workerData) => {
    // Validate required fields
    const errors = {};
    if (!workerData.name?.trim()) errors.name = 'Full name is required';
    
    // Clean and validate phone number
    const cleanPhone = (workerData.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit mobile phone number is required';
    }

    if (!workerData.location?.trim()) errors.location = 'Work location / area is required';
    if (!workerData.category) errors.category = 'Category is required';
    if (!workerData.dailyWage || Number(workerData.dailyWage) <= 0) {
      errors.dailyWage = 'Expected daily wage must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    // Estimate coordinates if not already provided
    const coords = (workerData.lat && workerData.lng)
      ? { lat: Number(workerData.lat), lng: Number(workerData.lng) }
      : estimateCoordinates(workerData.location);

    const newWorker = {
      id: `w-${Date.now()}`,
      name: workerData.name.trim(),
      phone: cleanPhone,
      location: workerData.location.trim(),
      lat: coords.lat,
      lng: coords.lng,
      category: workerData.category,
      skills: Array.isArray(workerData.skills)
        ? workerData.skills
        : (workerData.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      experience: Number(workerData.experience) || 1,
      dailyWage: Number(workerData.dailyWage),
      availability: workerData.availability || 'Available Today',
      photo: workerData.photo?.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(workerData.name)}`,
      bio: workerData.bio?.trim() || 'Hardworking local professional ready for immediate daily wage work.',
      rating: 5.0,
      reviewsCount: 1,
      completedJobs: 0,
      isLiveSharing: true,
      lastSharedAt: 'Just now',
      gpsAccuracy: 'Registered Location',
      createdAt: new Date().toISOString(),
    };

    setWorkers((prev) => [newWorker, ...prev]);
    return { success: true, worker: newWorker };
  };

  // Sync a user's professional profile to the platform's workers list
  const syncUserWorker = (userId, userDetails, workerProfile) => {
    if (!workerProfile) {
      setWorkers((prev) => prev.filter((w) => w.userId !== userId && w.id !== `w-user-${userId}`));
      return;
    }
    const workerId = `w-user-${userId}`;
    const coords = (workerProfile.lat && workerProfile.lng)
      ? { lat: Number(workerProfile.lat), lng: Number(workerProfile.lng) }
      : estimateCoordinates(workerProfile.location || 'Mumbai, Maharashtra');

    const updatedWorker = {
      id: workerId,
      userId: userId,
      name: userDetails.fullName || userDetails.name,
      phone: (userDetails.phone || '').replace(/\D/g, ''),
      location: workerProfile.location?.trim() || 'Mumbai, Maharashtra',
      lat: coords.lat,
      lng: coords.lng,
      category: workerProfile.category || 'construction',
      skills: Array.isArray(workerProfile.skills)
        ? workerProfile.skills
        : (workerProfile.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      experience: Number(workerProfile.experience) || 1,
      dailyWage: Number(workerProfile.dailyWage) || 750,
      availability: workerProfile.availability || 'Available Today',
      photo: userDetails.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userDetails.fullName || 'Worker')}&backgroundColor=2563EB&textColor=ffffff`,
      bio: workerProfile.bio?.trim() || 'Hardworking professional available for direct daily-wage work.',
      rating: 5.0,
      reviewsCount: 1,
      completedJobs: 0,
      isLiveSharing: true,
      lastSharedAt: 'Just now',
      gpsAccuracy: 'User Profile Location',
      createdAt: new Date().toISOString(),
    };

    setWorkers((prev) => {
      const idx = prev.findIndex((w) => w.userId === userId || w.id === workerId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedWorker };
        return copy;
      }
      return [updatedWorker, ...prev];
    });

    return updatedWorker;
  };

  const removeUserWorker = (userId) => {
    setWorkers((prev) => prev.filter((w) => w.userId !== userId && w.id !== `w-user-${userId}`));
  };

  // Job Posting Action
  const postJob = (jobData) => {
    const errors = {};
    if (!jobData.title?.trim()) errors.title = 'Job title is required';
    if (!jobData.category) errors.category = 'Job category is required';
    if (!jobData.description?.trim()) errors.description = 'Job description is required';
    if (!jobData.location?.trim()) errors.location = 'Job location is required';
    if (!jobData.workDate) errors.workDate = 'Work date is required';
    if (!jobData.workersNeeded || Number(jobData.workersNeeded) < 1) {
      errors.workersNeeded = 'Must require at least 1 worker';
    }
    if (!jobData.offeredWage || Number(jobData.offeredWage) <= 0) {
      errors.offeredWage = 'Offered wage must be greater than 0';
    }
    if (!jobData.employerName?.trim()) errors.employerName = 'Employer name is required';
    
    const cleanPhone = (jobData.employerPhone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.employerPhone = 'Valid 10-digit employer contact number is required';
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const coords = (jobData.lat && jobData.lng)
      ? { lat: Number(jobData.lat), lng: Number(jobData.lng) }
      : estimateCoordinates(jobData.location);

    const newJob = {
      id: `job-${Date.now()}`,
      title: jobData.title.trim(),
      category: jobData.category,
      description: jobData.description.trim(),
      location: jobData.location.trim(),
      lat: coords.lat,
      lng: coords.lng,
      workDate: jobData.workDate,
      duration: jobData.duration || '1 Day',
      workersNeeded: Number(jobData.workersNeeded),
      workersHired: 0,
      offeredWage: Number(jobData.offeredWage),
      employerName: jobData.employerName.trim(),
      employerPhone: cleanPhone,
      employerCompany: jobData.employerCompany?.trim() || 'Independent Employer',
      status: 'Open',
      urgency: jobData.urgency || 'Immediate',
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
    return { success: true, job: newJob };
  };

  // Booking Creation Action
  const createBooking = ({
    workerId,
    jobId = null,
    workDate,
    location,
    lat = null,
    lng = null,
    agreedWage,
    employerName,
    employerPhone,
    notes = '',
  }) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) {
      return { success: false, error: 'Worker not found' };
    }

    const job = jobId ? jobs.find((j) => j.id === jobId) : null;
    const bookingLat = lat || (job ? job.lat : worker.lat);
    const bookingLng = lng || (job ? job.lng : worker.lng);

    const newBooking = {
      id: `bkg-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerCategory: worker.category,
      jobId: job ? job.id : null,
      jobTitle: job ? job.title : `Direct Hire for ${worker.name}`,
      employerName: employerName || 'Direct Employer',
      employerPhone: employerPhone || '9800000000',
      workDate: workDate || new Date().toISOString().split('T')[0],
      location: location || (job ? job.location : worker.location),
      lat: bookingLat,
      lng: bookingLng,
      agreedWage: Number(agreedWage) || Number(worker.dailyWage),
      status: 'Pending', // 'Pending' | 'Accepted' | 'Rejected' | 'Completed'
      notes: notes || 'Direct booking created without platform commissions.',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // If linked to an open job, update hired count
    if (job) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                workersHired: Math.min(j.workersNeeded, (j.workersHired || 0) + 1),
                status: (j.workersHired || 0) + 1 >= j.workersNeeded ? 'Filled' : 'Open',
              }
            : j
        )
      );
    }

    return { success: true, booking: newBooking };
  };

  // Booking Status Update Action
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Toggle location sharing for a worker
  const toggleWorkerLocationSharing = (workerId) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              isLiveSharing: !w.isLiveSharing,
              lastSharedAt: !w.isLiveSharing ? 'Just now' : 'Sharing stopped',
            }
          : w
      )
    );
  };

  // Reset to initial demo data
  const resetToDefaultData = () => {
    setWorkers(INITIAL_WORKERS);
    setJobs(INITIAL_JOBS);
    setBookings(INITIAL_BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.WORKERS);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  };

  // Computed platform statistics
  const stats = {
    totalWorkers: workers.length,
    availableWorkers: workers.filter((w) => w.availability.includes('Available')).length,
    totalJobs: jobs.length,
    openJobs: jobs.filter((j) => j.status === 'Open').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
    acceptedBookings: bookings.filter((b) => b.status === 'Accepted').length,
    completedBookings: bookings.filter((b) => b.status === 'Completed').length,
    // Calculate 100% direct wages passed directly to workers without commission
    directWagesVolume: bookings
      .filter((b) => b.status === 'Accepted' || b.status === 'Completed')
      .reduce((sum, b) => sum + (Number(b.agreedWage) || 0), 0),
    avgDailyWage:
      workers.length > 0
        ? Math.round(workers.reduce((sum, w) => sum + Number(w.dailyWage || 0), 0) / workers.length)
        : 750,
  };

  const value = {
    workers,
    jobs,
    bookings,
    categories: WORKER_CATEGORIES,
    stats,
    userLocation,
    mapSettings,
    setMapSettings,
    isLiveSharingActive,
    setIsLiveSharingActive,
    refreshGpsLocation,
    setManualLocation,
    registerWorker,
    syncUserWorker,
    removeUserWorker,
    postJob,
    createBooking,
    updateBookingStatus,
    toggleWorkerLocationSharing,
    resetToDefaultData,
  };

  return <WorkForceContext.Provider value={value}>{children}</WorkForceContext.Provider>;
}

export function useWorkForce() {
  const context = useContext(WorkForceContext);
  if (!context) {
    throw new Error('useWorkForce must be used within a WorkForceProvider');
  }
  return context;
}
