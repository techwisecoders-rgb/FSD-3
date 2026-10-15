import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Sparkles,
  ShieldCheck,
  Phone,
  ArrowRight,
  HardHat,
  Truck,
  Package,
  CalendarCheck,
  Paintbrush,
  Clock,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { WORKER_CATEGORIES } from '../data/mockData';
import { formatDistance, calculateDistanceKm } from '../utils/geoUtils';
import WorkflowScene from '../components/three/WorkflowScene';
import BookingModal from '../components/BookingModal';

export default function HomePage() {
  const navigate = useNavigate();
  const { workers, jobs, stats, userLocation } = useWorkForce();

  const [searchCategory, setSearchCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory) params.set('category', searchCategory);
    if (searchQuery) params.set('q', searchQuery);
    navigate(`/workers?${params.toString()}`);
  };

  // Get immediate available workers
  const readyWorkers = workers.filter((w) => w.availability === 'Available Today').slice(0, 4);

  // Get active open jobs
  const urgentJobs = jobs.filter((j) => j.status === 'Open').slice(0, 3);

  // Category Icon Resolver
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Hammer': return HardHat;
      case 'Truck': return Truck;
      case 'Package': return Package;
      case 'Sparkles': return Sparkles;
      case 'CalendarCheck': return CalendarCheck;
      case 'Users': return Users;
      case 'Paintbrush': return Paintbrush;
      default: return Briefcase;
    }
  };

  return (
    <div className="pt-20 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition & Search Bar */}
          <div className="lg:col-span-7 flex flex-col z-10">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 w-fit mb-5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Direct Daily-Wage Workforce Network • 0% Commission
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
              Hire Verified <span className="text-blue-600">Daily Workers</span> Near You in Minutes.
            </h1>

            {/* Sub-Headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Connect directly with local construction labourers, packers and movers, loaders, cleaners, event staff, and general labourers. Instant direct phone calls, two-way location sharing, and zero platform cuts.
            </p>

            {/* Quick Hero Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 bg-white rounded-2xl border border-blue-200 shadow-xl shadow-blue-500/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl mb-6"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Skills (e.g. Mason, Packing, Unloading)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="sm:w-56 px-3 py-2">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-transparent focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {WORKER_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary py-2.5 px-5 text-xs justify-center shrink-0 font-bold"
              >
                <span>Find Workers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Live Stats Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl pt-4 border-t border-slate-200">
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-blue-600">{stats.availableWorkers}+</span>
                <span className="text-[11px] font-semibold text-slate-500">Available Today</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900">{stats.openJobs}</span>
                <span className="text-[11px] font-semibold text-slate-500">Open Job Posts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-emerald-600">0%</span>
                <span className="text-[11px] font-semibold text-slate-500">Platform Fee</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900">₹{stats.avgDailyWage}</span>
                <span className="text-[11px] font-semibold text-slate-500">Avg. Daily Wage</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Canvas / Network Scene */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[460px] rounded-3xl bg-white border border-blue-100 shadow-2xl shadow-blue-500/10 overflow-hidden p-2">
              <WorkflowScene className="w-full h-full rounded-2xl" />

              {/* Top Floating Badge inside 3D canvas */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-blue-200 px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Live Workforce Mesh
                </span>
              </div>

              {/* Bottom Floating Hint */}
              <div className="absolute bottom-4 right-4 bg-blue-50/90 backdrop-blur-md border border-blue-200 px-3 py-1 rounded-full text-[10px] text-blue-900 font-semibold pointer-events-none">
                Interactive daily-wage network
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Quick Action Pillars */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            to="/workers"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Browse Daily Workers
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Filter by daily wage rate, trade experience, and location availability.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
              View Directory <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            to="/post-job"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Post an Urgent Need
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Need workers today? Post work dates, wages, and site coordinates instantly.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
              Post Work Request <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            to="/match"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                Smart Matchmaker
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Algorithmic score based on category, skills, distance, and wage alignment.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
              Launch Match Engine <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            to="/map"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                Two-Way Live Map
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                View mutual locations, GPS proximity, and travel directions between site & worker.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
              Explore Live Map <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

        </div>
      </section>

      {/* 3. Daily Worker Categories */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Workforce Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Daily-Wage Labour Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Direct hourly and daily-wage hires across residential and commercial trades.
            </p>
          </div>

          <Link
            to="/workers"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View all workers ({workers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WORKER_CATEGORIES.map((cat) => {
            const IconComponent = getCategoryIcon(cat.iconName);
            const count = workers.filter((w) => w.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/workers?category=${cat.id}`}
                className="card-base p-5 hover:-translate-y-1 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: cat.bgLight, color: cat.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {count} available
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cat.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Typical Wage:</span>
                  <span className="font-bold text-slate-800">{cat.typicalWage}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Urgent Today / Open Jobs */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50/50 rounded-3xl border border-blue-100 my-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Urgent Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Jobs Needing Daily Labourers Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Employers with immediate cash-ready positions. Call directly or match.
            </p>
          </div>

          <Link
            to="/jobs"
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse All {jobs.length} Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {urgentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {job.category.replace('-', ' ')}
                  </span>
                  <span className="text-sm font-extrabold text-blue-600">
                    ₹{job.offeredWage}/day
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {job.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Date: {job.workDate} ({job.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.workersNeeded} workers needed ({job.workersHired} hired)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${job.employerPhone}`}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Employer</span>
                </a>
                <Link
                  to={`/match?jobId=${job.id}`}
                  className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition"
                  title="Find Best Workers for this Job"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Workers Ready for Immediate Hire */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Verified Daily Labour Force
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Workers Ready for Immediate Deployment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Contact directly via mobile with full location sharing and zero fees.
            </p>
          </div>

          <Link
            to="/workers"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View Full Workforce Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {readyWorkers.map((worker) => {
            const dist = userLocation?.lat
              ? calculateDistanceKm(userLocation.lat, userLocation.lng, worker.lat, worker.lng)
              : null;

            return (
              <div
                key={worker.id}
                className="card-base p-4 flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div>
                  <div className="relative mb-3">
                    <img
                      src={worker.photo}
                      alt={worker.name}
                      className="w-full h-36 rounded-xl object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-xs">
                      {worker.category.replace('-', ' ')}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-md text-xs font-extrabold shadow-sm">
                      ₹{worker.dailyWage}/day
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{worker.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{worker.experience} Years Experience</p>

                  <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{worker.location} {dist ? `(${formatDistance(dist)})` : ''}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {worker.skills.slice(0, 2).map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${worker.phone}`}
                    className="flex-1 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => setSelectedWorkerForBooking(worker)}
                    className="flex-1 btn-primary py-2 px-2.5 text-xs justify-center"
                  >
                    <span>Book</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Why WorkForce Connect (Zero Commission Pledge) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Direct Economic Empowerment</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              0% Platform Commission. 100% Direct Pay to Workers.
            </h2>

            <p className="mt-4 text-blue-100 text-sm sm:text-base leading-relaxed">
              Unlike traditional agency middlemen and gig aggregators that take 20% to 30% from vulnerable daily-wage workers, WorkForce Connect provides free direct matching, verified phone numbers, and location navigation.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-blue-500/50">
              <div>
                <h4 className="font-bold text-white text-sm">Direct Phone Calling</h4>
                <p className="text-xs text-blue-200 mt-1">Talk to the worker immediately. Clarify site details, tools, and timings without intermediaries.</p>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Two-Way Map Sharing</h4>
                <p className="text-xs text-blue-200 mt-1">Workers view site pins, employers see incoming transit markers with full user privacy toggles.</p>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Fair Market Daily Wages</h4>
                <p className="text-xs text-blue-200 mt-1">Workers set their expected daily rate. Employers pay directly via cash or UPI.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup?mode=worker"
                className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-bold rounded-xl text-xs transition"
              >
                Register Free (Worker & Employer)
              </Link>
              <Link
                to="/post-job"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-900 border border-white/20 text-white font-bold rounded-xl text-xs transition"
              >
                Post Daily Work Requirement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedWorkerForBooking && (
        <BookingModal
          isOpen={Boolean(selectedWorkerForBooking)}
          onClose={() => setSelectedWorkerForBooking(null)}
          worker={selectedWorkerForBooking}
        />
      )}

    </div>
  );
}
