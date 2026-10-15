import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Phone,
  PlusCircle,
  Clock,
  Users,
  Sparkles,
  X,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { WORKER_CATEGORIES } from '../data/mockData';
import { calculateDistanceKm, formatDistance } from '../utils/geoUtils';

export default function JobsPage() {
  const { jobs, userLocation } = useWorkForce();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minWage, setMinWage] = useState(0);
  const [onlyOpen, setOnlyOpen] = useState(true);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (onlyOpen && j.status !== 'Open') return false;
      if (selectedCategory && j.category !== selectedCategory) return false;
      if (Number(j.offeredWage) < minWage) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(q);
        const matchesDesc = j.description.toLowerCase().includes(q);
        const matchesLoc = j.location.toLowerCase().includes(q);
        const matchesEmp = j.employerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesEmp) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedCategory, minWage, onlyOpen]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMinWage(0);
    setOnlyOpen(true);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Work Opportunities Board
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Browse Daily-Wage Job Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immediate site casting, packing, unloading, and cleaning shifts. Direct employer contact.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/post-job"
            className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Daily Job Need</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="my-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search by work title, description, employer, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">All Job Categories</option>
              {WORKER_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={(e) => setOnlyOpen(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Open Jobs Only</span>
            </label>
          </div>
        </div>

        {/* Filter Tags & Clear */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Showing <strong className="text-slate-900">{filteredJobs.length}</strong> active job postings
          </span>
          {(searchQuery || selectedCategory || !onlyOpen) && (
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching jobs found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or post a new daily work requirement.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={clearFilters} className="btn-secondary py-2 px-4 text-xs font-semibold">
              Reset Filters
            </button>
            <Link to="/post-job" className="btn-primary py-2 px-4 text-xs font-bold">
              Post This Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const dist = userLocation?.lat
              ? calculateDistanceKm(userLocation.lat, userLocation.lng, job.lat, job.lng)
              : null;

            return (
              <div
                key={job.id}
                className="card-base p-5 flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div>
                  {/* Top Bar with Category, Status & Wage */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {job.category.replace('-', ' ')}
                      </span>
                      {job.urgency && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {job.urgency}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Offered Wage</span>
                      <span className="text-base font-extrabold text-blue-700">
                        ₹{job.offeredWage} <span className="text-xs font-normal text-slate-500">/ day</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{job.location} {dist ? `(${formatDistance(dist)})` : ''}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{job.workDate} ({job.duration})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Need <strong>{job.workersNeeded}</strong> ({job.workersHired} hired)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <span className="truncate">{job.employerCompany || job.employerName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${job.employerPhone}`}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Employer</span>
                  </a>

                  <Link
                    to={`/match?jobId=${job.id}`}
                    className="flex-1 btn-primary py-2 px-3 text-xs justify-center font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Match Workers</span>
                  </Link>

                  <Link
                    to={`/map?jobId=${job.id}`}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center transition"
                    title="View Job Site on Map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
