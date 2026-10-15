import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  Briefcase,
  Users,
  Compass,
  Sparkles,
  ClipboardList,
  PlusCircle,
  HardHat,
  UserCircle2,
  LogOut,
  LogIn,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { stats } = useWorkForce();
  const { currentUser, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Find Workers', path: '/workers', icon: Users },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Smart Match', path: '/match', icon: Sparkles },
    { name: 'Live Map', path: '/map', icon: MapPin },
    {
      name: 'Bookings & Stats',
      path: '/dashboard',
      icon: ClipboardList,
      badge: stats.pendingBookings > 0 ? stats.pendingBookings : null,
    },
    { name: 'My Profile', path: '/profile', icon: UserCircle2 },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm py-2.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Mark & Title */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 border border-blue-500 shadow-md transition-transform duration-300 group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                WorkForce
              </span>
              <span className="text-lg font-bold tracking-tight text-blue-600">
                Connect
              </span>
            </div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
              Direct Daily-Wage Network • 0% Fee
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`
                }
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {isLoggedIn ? (
            /* Logged-in user avatar dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                />
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {currentUser.workerProfile ? 'Worker & Employer' : 'Employer'}
                  </p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {currentUser.workerProfile ? 'Worker & Employer' : 'Employer / Member'}
                    </span>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      <UserCircle2 className="w-3.5 h-3.5" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      Bookings & Stats
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out auth buttons */
            <>
              <Link
                to="/login"
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>Register Free</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-5 py-5 shadow-xl">
          {/* Mobile user info */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
              <img src={currentUser.avatar} alt={currentUser.fullName} className="w-9 h-9 rounded-lg border border-blue-200" />
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500">
                  {currentUser.workerProfile ? 'Worker & Employer' : 'Employer / Member'} • {currentUser.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                      {link.badge} pending
                    </span>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="btn-danger w-full justify-center py-2.5 text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary w-full justify-center py-2.5 text-xs">
                    <UserPlus className="w-4 h-4" />
                    <span>Register Free</span>
                  </Link>
                  <Link to="/login" className="btn-secondary w-full justify-center py-2.5 text-xs">
                    <LogIn className="w-4 h-4 text-blue-600" />
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
