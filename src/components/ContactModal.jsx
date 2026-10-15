import React, { useState } from 'react';
import { X, Check, Send, Sparkles } from 'lucide-react';

export default function ContactModal({ isOpen, onClose, defaultMode = 'client', preselectedPro = null }) {
  const [mode, setMode] = useState(defaultMode); // 'client' or 'pro'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceCategory: 'Home Repairs',
    district: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B5E20]/40 backdrop-blur-sm transition-all"
    >
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl border-2 border-[#A8D5A8] shadow-2xl p-6 md:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#E7F4E8] text-[#1B5E20] flex items-center justify-center hover:bg-[#A8D5A8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#66BB6A] text-[#FFFFFF] flex items-center justify-center mb-4 shadow-lg animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B5E20]">Connection Request Dispatched</h3>
            <p className="mt-2 text-sm text-[#1B5E20]/80 max-w-sm">
              Thank you! Your request has been queued in the Workflow Connect network. A verified representative will reach out shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#E7F4E8] p-1.5 rounded-full border border-[#A8D5A8] mb-6 w-fit">
              <button
                type="button"
                onClick={() => setMode('client')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  mode === 'client'
                    ? 'bg-[#1B5E20] text-[#FFFFFF] shadow-sm'
                    : 'text-[#1B5E20] hover:bg-[#A8D5A8]/40'
                }`}
              >
                Find a Professional
              </button>
              <button
                type="button"
                onClick={() => setMode('pro')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  mode === 'pro'
                    ? 'bg-[#1B5E20] text-[#FFFFFF] shadow-sm'
                    : 'text-[#1B5E20] hover:bg-[#A8D5A8]/40'
                }`}
              >
                Join as a Professional
              </button>
            </div>

            <div className="mb-6">
              <h3 id="modal-title" className="text-2xl font-bold text-[#1B5E20]">
                {preselectedPro
                  ? `Connect with ${preselectedPro.name}`
                  : mode === 'client'
                  ? 'Request Local Skilled Service'
                  : 'Join the Verified Professional Network'}
              </h3>
              <p className="mt-1 text-xs text-[#1B5E20]/75">
                {preselectedPro
                  ? `Specialty: ${preselectedPro.specialty} (${preselectedPro.serviceArea})`
                  : mode === 'client'
                  ? 'Connect directly with top craftspeople in your local district.'
                  : 'Showcase your trade expertise and expand your local client base.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#A8D5A8] bg-[#E7F4E8]/50 text-[#1B5E20] placeholder-[#1B5E20]/40 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#A8D5A8] bg-[#E7F4E8]/50 text-[#1B5E20] placeholder-[#1B5E20]/40 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-1">
                    Service Area / District
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North District"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#A8D5A8] bg-[#E7F4E8]/50 text-[#1B5E20] placeholder-[#1B5E20]/40 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-1">
                  Trade Specialty
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#A8D5A8] bg-[#E7F4E8]/50 text-[#1B5E20] focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] text-sm"
                >
                  <option value="Home Repairs">Home Repairs</option>
                  <option value="Electrical Services">Electrical Services</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Painting">Painting</option>
                  <option value="Moving & Transport">Moving & Transport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-1">
                  Project Scope or Trade Background
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide brief details regarding scope, timeline, or qualifications..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#A8D5A8] bg-[#E7F4E8]/50 text-[#1B5E20] placeholder-[#1B5E20]/40 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full uiverse-btn-primary py-3 mt-2 text-sm justify-center"
              >
                <Send className="w-4 h-4" />
                <span>Submit Connection Request</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
