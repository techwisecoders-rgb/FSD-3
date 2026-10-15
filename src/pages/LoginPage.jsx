import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HardHat,
  Briefcase,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading, authError, clearAuthError, isLoggedIn } = useAuth();

  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Already logged in → redirect
  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn, navigate, from]);

  useEffect(() => {
    clearAuthError();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const res = await login(form);
    if (res.success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Branding Panel */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0F172A 0%, #1E3A8A 55%, #2563EB 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none" />

        {/* Logo */}
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

        {/* Center Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            India's Direct Wage Network
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Connect. Work.<br />
            <span className="text-blue-300">Get Paid Direct.</span>
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed mb-8 max-w-sm">
            Join thousands of daily-wage workers and employers connecting directly — zero broker fees, 100% earnings.
          </p>

          {/* Feature bullets */}
          <div className="space-y-3">
            {[
              { icon: HardHat, text: '10,000+ Daily Workers Listed' },
              { icon: Briefcase, text: 'Instant Job Matching by Location' },
              { icon: ShieldCheck, text: '0% Commission — Always Free' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-300" />
                </div>
                <span className="text-sm text-white/80 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-white/50 text-xs italic">
            "Got a call within 10 minutes of registering. No commission cut." <br />
            <span className="text-white/70 font-semibold not-italic">— Ramesh Kumar, Construction Worker, Mumbai</span>
          </p>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2.2" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900">WorkForce<span className="text-blue-600">Connect</span></span>
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back 👋</h1>
          <p className="text-sm text-slate-500 mb-8">
            Sign in to your account to continue.{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>

          {/* Auth error */}
          {authError && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                    fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {fieldErrors.email && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button type="button" className="text-xs text-blue-600 hover:underline font-semibold">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                    fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary w-full py-3.5 text-sm font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800 font-semibold mb-1">💡 First time here?</p>
            <p className="text-[11px] text-blue-700">
              Create a free account using the link above. No credit card required — completely free.
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            By signing in, you agree to WorkForce Connect's{' '}
            <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
