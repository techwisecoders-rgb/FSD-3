import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Star,
  Briefcase,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Wifi,
  WifiOff,
  Award,
  Users,
  MessageSquare,
  HardHat,
  ExternalLink,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { WORKER_CATEGORIES } from '../data/mockData';
import BookingModal from '../components/BookingModal';

const STATUS_COLORS = {
  'Available Today': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Available Tomorrow': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Available This Weekend': { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  'Busy / On Job': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
};

export default function WorkerProfilePage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { workers, bookings } = useWorkForce();

  const [showBookingModal, setShowBookingModal] = useState(false);

  const worker = workers.find((w) => w.id === workerId);

  if (!worker) {
    return (
      <div className="pt-28 pb-20 px-4 text-center max-w-xl mx-auto">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Worker Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          This worker profile does not exist or may have been removed.
        </p>
        <Link to="/workers" className="btn-primary py-2.5 px-6 text-sm justify-center">
          <Users className="w-4 h-4" />
          <span>Browse All Workers</span>
        </Link>
      </div>
    );
  }

  const category = WORKER_CATEGORIES.find((c) => c.id === worker.category);
  const statusStyle = STATUS_COLORS[worker.availability] || STATUS_COLORS['Busy / On Job'];

  const workerBookings = bookings.filter((b) => b.workerId === worker.id);
  const similarWorkers = workers
    .filter((w) => w.id !== worker.id && w.category === worker.category)
    .slice(0, 3);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-xs font-semibold mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, ${category?.color || '#2563EB'}22, ${category?.color || '#2563EB'}55)`,
              }}
            />
            <div className="px-5 pb-5">
              <div className="relative -mt-12 mb-3">
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                    worker.isLiveSharing ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </div>

              <h1 className="text-xl font-extrabold text-slate-900">{worker.name}</h1>

              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mt-1"
                style={{
                  backgroundColor: `${category?.color || '#2563EB'}18`,
                  color: category?.color || '#2563EB',
                }}
              >
                <HardHat className="w-3 h-3" />
                {category?.shortName || worker.category}
              </span>

              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(worker.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{worker.rating}</span>
                <span className="text-xs text-slate-400">({worker.reviewsCount})</span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-3 ${statusStyle.bg} ${statusStyle.text}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`} />
                {worker.availability}
              </div>

              <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{worker.location}</span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                {worker.isLiveSharing ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>
                  {worker.isLiveSharing ? 'Live GPS active' : 'GPS off'} • {worker.lastSharedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm">
              <p className="text-xl font-extrabold text-blue-600">{worker.completedJobs}</p>
              <p className="text-[11px] text-slate-500 font-semibold">Jobs Done</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm">
              <p className="text-xl font-extrabold text-blue-600">{worker.experience}y</p>
              <p className="text-[11px] text-slate-500 font-semibold">Experience</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm col-span-2">
              <p className="text-xl font-extrabold text-emerald-600">₹{worker.dailyWage}</p>
              <p className="text-[11px] text-slate-500 font-semibold">Daily Wage</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowBookingModal(true)}
            className="btn-primary w-full py-3 text-sm justify-center font-bold"
          >
            <Calendar className="w-4 h-4" />
            <span>Book This Worker</span>
          </button>

          <a
            href={`tel:${worker.phone}`}
            className="btn-secondary w-full py-3 text-sm justify-center font-bold"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Call: {worker.phone}</span>
          </a>

          <Link
            to={`/map?workerId=${worker.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-blue-600 border border-slate-200 rounded-xl bg-white hover:border-blue-300 transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View on Live Map</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>0% Platform Commission.</strong> Pay this worker directly. No cuts.
            </span>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bio */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              About This Worker
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{worker.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Skills & Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(worker.skills) ? worker.skills : worker.skills.split(','))
                .filter(Boolean)
                .map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: `${category?.color || '#2563EB'}12`,
                      color: category?.color || '#2563EB',
                      border: `1px solid ${category?.color || '#2563EB'}30`,
                    }}
                  >
                    {skill.trim()}
                  </span>
                ))}
            </div>
          </div>

          {/* Work History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Platform Work History
              <span className="ml-auto text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {workerBookings.length} total
              </span>
            </h2>

            {workerBookings.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No platform bookings yet.
              </div>
            ) : (
              <div className="space-y-3">
                {workerBookings.map((booking) => {
                  const statusMap = {
                    Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
                    Accepted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
                    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
                    Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: Clock },
                  };
                  const s = statusMap[booking.status] || statusMap.Pending;
                  const Icon = s.icon;
                  return (
                    <div key={booking.id} className={`p-3.5 rounded-xl border ${s.border} ${s.bg} flex items-start gap-3`}>
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${s.text}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800 truncate">{booking.jobTitle}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border} shrink-0`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {booking.employerName} • {booking.workDate}
                        </p>
                        <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                          ₹{booking.agreedWage} / day
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Similar Workers */}
          {similarWorkers.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Similar Workers in {category?.shortName}
              </h2>
              <div className="space-y-3">
                {similarWorkers.map((w) => {
                  const st = STATUS_COLORS[w.availability] || STATUS_COLORS['Busy / On Job'];
                  return (
                    <Link
                      key={w.id}
                      to={`/workers/${w.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
                    >
                      <img
                        src={w.photo}
                        alt={w.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                          {w.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{w.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-emerald-700">₹{w.dailyWage}/day</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                          {w.availability.split(' ')[0]}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookingModal worker={worker} onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
}
