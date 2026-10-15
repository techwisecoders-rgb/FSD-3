import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  HardHat,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  MapPin,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Plus,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkForce } from '../context/WorkForceContext';
import { WORKER_CATEGORIES } from '../data/mockData';

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, authLoading, authError, clearAuthError, isLoggedIn } = useAuth();
  const { syncUserWorker, refreshGpsLocation, userLocation } = useWorkForce();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);

  // By default, if query param ?mode=worker is present, expand the worker details
  const initialWorkerMode = searchParams.get('mode') === 'worker' || searchParams.get('as') === 'worker';
  const [wantWorkerMode, setWantWorkerMode] = useState(initialWorkerMode);

  // Basic required details
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Optional professional details
  const [workerDetails, setWorkerDetails] = useState({
    category: 'construction',
    skills: '',
    experience: 3,
    dailyWage: 750,
    availability: 'Available Today',
    location: userLocation?.address || 'Andheri East, Mumbai',
    bio: '',
  });

  useEffect(() => {
    if (isLoggedIn) navigate('/profile', { replace: true });
    clearAuthError();
  }, [isLoggedIn]);

  const selectedCategoryObj = WORKER_CATEGORIES.find((c) => c.id === workerDetails.category) || WORKER_CATEGORIES[0];

  const handleAddSkill = (skill) => {
    const current = workerDetails.skills ? workerDetails.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
    if (!current.includes(skill)) {
      setWorkerDetails({
        ...workerDetails,
        skills: [...current, skill].join(', '),
      });
    }
  };

  const handleUseGps = async () => {
    setGpsLoading(true);
    const res = await refreshGpsLocation();
    setGpsLoading(false);
    if (res.success && res.location?.address) {
      setWorkerDetails((prev) => ({
        ...prev,
        location: res.location.address,
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (wantWorkerMode) {
      if (!workerDetails.location.trim()) errs.location = 'Work location / area is required';
      if (!workerDetails.dailyWage || Number(workerDetails.dailyWage) <= 0) {
        errs.dailyWage = 'Valid expected daily wage is required';
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    const optionalWorkerProfile = wantWorkerMode
      ? {
          category: workerDetails.category,
          skills: workerDetails.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          experience: Number(workerDetails.experience) || 1,
          dailyWage: Number(workerDetails.dailyWage) || 750,
          availability: workerDetails.availability,
          location: workerDetails.location.trim(),
          bio: workerDetails.bio.trim() || 'Ready for immediate daily wage work.',
        }
      : null;

    const res = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      workerProfile: optionalWorkerProfile,
    });

    if (res.success) {
      if (optionalWorkerProfile) {
        syncUserWorker(res.user.id, res.user, optionalWorkerProfile);
      }
      navigate('/profile', { replace: true });
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score <= 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Branding Panel */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0F172A 0%, #1E3A8A 55%, #2563EB 100%)',
        }}
      >
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 w-fit">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <span className="text-white font-extrabold text-lg tracking-tight">WorkForce</span>
            <span className="text-blue-300 font-bold text-lg tracking-tight"> Connect</span>
          </div>
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Unified Registration • Single Account
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
            One Account.<br />
            <span className="text-blue-300">Hire Workers & Offer Work.</span>
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed mb-8 max-w-sm">
            No need for separate worker and provider accounts. Register once with basic details, and add or update your professional skills anytime.
          </p>

          <div className="space-y-4">
            {[
              { Icon: Briefcase, text: 'Post jobs & hire verified local workers immediately' },
              { Icon: HardHat, text: 'Offer your skills for daily-wage work whenever you want' },
              { Icon: CheckCircle2, text: '100% direct wages with zero commission' },
              { Icon: ShieldCheck, text: 'Update professional details anytime from your profile' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-white/60 text-xs italic">
            "I hired 2 painters for my shop on Tuesday, and on Friday I took up an electrical wiring job myself. One account does it all!" <br />
            <span className="text-white/80 font-semibold not-italic">— Rajesh Verma, Mumbai</span>
          </p>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 bg-[#F8FAFC] overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2.2" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900">WorkForce<span className="text-blue-600">Connect</span></span>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create your account ✨</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your basic details below. Professional worker details are optional and can be updated anytime.{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Dual-role Highlight Banner */}
          <div className="flex items-start gap-3 p-3.5 mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex gap-1 shrink-0 mt-0.5">
              <HardHat className="w-4 h-4 text-blue-600" />
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">One account, dual capabilities.</strong> A single user can provide work (as an employer) and act as a worker at the same time.
            </p>
          </div>

          {authError && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SECTION 1: Basic Information (Required) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Basic Details (Required)
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Step 1 of 2
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Ramesh Kumar"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                      fieldErrors.fullName ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                </div>
                {fieldErrors.fullName && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.fullName}</p>}
              </div>

              {/* Email & Mobile Number in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                        fieldErrors.email ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="signup-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                        fieldErrors.phone ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.phone}</p>}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="signup-password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min 6 chars"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                        fieldErrors.password ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                        fieldErrors.confirmPassword ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>

              {form.password && (
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500">{strength.label} password</p>
                </div>
              )}
            </div>

            {/* SECTION 2: Optional Professional & Worker Details */}
            <div className={`p-5 rounded-2xl border transition-all ${
              wantWorkerMode ? 'bg-white border-blue-300 shadow-md ring-2 ring-blue-50' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setWantWorkerMode(!wantWorkerMode)}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    wantWorkerMode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Offer My Services as a Worker
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check this to list your skills and get direct daily-wage job offers. You can also configure this later from your profile.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Toggle worker details"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 transition ${
                    wantWorkerMode ? 'bg-blue-50 text-blue-600' : 'bg-slate-200'
                  }`}
                >
                  {wantWorkerMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Collapsible Worker Details Form */}
              {wantWorkerMode && (
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                  {/* Category Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Trade / Category *
                    </label>
                    <select
                      id="signup-category"
                      value={workerDetails.category}
                      onChange={(e) => setWorkerDetails({ ...workerDetails, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {WORKER_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.typicalWage})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skills with Quick-Add Tag Pills */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Skills (comma separated)
                      </label>
                      <span className="text-[11px] text-slate-400">Click pills below to add</span>
                    </div>
                    <input
                      id="signup-skills"
                      type="text"
                      placeholder="e.g. Bricklaying, Plastering, Scaffolding"
                      value={workerDetails.skills}
                      onChange={(e) => setWorkerDetails({ ...workerDetails, skills: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {/* Popular suggestion chips for selected category */}
                    {selectedCategoryObj?.skills && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCategoryObj.skills.map((skill) => (
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

                  {/* Experience & Daily Wage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Experience (Years)
                      </label>
                      <input
                        id="signup-experience"
                        type="number"
                        min="0"
                        max="40"
                        value={workerDetails.experience}
                        onChange={(e) => setWorkerDetails({ ...workerDetails, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Expected Daily Wage (₹ / day) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="signup-wage"
                          type="number"
                          step="50"
                          min="300"
                          value={workerDetails.dailyWage}
                          onChange={(e) => setWorkerDetails({ ...workerDetails, dailyWage: e.target.value })}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                            fieldErrors.dailyWage ? 'border-red-400' : 'border-slate-300'
                          }`}
                        />
                      </div>
                      {fieldErrors.dailyWage && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.dailyWage}</p>}
                    </div>
                  </div>

                  {/* Work Location & GPS */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Work Location / Area *
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
                            Detecting...
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
                        id="signup-location"
                        type="text"
                        placeholder="e.g. Andheri East, Mumbai"
                        value={workerDetails.location}
                        onChange={(e) => setWorkerDetails({ ...workerDetails, location: e.target.value })}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                          fieldErrors.location ? 'border-red-400' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {fieldErrors.location && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.location}</p>}
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Availability Status
                    </label>
                    <select
                      id="signup-availability"
                      value={workerDetails.availability}
                      onChange={(e) => setWorkerDetails({ ...workerDetails, availability: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Available Today">Available Today</option>
                      <option value="Available Tomorrow">Available Tomorrow</option>
                      <option value="Available This Weekend">Available This Weekend</option>
                      <option value="Busy / On Job">Busy / Currently on Job</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Zero Commission Guarantee */}
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800">
                <strong>Free forever with 0% platform commission.</strong> Direct communication between workers and employers with no middlemen.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <span>
                    {wantWorkerMode
                      ? 'Create Account & List Worker Profile'
                      : 'Create Free Account (Worker & Employer Ready)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
