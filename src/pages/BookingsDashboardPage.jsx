import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Phone,
  MapPin,
  IndianRupee,
  ShieldCheck,
  RotateCcw,
  Download,
  Briefcase,
  Users,
  Check,
  X,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';

export default function BookingsDashboardPage() {
  const {
    bookings,
    jobs,
    workers,
    stats,
    updateBookingStatus,
    resetToDefaultData,
  } = useWorkForce();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'jobs' | 'workers'
  const [statusFilter, setStatusFilter] = useState('all');
  const [dataActionToast, setDataActionToast] = useState('');

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      workers,
      jobs,
      bookings,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `workforce_connect_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDataActionToast('Exported all workforce data as JSON backup.');
    setTimeout(() => setDataActionToast(''), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all workers, jobs, and bookings back to initial seed prototype data?')) {
      resetToDefaultData();
      setDataActionToast('Reset all prototype records to default state.');
      setTimeout(() => setDataActionToast(''), 3000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            <span>Management & Tracking Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bookings & Platform Statistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily hire agreements, status transitions, direct payments, and manage local storage.
          </p>
        </div>

        {/* Data Actions (Export / Reset) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="p-2 sm:px-3 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-2 sm:px-3 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition"
            title="Reset to Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Action Toast Notification */}
      {dataActionToast && (
        <div className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{dataActionToast}</span>
        </div>
      )}

      {/* 1. Metric Overview Cards */}
      <div className="my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="card-base p-4 border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Bookings
            </span>
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalBookings}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.pendingBookings} pending approval
          </span>
        </div>

        <div className="card-base p-4 border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Direct Wages Volume
            </span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            ₹{stats.directWagesVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            100% paid to workers (0% fee)
          </span>
        </div>

        <div className="card-base p-4 border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Registered Workers
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalWorkers}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.availableWorkers} available today
          </span>
        </div>

        <div className="card-base p-4 border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Job Posts
            </span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalJobs}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.openJobs} currently open
          </span>
        </div>

      </div>

      {/* Prototype Transparent Storage Notice */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900 mb-6">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Local Browser Storage Persistence Notice:</strong>
          All records shown below are stored in this browser session via <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-950 font-mono">localStorage</code>. Status updates (Accepting or Completing a booking) persist across browser reloads. Centralized remote backend servers are not yet implemented.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Direct Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Posted Jobs ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'workers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Registered Workers Directory ({workers.length})
        </button>
      </div>

      {/* TAB 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          
          {/* Status Filter Sub-bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'pending', 'accepted', 'completed', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <ClipboardList className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No bookings with status: {statusFilter}</h4>
              <p className="text-xs text-slate-500 mt-1">Book a worker from the Directory or Matching Hub to test.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="card-base p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Booking Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500">#{b.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Date: {b.workDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{b.jobTitle}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span>Worker: <strong className="text-slate-900">{b.workerName}</strong></span>
                      <span>Employer: <strong className="text-slate-900">{b.employerName}</strong></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {b.location}
                      </span>
                    </div>

                    {b.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right: Agreed Wage & Status Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Agreed Wage</span>
                      <span className="text-base font-extrabold text-blue-700">₹{b.agreedWage}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Direct Call Worker */}
                      <a
                        href={`tel:${b.workerPhone}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                        title={`Call ${b.workerName}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Call</span>
                      </a>

                      {/* Status Transition Buttons */}
                      {b.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Accepted')}
                            className="btn-success py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Rejected')}
                            className="btn-danger py-1.5 px-2.5 text-xs font-bold flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {b.status === 'Accepted' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Completed')}
                          className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      {b.status === 'Completed' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Posted Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active Posted Job Requirements</h3>
            <Link to="/post-job" className="btn-primary py-1.5 px-3 text-xs font-bold">
              + Post New Job
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="card-base p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {j.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Date: {j.workDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{j.title}</h4>
                  <p className="text-xs text-slate-500">{j.location} • Need {j.workersNeeded} workers ({j.workersHired} hired)</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-blue-700 text-sm">₹{j.offeredWage}/day</span>
                  <Link
                    to={`/match?jobId=${j.id}`}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold"
                  >
                    Match Workers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Registered Workers Overview */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Registered Daily Workers in Local Storage</h3>
            <Link to="/register-worker" className="btn-primary py-1.5 px-3 text-xs font-bold">
              + Register Worker
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((w) => (
              <div key={w.id} className="card-base p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={w.photo} alt={w.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">{w.category.replace('-', ' ')} • {w.location}</p>
                    <span className="text-xs font-bold text-blue-700">₹{w.dailyWage}/day</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`tel:${w.phone}`} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </a>
                  <Link to={`/map?workerId=${w.id}`} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
