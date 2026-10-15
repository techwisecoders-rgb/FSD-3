import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info } from 'lucide-react';
import { WORKER_CATEGORIES } from '../data/mockData';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 border border-blue-500 shadow-md">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                WorkForce <span className="text-blue-400">Connect</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering local daily-wage workers: construction labourers, packers and movers, loaders, cleaners, and event staff with direct phone connections and zero platform fees.
            </p>

            <div className="flex items-center gap-2 p-3 bg-blue-950/60 border border-blue-800/80 rounded-xl text-blue-200 text-xs">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                <strong>0% Platform Commission:</strong> Every rupee agreed goes directly from the employer to the worker.
              </span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Discovery</Link>
              </li>
              <li>
                <Link to="/workers" className="hover:text-white transition-colors">Find Daily Workers</Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Browse Job Openings</Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-white transition-colors">Post a New Job</Link>
              </li>
              <li>
                <Link to="/signup?mode=worker" className="hover:text-white transition-colors">Register (Worker & Employer)</Link>
              </li>
            </ul>
          </div>

          {/* Tools & Locations */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/match" className="hover:text-white transition-colors">Smart Matchmaker Engine</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">Two-Way Live Map</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Bookings & Dashboard</Link>
              </li>
              <li>
                <span className="text-slate-400">GPS Proximity Calculations</span>
              </li>
              <li>
                <span className="text-slate-400">Direct Phone Calling</span>
              </li>
            </ul>
          </div>

          {/* Daily Worker Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Worker Categories</h4>
            <ul className="space-y-2 text-xs">
              {WORKER_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/workers?category=${cat.id}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Prototype Transparency & Limitations Notice */}
        <div className="mt-8 p-4 bg-slate-800/60 border border-slate-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Prototype Architecture & Data Transparency Notice:</strong>
              This application operates as a client-side prototype. All worker profiles, job postings, and booking updates are persisted locally in your browser's <code className="text-blue-300 bg-slate-900 px-1.5 py-0.5 rounded">localStorage</code>. No centralized cloud backend, remote SQL database, or server authentication is currently implemented. Data does not synchronize across separate devices.
            </div>
          </div>
          <Link
            to="/dashboard"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold"
          >
            Manage Local Data
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} WorkForce Connect. Built for daily-wage worker empowerment.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Direct connections • Zero middlemen</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
