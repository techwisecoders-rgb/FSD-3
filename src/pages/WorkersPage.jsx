import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Phone,
  HardHat,
  X,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { WORKER_CATEGORIES } from '../data/mockData';
import { calculateDistanceKm, formatDistance } from '../utils/geoUtils';
import BookingModal from '../components/BookingModal';

export default function WorkersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { workers, userLocation } = useWorkForce();

  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [maxWage, setMaxWage] = useState(1500);
  const [sortBy, setSortBy] = useState('recommended');

  const [bookingWorker, setBookingWorker] = useState(null);

  // Filter & Sort Logic
  const filteredWorkers = useMemo(() => {
    return workers
      .filter((w) => {
        // Keyword Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = w.name.toLowerCase().includes(q);
          const matchesSkills = w.skills.some((s) => s.toLowerCase().includes(q));
          const matchesLoc = w.location.toLowerCase().includes(q);
          const matchesBio = w.bio.toLowerCase().includes(q);
          if (!matchesName && !matchesSkills && !matchesLoc && !matchesBio) return false;
        }

        // Category Filter
        if (selectedCategory && w.category !== selectedCategory) return false;

        // Availability Filter
        if (selectedAvailability && w.availability !== selectedAvailability) return false;

        // Max Daily Wage
        if (Number(w.dailyWage) > maxWage) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'wage-low') return a.dailyWage - b.dailyWage;
        if (sortBy === 'wage-high') return b.dailyWage - a.dailyWage;
        if (sortBy === 'experience') return b.experience - a.experience;
        if (sortBy === 'rating') return b.rating - a.rating;

        // Nearest Distance if coordinates available
        if (sortBy === 'distance' && userLocation?.lat) {
          const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) || 999;
          const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng) || 999;
          return distA - distB;
        }

        return 0; // Default recommended
      });
  }, [workers, searchQuery, selectedCategory, selectedAvailability, maxWage, sortBy, userLocation]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAvailability('');
    setMaxWage(1500);
    setSortBy('recommended');
    setSearchParams({});
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Workforce Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Find Local Daily-Wage Labourers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directly call and book verified local workers without middleman commissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register-worker"
            className="btn-primary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Register as Worker</span>
          </Link>
          <Link
            to="/map"
            className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>View All on Map</span>
          </Link>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="my-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
        
        {/* Top search & sorting inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search by worker name, skill, area (e.g. Mason, Packing, Dadar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">Any Availability</option>
              <option value="Available Today">Available Today</option>
              <option value="Available Tomorrow">Available Tomorrow</option>
              <option value="Available This Weekend">Available This Weekend</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="distance">Sort: Nearest Distance</option>
              <option value="wage-low">Sort: Wage (Low to High)</option>
              <option value="wage-high">Sort: Wage (High to Low)</option>
              <option value="experience">Sort: Experience (Years)</option>
              <option value="rating">Sort: Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Wage Slider */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Category Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Trades ({workers.length})
            </button>
            {WORKER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>

          {/* Wage Slider & Reset */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">
                Max Wage: <strong className="text-slate-800">₹{maxWage}/day</strong>
              </span>
              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={maxWage}
                onChange={(e) => setMaxWage(Number(e.target.value))}
                className="w-24 sm:w-32 accent-blue-600"
              />
            </div>

            {(searchQuery || selectedCategory || selectedAvailability || maxWage < 1500) && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-600">
          Showing <strong className="text-slate-900">{filteredWorkers.length}</strong> verified daily-wage workers
        </span>
        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
          0% Platform Commissions • Direct Phone Contact
        </span>
      </div>

      {/* Workers Grid */}
      {filteredWorkers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching daily workers found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try broadening your search term or adjusting category and wage filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 btn-secondary py-2 px-4 text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => {
            const dist = userLocation?.lat
              ? calculateDistanceKm(userLocation.lat, userLocation.lng, worker.lat, worker.lng)
              : null;

            return (
              <div
                key={worker.id}
                className="card-base p-5 flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div>
                  {/* Top Bar with Photo & Quick Meta */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <img
                      src={worker.photo}
                      alt={worker.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {worker.category.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <span>★ {worker.rating}</span>
                          <span className="text-slate-400 font-normal">({worker.completedJobs} jobs)</span>
                        </div>
                      </div>
                      <Link
                        to={`/workers/${worker.id}`}
                        className="font-bold text-slate-900 text-base leading-snug truncate hover:text-blue-700 transition-colors"
                      >
                        {worker.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {worker.experience} Years Practical Experience
                      </p>
                    </div>
                  </div>

                  {/* Location & Availability Badges */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-slate-600 truncate">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{worker.location}</span>
                      </div>
                      {dist && (
                        <span className="text-[11px] font-bold text-blue-600 shrink-0">
                          {formatDistance(dist)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-[11px]">{worker.availability}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {worker.bio}
                  </p>

                  {/* Skills Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {worker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Footer: Daily Wage & Direct Actions */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500 font-medium">Expected Daily Wage</span>
                    <span className="text-base font-extrabold text-blue-700">
                      ₹{worker.dailyWage} <span className="text-xs font-normal text-slate-400">/ day</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${worker.phone}`}
                      className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      title="Direct Call (0% Platform Fee)"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <Link
                      to={`/map?workerId=${worker.id}`}
                      className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      title="View Worker Location on Map"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Map</span>
                    </Link>

                    <button
                      onClick={() => setBookingWorker(worker)}
                      className="btn-primary py-2 px-2 text-xs justify-center font-bold"
                    >
                      <span>Book</span>
                    </button>
                  </div>

                  <Link
                    to={`/workers/${worker.id}`}
                    className="mt-2 flex items-center justify-center gap-1 w-full py-1.5 text-[11px] font-bold text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200 transition-all"
                  >
                    View Full Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {bookingWorker && (
        <BookingModal
          isOpen={Boolean(bookingWorker)}
          onClose={() => setBookingWorker(null)}
          worker={bookingWorker}
        />
      )}

    </div>
  );
}
