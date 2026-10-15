import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  IndianRupee,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { WORKER_CATEGORIES } from '../data/mockData';

export default function JobPostingPage() {
  const navigate = useNavigate();
  const { postJob, refreshGpsLocation } = useWorkForce();

  const [formData, setFormData] = useState({
    title: '',
    category: 'construction',
    description: '',
    location: '',
    workDate: new Date().toISOString().split('T')[0],
    duration: '1 Day',
    workersNeeded: 2,
    offeredWage: 800,
    urgency: 'Immediate',
    employerName: '',
    employerPhone: '',
    employerCompany: '',
  });

  const [errors, setErrors] = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);

  const handleUseGps = async () => {
    setGpsLoading(true);
    const res = await refreshGpsLocation();
    setGpsLoading(false);
    if (res.success) {
      setFormData((prev) => ({
        ...prev,
        location: res.location.address,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = postJob(formData);
    if (res.success) {
      setCreatedJob(res.job);
    } else {
      setErrors(res.errors || {});
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Employer Work Request</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Post a Daily-Wage Work Requirement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Reach local daily labourers instantly. Match skills, share location, and hire without commissions.
        </p>
      </div>

      {createdJob ? (
        <div className="card-base p-8 text-center max-w-xl mx-auto animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Job Posted Successfully • ID: {createdJob.id}
          </span>

          <h2 className="text-2xl font-bold text-slate-900 mt-3">Ready for Worker Matching!</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Your daily job requirement has been saved to your browser storage and is now visible on the Job Board and Map.
          </p>

          <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {createdJob.category.replace('-', ' ')}
              </span>
              <span className="text-sm font-extrabold text-blue-700">₹{createdJob.offeredWage}/day</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-2">{createdJob.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{createdJob.location} • Need {createdJob.workersNeeded} workers</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/match?jobId=${createdJob.id}`}
              className="flex-1 btn-primary py-2.5 text-xs justify-center font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find Matching Workers Now</span>
            </Link>
            <Link
              to="/jobs"
              className="flex-1 btn-secondary py-2.5 text-xs justify-center font-bold"
            >
              <span>View Job Board</span>
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="card-base p-6 sm:p-8 shadow-md border border-slate-200 space-y-6"
        >
          {/* Section 1: Job Scope */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>1. Work Overview & Category</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Requirement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent: 3 Labourers for RCC Slab Casting & Clearing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:border-blue-600 ${
                    errors.title ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    {WORKER_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Immediate">Immediate (Today / Tomorrow)</option>
                    <option value="Scheduled">Scheduled (This Week)</option>
                    <option value="Upcoming">Upcoming Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Work Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe specific tasks: lifting requirements, required tools, site safety gear, lunch provisions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none ${
                    errors.description ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Location & Schedule */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>2. Site Location & Schedule</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Site Location / Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseGps}
                    disabled={gpsLoading}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{gpsLoading ? 'Detecting GPS...' : 'Use Current GPS Location'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Andheri West Commercial Site, Plot 42, Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:border-blue-600 ${
                    errors.location ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.location && <p className="text-[11px] text-red-600 mt-1">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.workDate}
                    onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="1 Day">1 Day</option>
                    <option value="2 Days">2 Days</option>
                    <option value="3-5 Days">3-5 Days</option>
                    <option value="1 Week+">1 Week or more</option>
                    <option value="1 Day (Night Shift)">1 Day (Night Shift)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Wages & Headcount */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-blue-600" />
              <span>3. Wage Budget & Number of Workers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Offered Daily Wage (₹ / day per worker) *
                </label>
                <input
                  type="number"
                  min="200"
                  step="50"
                  required
                  value={formData.offeredWage}
                  onChange={(e) => setFormData({ ...formData, offeredWage: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:border-blue-600 ${
                    errors.offeredWage ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.offeredWage && <p className="text-[11px] text-red-600 mt-1">{errors.offeredWage}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Workers Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={formData.workersNeeded}
                  onChange={(e) => setFormData({ ...formData, workersNeeded: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Employer Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>4. Employer Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Employer Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Mehta"
                  value={formData.employerName}
                  onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:border-blue-600 ${
                    errors.employerName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.employerName && <p className="text-[11px] text-red-600 mt-1">{errors.employerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={formData.employerPhone}
                  onChange={(e) => setFormData({ ...formData, employerPhone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:border-blue-600 ${
                    errors.employerPhone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.employerPhone && <p className="text-[11px] text-red-600 mt-1">{errors.employerPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Builders (optional)"
                  value={formData.employerCompany}
                  onChange={(e) => setFormData({ ...formData, employerCompany: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Zero Commission Statement */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">100% Commission-Free Job Posting:</strong>
              Posting work on WorkForce Connect is free. You will connect with workers directly and pay them upon completion with zero broker cuts.
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn-primary py-3 text-xs justify-center font-bold text-sm"
          >
            <Briefcase className="w-4 h-4" />
            <span>Publish Job Requirement</span>
          </button>
        </form>
      )}

    </div>
  );
}
