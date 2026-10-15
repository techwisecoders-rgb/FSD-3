import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  HardHat,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  IndianRupee,
  Star,
  ArrowRight,
  PlusCircle,
  Users,
  TrendingUp,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Award,
  XCircle,
  Edit3,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  Plus,
  Navigation,
  Sparkles,
  Mail,
  UserCheck,
  Eye,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { useAuth } from '../context/AuthContext';
import { WORKER_CATEGORIES } from '../data/mockData';

const TAB_PROFILE = 'profile';
const TAB_JOBS_POSTED = 'jobs_posted';
const TAB_JOBS_RECEIVED = 'jobs_received';
const TAB_BOOKINGS_MADE = 'bookings_made';
const TAB_MY_WORKERS = 'my_workers';

export default function MyProfilePage() {
  const navigate = useNavigate();
  const {
    workers,
    jobs,
    bookings,
    stats,
    updateBookingStatus,
    syncUserWorker,
    removeUserWorker,
    refreshGpsLocation,
    userLocation,
  } = useWorkForce();
  const { currentUser, updateProfile, authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(TAB_PROFILE);

  // Success toast message
  const [profSaveMsg, setProfSaveMsg] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Basic Profile editing state
  const [editingBasic, setEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
  });

  // Professional profile editing state
  const [editingProf, setEditingProf] = useState(false);
  const wp = currentUser?.workerProfile;
  const isWorkerActive = Boolean(wp);

  const [profForm, setProfForm] = useState({
    category: wp?.category || 'construction',
    skills: Array.isArray(wp?.skills) ? wp.skills.join(', ') : (wp?.skills || ''),
    experience: wp?.experience || 3,
    dailyWage: wp?.dailyWage || 750,
    availability: wp?.availability || 'Available Today',
    bio: wp?.bio || '',
    location: wp?.location || userLocation?.address || 'Mumbai, Maharashtra',
  });

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setBasicForm({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
      });
      if (currentUser.workerProfile) {
        const p = currentUser.workerProfile;
        setProfForm({
          category: p.category || 'construction',
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ''),
          experience: p.experience || 3,
          dailyWage: p.dailyWage || 750,
          availability: p.availability || 'Available Today',
          bio: p.bio || '',
          location: p.location || userLocation?.address || 'Mumbai, Maharashtra',
        });
      }
    }
  }, [currentUser]);

  const selectedCategory = WORKER_CATEGORIES.find((c) => c.id === profForm.category) || WORKER_CATEGORIES[0];

  const handleAddSkill = (skill) => {
    const current = profForm.skills ? profForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
    if (!current.includes(skill)) {
      setProfForm({ ...profForm, skills: [...current, skill].join(', ') });
    }
  };

  const handleUseGps = async () => {
    setGpsLoading(true);
    const res = await refreshGpsLocation();
    setGpsLoading(false);
    if (res.success && res.location?.address) {
      setProfForm((prev) => ({
        ...prev,
        location: res.location.address,
      }));
    }
  };

  const handleSaveBasic = async () => {
    if (!basicForm.fullName.trim()) return;
    const cleanPhone = basicForm.phone.replace(/\D/g, '');
    const res = await updateProfile({
      fullName: basicForm.fullName.trim(),
      phone: cleanPhone,
    });
    if (res.success) {
      if (currentUser?.workerProfile) {
        syncUserWorker(
          currentUser.id,
          { ...currentUser, fullName: basicForm.fullName, phone: cleanPhone },
          currentUser.workerProfile
        );
      }
      setEditingBasic(false);
      setProfSaveMsg('Personal details updated successfully!');
      setTimeout(() => setProfSaveMsg(null), 3000);
    }
  };

  const handleSaveWorkerProfile = async () => {
    const newWorkerProfile = {
      category: profForm.category,
      skills: profForm.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      experience: Number(profForm.experience) || 1,
      dailyWage: Number(profForm.dailyWage) || 750,
      availability: profForm.availability,
      bio: profForm.bio.trim() || 'Hardworking professional available for daily wage work.',
      location: profForm.location.trim() || 'Local Area',
    };

    const res = await updateProfile({ workerProfile: newWorkerProfile });
    if (res.success) {
      if (currentUser) {
        syncUserWorker(currentUser.id, currentUser, newWorkerProfile);
      }
      setEditingProf(false);
      setProfSaveMsg('Worker profile updated and visible in listings & map!');
      setTimeout(() => setProfSaveMsg(null), 3500);
    }
  };

  const handleDisableWorkerProfile = async () => {
    const res = await updateProfile({ workerProfile: null });
    if (res.success) {
      if (currentUser) {
        removeUserWorker(currentUser.id);
      }
      setEditingProf(false);
      setProfSaveMsg('Worker mode turned off. You remain an active job provider.');
      setTimeout(() => setProfSaveMsg(null), 3500);
    }
  };

  // In prototype single user session, mock data corresponds to active platform listings
  const allBookings = bookings;
  const postedJobs = jobs;
  const registeredWorkers = workers;

  const bookingsMade = allBookings.filter((b) => b.employerName && b.employerPhone);
  const bookingsReceived = allBookings.filter((b) => b.status !== 'Rejected');

  const totalEarnings = allBookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.agreedWage || 0), 0);

  const tabs = [
    { id: TAB_PROFILE, label: 'Profile & Skills', icon: User, count: null },
    { id: TAB_JOBS_POSTED, label: 'Jobs Posted', icon: Briefcase, count: postedJobs.length },
    { id: TAB_JOBS_RECEIVED, label: 'Bookings Received', icon: HardHat, count: bookingsReceived.length },
    { id: TAB_BOOKINGS_MADE, label: 'My Bookings', icon: Calendar, count: bookingsMade.length },
    { id: TAB_MY_WORKERS, label: 'Registered Workers', icon: Users, count: registeredWorkers.length },
  ];

  const statusConfig = {
    Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
    Accepted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
    Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
    Open: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
    Filled: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle2 },
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {profSaveMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{profSaveMsg}</span>
          </div>
          <button
            onClick={() => setProfSaveMsg(null)}
            className="text-emerald-600 hover:text-emerald-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Guest Mode Warning if not logged in */}
      {!currentUser && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900">Viewing in Preview Mode</p>
              <p className="text-xs text-blue-700">
                Create a free account to customize your dual-role profile and save your skills.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to="/signup" className="btn-primary py-1.5 px-3.5 text-xs font-bold">
              Register Free
            </Link>
            <Link to="/login" className="btn-secondary py-1.5 px-3.5 text-xs font-bold">
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Unified WorkForce Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Profile & Activity</h1>
        <p className="text-sm text-slate-500 mt-1">
          One account to hire workers and offer your skills. Manage your details, jobs, and bookings below.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Jobs Posted', value: stats.totalJobs, sub: `${stats.openJobs} Open`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Total Bookings', value: stats.totalBookings, sub: `${stats.pendingBookings} Pending`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Workers Active', value: stats.availableWorkers, sub: `of ${stats.totalWorkers} registered`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Wages Paid', value: `₹${totalEarnings.toLocaleString()}`, sub: '0% commission', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
            <p className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link to="/post-job" className="btn-primary py-2 px-4 text-xs font-bold">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post a Job</span>
        </Link>
        <button
          onClick={() => {
            setActiveTab(TAB_PROFILE);
            setEditingProf(true);
          }}
          className="btn-secondary py-2 px-4 text-xs font-bold"
        >
          <HardHat className="w-3.5 h-3.5 text-blue-600" />
          <span>Update Worker Skills</span>
        </button>
        <Link to="/match" className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition">
          <Award className="w-3.5 h-3.5" />
          <span>Smart Match</span>
        </Link>
        <Link to="/dashboard" className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Full Dashboard</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile & Professional Details */}
      {activeTab === TAB_PROFILE && (
        <div className="space-y-6">
          {/* Dual-Role Capability Showcase Card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Dual-Role Architecture
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  A Single Account for Both Roles
                </h2>
                <p className="text-sm text-blue-100/80 mt-1 leading-relaxed">
                  You never need separate accounts. As a member of WorkForce Connect, you can post requirements as an employer AND accept daily-wage bookings as a skilled worker at any time.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  to="/post-job"
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Hire Workers (Post Job)</span>
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold transition backdrop-blur-sm"
                >
                  <HardHat className="w-4 h-4 text-amber-300" />
                  <span>Find Jobs to Work</span>
                </Link>
              </div>
            </div>
          </div>

          {/* User Personal Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={
                    currentUser?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=WorkForce&backgroundColor=2563EB&textColor=ffffff`
                  }
                  alt={currentUser?.fullName || 'User'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {currentUser?.fullName || 'Guest User'}
                    </h3>
                    {isWorkerActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Dual-Role: Worker & Employer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Job Provider (Worker Mode Off)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.email || 'guest@workforce.local'}</span>
                    <span>•</span>
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.phone || 'Not provided'}</span>
                  </p>
                </div>
              </div>

              {currentUser && (
                <button
                  onClick={() => setEditingBasic(!editingBasic)}
                  className="btn-secondary py-2 px-3.5 text-xs font-bold"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>{editingBasic ? 'Cancel' : 'Edit Basic Info'}</span>
                </button>
              )}
            </div>

            {/* Basic Info Inline Editor */}
            {editingBasic && (
              <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Edit Personal Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={basicForm.fullName}
                      onChange={(e) => setBasicForm({ ...basicForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={basicForm.phone}
                      onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => setEditingBasic(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBasic}
                    disabled={authLoading}
                    className="btn-primary py-2 px-4 text-xs font-bold"
                  >
                    {authLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Professional Worker Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isWorkerActive ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Professional Worker Profile
                    </h3>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isWorkerActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isWorkerActive ? 'Active in Worker Listings' : 'Disabled / Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure your trade, skills, daily wage, and availability so employers can discover and book you.
                  </p>
                </div>
              </div>

              {/* Worker Toggle Controls */}
              <div className="flex items-center gap-2">
                {isWorkerActive ? (
                  <>
                    <button
                      onClick={() => setEditingProf(!editingProf)}
                      className="btn-secondary py-2 px-3 text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{editingProf ? 'Close Form' : 'Edit Details'}</span>
                    </button>
                    <button
                      onClick={handleDisableWorkerProfile}
                      className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-200 transition"
                      title="Turn off worker mode so your card is hidden from worker listings"
                    >
                      Hide Worker Profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingProf(true)}
                    className="btn-primary py-2 px-4 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Enable Worker Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* When Worker Mode is Active and not in Edit Mode */}
            {isWorkerActive && !editingProf && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Trade Category</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-1 capitalize">
                      {selectedCategory.name}
                    </p>
                    <span
                      className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${selectedCategory.color}15`, color: selectedCategory.color }}
                    >
                      {selectedCategory.shortName}
                    </span>
                  </div>

                  {/* Daily Wage */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">Expected Daily Wage</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">
                      ₹{wp?.dailyWage || 750}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% direct to you</p>
                  </div>

                  {/* Experience */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Experience</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">
                      {wp?.experience || 1} Years
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Verified on platform</p>
                  </div>

                  {/* Availability */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold uppercase text-blue-700">Current Status</span>
                    <p className="text-sm font-extrabold text-blue-800 mt-1">
                      {wp?.availability || 'Available Today'}
                    </p>
                    <p className="text-[10px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {wp?.location || 'Local Area'}
                    </p>
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Declared Skills & Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(wp?.skills) && wp.skills.length > 0 ? (
                      wp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No specific skills listed yet. Click 'Edit Details' to add.</span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {wp?.bio && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Professional Bio
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {wp.bio}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/workers"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public Worker Directory</span>
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View Location on Live Map</span>
                  </Link>
                </div>
              </div>
            )}

            {/* When Worker Mode is NOT Active and not in Edit Mode */}
            {!isWorkerActive && !editingProf && (
              <div className="mt-6 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <HardHat className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Worker Mode is Currently Inactive
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  You are registered as a normal user. You can post jobs and hire workers freely. Turn on worker mode whenever you want to offer your services for daily-wage gigs.
                </p>
                <button
                  onClick={() => setEditingProf(true)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Setup Worker Profile & Skills</span>
                </button>
              </div>
            )}

            {/* Professional Worker Profile Form (Edit / Create) */}
            {editingProf && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    <span>Update Professional Details</span>
                  </h4>
                  <span className="text-xs text-slate-400">Updates sync to listings in real time</span>
                </div>

                {/* Category Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Trade / Category *
                  </label>
                  <select
                    value={profForm.category}
                    onChange={(e) => setProfForm({ ...profForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {WORKER_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.typicalWage})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skills with Quick-Add Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Skills (comma separated)
                    </label>
                    <span className="text-[11px] text-slate-400">Click pills below to add</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Bricklaying, Scaffolding, Wall Painting"
                    value={profForm.skills}
                    onChange={(e) => setProfForm({ ...profForm, skills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {selectedCategory?.skills && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedCategory.skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience & Wage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={profForm.experience}
                      onChange={(e) => setProfForm({ ...profForm, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Expected Daily Wage (₹ / day)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        step="50"
                        min="300"
                        value={profForm.dailyWage}
                        onChange={(e) => setProfForm({ ...profForm, dailyWage: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Location & GPS */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Work Location / Area
                    </label>
                    <button
                      type="button"
                      onClick={handleUseGps}
                      disabled={gpsLoading}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {gpsLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Detecting GPS...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3 h-3" />
                          Auto-detect GPS
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Andheri East, Mumbai"
                      value={profForm.location}
                      onChange={(e) => setProfForm({ ...profForm, location: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Availability & Bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={profForm.availability}
                    onChange={(e) => setProfForm({ ...profForm, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white"
                  >
                    <option value="Available Today">Available Today</option>
                    <option value="Available Tomorrow">Available Tomorrow</option>
                    <option value="Available This Weekend">Available This Weekend</option>
                    <option value="Busy / On Job">Busy / Currently on Job</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Short Bio / Work Summary
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Briefly describe your specialization, tools you own, or past projects..."
                    value={profForm.bio}
                    onChange={(e) => setProfForm({ ...profForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProf(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWorkerProfile}
                    disabled={authLoading}
                    className="btn-primary py-2.5 px-6 text-xs font-bold shadow-sm"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Worker Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Jobs Posted */}
      {activeTab === TAB_JOBS_POSTED && (
        <div className="space-y-4">
          {postedJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Jobs Posted Yet"
              desc="Post your first work requirement and connect with local workers instantly."
              action={{ label: 'Post a Job', to: '/post-job' }}
            />
          ) : (
            postedJobs.map((job) => {
              const cat = WORKER_CATEGORIES.find((c) => c.id === job.category);
              const sc = statusConfig[job.status] || statusConfig.Open;
              const StatusIcon = sc.icon;
              const filled = job.workersHired || 0;
              const needed = job.workersNeeded || 1;
              const pct = Math.min(100, Math.round((filled / needed) * 100));
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: `${cat?.color}18`, color: cat?.color }}
                        >
                          {cat?.shortName || job.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {job.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold text-emerald-600">₹{job.offeredWage}</p>
                      <p className="text-[10px] text-slate-400">/day</p>
                    </div>
                  </div>

                  {/* Hiring progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Workers Hired: <strong className="text-slate-700">{filled}/{needed}</strong></span>
                      <span>{job.workDate} • {job.duration}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      to={`/match?jobId=${job.id}`}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                    >
                      <Award className="w-3 h-3" /> Find Matching Workers
                    </Link>
                    <span className="text-[10px] text-slate-400">ID: {job.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: Bookings Received (worker side) */}
      {activeTab === TAB_JOBS_RECEIVED && (
        <div className="space-y-4">
          {bookingsReceived.length === 0 ? (
            <EmptyState
              icon={HardHat}
              title="No Bookings Received"
              desc="Activate your worker profile to start receiving booking requests from employers."
              action={{ label: 'Configure Worker Profile', to: '#', onClick: () => setActiveTab(TAB_PROFILE) }}
            />
          ) : (
            bookingsReceived.map((b) => {
              const sc = statusConfig[b.status] || statusConfig.Pending;
              const StatusIcon = sc.icon;
              return (
                <div key={b.id} className={`bg-white rounded-2xl border ${sc.border} shadow-sm p-5`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {b.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{b.jobTitle}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Worker: <strong className="text-slate-700">{b.workerName}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Employer: {b.employerName} • <a href={`tel:${b.employerPhone}`} className="text-blue-600 font-semibold">{b.employerPhone}</a>
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {b.location} • {b.workDate}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold text-emerald-600">₹{b.agreedWage}</p>
                      <p className="text-[10px] text-slate-400">/day</p>
                    </div>
                  </div>

                  {b.status === 'Pending' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Accepted')}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2 rounded-xl transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Rejected')}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 py-2 rounded-xl transition"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                  {b.status === 'Accepted' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'Completed')}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-xl transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Completed
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: Bookings I Made (employer side) */}
      {activeTab === TAB_BOOKINGS_MADE && (
        <div className="space-y-4">
          {bookingsMade.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Bookings Made Yet"
              desc="Browse available workers and make a booking request to get started."
              action={{ label: 'Find Workers', to: '/workers' }}
            />
          ) : (
            bookingsMade.map((b) => {
              const sc = statusConfig[b.status] || statusConfig.Pending;
              const StatusIcon = sc.icon;
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {b.status}
                        </span>
                        <span className="text-[10px] text-slate-400">{b.id}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{b.jobTitle}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Worker: <strong className="text-slate-700">{b.workerName}</strong>
                        {' '} ({b.workerCategory?.replace('-', ' ')})
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {b.location} • {b.workDate}
                      </p>
                      <a
                        href={`tel:${b.workerPhone}`}
                        className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        <Phone className="w-3 h-3" /> Call Worker: {b.workerPhone}
                      </a>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold text-emerald-600">₹{b.agreedWage}</p>
                      <p className="text-[10px] text-slate-400">/day</p>
                    </div>
                  </div>
                  <Link
                    to={`/workers/${b.workerId}`}
                    className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 transition"
                  >
                    View Worker Profile <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 5: Registered Workers */}
      {activeTab === TAB_MY_WORKERS && (
        <div className="space-y-4">
          {registeredWorkers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Workers Registered"
              desc="Set up your worker profile to appear on the platform and receive job offers."
              action={{ label: 'Configure Worker Profile', to: '#', onClick: () => setActiveTab(TAB_PROFILE) }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registeredWorkers.map((w) => {
                const cat = WORKER_CATEGORIES.find((c) => c.id === w.category);
                const availStyle = {
                  'Available Today': 'text-emerald-700 bg-emerald-50 border-emerald-200',
                  'Available Tomorrow': 'text-blue-700 bg-blue-50 border-blue-200',
                  'Available This Weekend': 'text-violet-700 bg-violet-50 border-violet-200',
                  'Busy / On Job': 'text-amber-700 bg-amber-50 border-amber-200',
                }[w.availability] || 'text-slate-700 bg-slate-50 border-slate-200';

                return (
                  <div key={w.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={w.photo}
                          alt={w.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${w.isLiveSharing ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{w.name}</h3>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ color: cat?.color, backgroundColor: `${cat?.color}18` }}
                        >
                          {cat?.shortName || w.category}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" /> {w.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-emerald-600">₹{w.dailyWage}</p>
                        <p className="text-[10px] text-slate-400">/ day</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${availStyle}`}>
                        {w.availability}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-bold text-slate-700">{w.rating}</span>
                        <span className="text-[10px] text-slate-400">• {w.completedJobs} jobs</span>
                      </div>
                    </div>

                    <Link
                      to={`/workers/${w.id}`}
                      className="mt-3 flex items-center justify-center gap-1.5 w-full text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 py-2 rounded-xl transition"
                    >
                      View Public Profile <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{desc}</p>
      {action && (
        action.onClick ? (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 btn-primary py-2.5 px-6 text-sm"
          >
            <span>{action.label}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to={action.to}
            className="inline-flex items-center gap-2 btn-primary py-2.5 px-6 text-sm"
          >
            <span>{action.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )
      )}
    </div>
  );
}
