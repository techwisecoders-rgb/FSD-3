import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Users,
  MapPin,
  Phone,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { getMatchedWorkersForJob, getMatchedJobsForWorker } from '../utils/matchingEngine';
import { formatDistance } from '../utils/geoUtils';
import BookingModal from '../components/BookingModal';

export default function MatchingPage() {
  const [searchParams] = useSearchParams();
  const { workers, jobs } = useWorkForce();

  const queryJobId = searchParams.get('jobId');
  const queryWorkerId = searchParams.get('workerId');

  const [mode, setMode] = useState(queryWorkerId ? 'worker' : 'employer'); // 'employer' or 'worker'
  const [selectedJobId, setSelectedJobId] = useState(queryJobId || (jobs[0] ? jobs[0].id : ''));
  const [selectedWorkerId, setSelectedWorkerId] = useState(queryWorkerId || (workers[0] ? workers[0].id : ''));
  const [bookingWorker, setBookingWorker] = useState(null);

  // Sync if query param changes
  useEffect(() => {
    if (queryJobId) {
      setSelectedJobId(queryJobId);
      setMode('employer');
    } else if (queryWorkerId) {
      setSelectedWorkerId(queryWorkerId);
      setMode('worker');
    }
  }, [queryJobId, queryWorkerId]);

  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const currentWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

  // Matched results
  const matchedWorkers = currentJob ? getMatchedWorkersForJob(currentJob, workers) : [];
  const matchedJobs = currentWorker ? getMatchedJobsForWorker(currentWorker, jobs) : [];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Algorithmic Compatibility Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          WorkForce Smart Matchmaker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Calculates compatibility scores based on trade category (35%), skills overlap (25%), geographic proximity (20%), and daily wage alignment (15%).
        </p>

        {/* Mode Toggle Switch */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mt-6">
          <button
            onClick={() => setMode('employer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === 'employer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Employer Mode (Match Workers to Job)</span>
          </button>

          <button
            onClick={() => setMode('worker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === 'worker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Worker Mode (Match Jobs to Me)</span>
          </button>
        </div>
      </div>

      {mode === 'employer' ? (
        /* EMPLOYER MATCHING FLOW */
        <div className="space-y-6">
          {/* Target Job Selector Card */}
          <div className="card-base p-5 border-blue-200 bg-blue-50/40">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Job Requirement to Find Matches:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-xs"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — Category: {j.category} | Offered: ₹{j.offeredWage}/day | Loc: {j.location}
                </option>
              ))}
            </select>

            {currentJob && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase text-[10px]">
                  {currentJob.category.replace('-', ' ')}
                </span>
                <span>Budget: <strong className="text-slate-900">₹{currentJob.offeredWage}/day</strong></span>
                <span>Site: <strong className="text-slate-900">{currentJob.location}</strong></span>
                <span>Workers Needed: <strong className="text-slate-900">{currentJob.workersNeeded}</strong></span>
              </div>
            )}
          </div>

          {/* Matched Workers Results */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
              <span>Top Matched Daily Workers ({matchedWorkers.length})</span>
              <span className="text-xs font-normal text-slate-500">Ranked by Compatibility Score</span>
            </h3>

            <div className="space-y-4">
              {matchedWorkers.map((item) => {
                const { worker, score, breakdown, verdict, badgeColor } = item;
                return (
                  <div
                    key={worker.id}
                    className="card-base p-5 hover:border-blue-400 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    {/* Left: Worker Snapshot */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{worker.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {score}% Match • {verdict}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          {worker.category.replace('-', ' ')} • {worker.experience} yrs exp • ₹{worker.dailyWage}/day
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            {worker.location} ({formatDistance(breakdown.distanceKm)})
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            {worker.availability}
                          </span>
                        </div>

                        {/* Breakdown Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {breakdown.categoryMatch && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                              ✓ Trade Match (+35)
                            </span>
                          )}
                          {breakdown.skillsMatched.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
                              ✓ {breakdown.skillsMatched.length} Overlapping Skills (+{breakdown.skillsScore})
                            </span>
                          )}
                          {breakdown.distanceScore >= 13 && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                              ✓ Close Proximity (+{breakdown.distanceScore})
                            </span>
                          )}
                          {breakdown.wageScore >= 11 && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-medium">
                              ✓ Budget Aligned (+{breakdown.wageScore})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                        <span className="text-xl font-extrabold text-blue-600">{score}/100</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${worker.phone}`}
                          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call</span>
                        </a>

                        <button
                          onClick={() => setBookingWorker(worker)}
                          className="btn-primary py-2 px-3.5 text-xs font-bold"
                        >
                          <span>Initiate Booking</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* WORKER MATCHING FLOW */
        <div className="space-y-6">
          {/* Target Worker Selector Card */}
          <div className="card-base p-5 border-blue-200 bg-blue-50/40">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Worker Profile to Find Matched Jobs:
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-xs"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — Category: {w.category} | Exp. Wage: ₹{w.dailyWage}/day | Loc: {w.location}
                </option>
              ))}
            </select>

            {currentWorker && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase text-[10px]">
                  {currentWorker.category.replace('-', ' ')}
                </span>
                <span>Expected Rate: <strong className="text-slate-900">₹{currentWorker.dailyWage}/day</strong></span>
                <span>Location: <strong className="text-slate-900">{currentWorker.location}</strong></span>
                <span>Status: <strong className="text-emerald-700">{currentWorker.availability}</strong></span>
              </div>
            )}
          </div>

          {/* Matched Jobs Results */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
              <span>Best Matching Job Requirements ({matchedJobs.length})</span>
              <span className="text-xs font-normal text-slate-500">Ranked by Pay & Compatibility</span>
            </h3>

            <div className="space-y-4">
              {matchedJobs.map((item) => {
                const { job, score, breakdown, verdict, badgeColor } = item;
                return (
                  <div
                    key={job.id}
                    className="card-base p-5 hover:border-blue-400 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {job.category.replace('-', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {score}% Match
                        </span>
                        <span className="text-xs font-extrabold text-blue-700">
                          ₹{job.offeredWage}/day
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          {job.location} ({formatDistance(breakdown.distanceKm)})
                        </span>
                        <span>Date: {job.workDate} ({job.duration})</span>
                        <span>Employer: {job.employerName}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <a
                        href={`tel:${job.employerPhone}`}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Employer Directly</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingWorker && (
        <BookingModal
          isOpen={Boolean(bookingWorker)}
          onClose={() => setBookingWorker(null)}
          worker={bookingWorker}
          preselectedJob={currentJob}
        />
      )}

    </div>
  );
}
