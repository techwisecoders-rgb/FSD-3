import React, { useState } from 'react';
import { X, MapPin, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useWorkForce } from '../context/WorkForceContext';

export default function BookingModal({ isOpen, onClose, worker, preselectedJob = null }) {
  const { jobs, createBooking, userLocation, refreshGpsLocation } = useWorkForce();

  const [formData, setFormData] = useState({
    jobId: preselectedJob ? preselectedJob.id : '',
    jobTitle: preselectedJob ? preselectedJob.title : '',
    workDate: new Date().toISOString().split('T')[0],
    agreedWage: worker ? worker.dailyWage : 750,
    location: preselectedJob ? preselectedJob.location : userLocation?.address || 'Andheri East, Mumbai',
    employerName: '',
    employerPhone: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [successBooking, setSuccessBooking] = useState(null);

  if (!isOpen || !worker) return null;

  const validate = () => {
    const errs = {};
    if (!formData.employerName.trim()) errs.employerName = 'Employer name is required';
    const cleanPhone = formData.employerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.employerPhone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.workDate) errs.workDate = 'Work date is required';
    if (!formData.agreedWage || Number(formData.agreedWage) <= 0) {
      errs.agreedWage = 'Agreed daily wage must be valid';
    }
    if (!formData.location.trim()) errs.location = 'Job location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = createBooking({
      workerId: worker.id,
      jobId: formData.jobId || null,
      workDate: formData.workDate,
      location: formData.location,
      agreedWage: formData.agreedWage,
      employerName: formData.employerName,
      employerPhone: formData.employerPhone,
      notes: formData.notes,
    });

    if (res.success) {
      setSuccessBooking(res.booking);
    }
  };

  const handleUseGps = async () => {
    const res = await refreshGpsLocation();
    if (res.success) {
      setFormData((prev) => ({ ...prev, location: res.location.address }));
    }
  };

  const handleSelectJob = (e) => {
    const selectedId = e.target.value;
    const found = jobs.find((j) => j.id === selectedId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        jobId: found.id,
        jobTitle: found.title,
        location: found.location,
        agreedWage: found.offeredWage,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        jobId: '',
        jobTitle: '',
      }));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-blue-200 shadow-2xl p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close booking modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {successBooking ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              Booking Created: #{successBooking.id}
            </span>
            <h3 className="text-2xl font-bold text-slate-900">Direct Booking Initiated</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-sm">
              Your booking for <strong className="text-slate-900">{worker.name}</strong> on{' '}
              <strong className="text-slate-900">{successBooking.workDate}</strong> has been logged in your browser with status <span className="font-semibold text-amber-600">Pending</span>.
            </p>

            <div className="mt-4 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 w-full">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Zero Platform Commission Guarantee</span>
              </div>
              <p className="text-[11px] text-blue-800">
                You will pay ₹{successBooking.agreedWage} directly to the worker. WorkForce Connect charges 0% fees.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 w-full">
              <a
                href={`tel:${worker.phone}`}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call {worker.name}</span>
              </a>
              <button
                onClick={onClose}
                className="flex-1 btn-secondary py-2.5 px-4 text-xs justify-center"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with Worker Summary */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 mb-5">
              <img
                src={worker.photo}
                alt={worker.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {worker.category.replace('-', ' ')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Book {worker.name}</h3>
                <p className="text-xs text-slate-500">{worker.location} • {worker.experience} yrs exp</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Optional Job Association */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Associate With Job Posting (Optional)
                </label>
                <select
                  value={formData.jobId}
                  onChange={handleSelectJob}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="">Direct Custom Booking (No Job Posting)</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} (Offered: ₹{j.offeredWage}/day)
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Date & Wage Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Date *
                  </label>
                  <input
                    type="date"
                    value={formData.workDate}
                    onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  {errors.workDate && <p className="text-[11px] text-red-600 mt-0.5">{errors.workDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Agreed Daily Wage (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={formData.agreedWage}
                    onChange={(e) => setFormData({ ...formData, agreedWage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  {errors.agreedWage && <p className="text-[11px] text-red-600 mt-0.5">{errors.agreedWage}</p>}
                </div>
              </div>

              {/* Location Input with GPS auto-detect */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Work Location / Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseGps}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Use My GPS</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Andheri West Commercial Site, Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                {errors.location && <p className="text-[11px] text-red-600 mt-0.5">{errors.location}</p>}
              </div>

              {/* Employer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name (Employer) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Mehta"
                    value={formData.employerName}
                    onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  {errors.employerName && <p className="text-[11px] text-red-600 mt-0.5">{errors.employerName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.employerPhone}
                    onChange={(e) => setFormData({ ...formData, employerPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  {errors.employerPhone && <p className="text-[11px] text-red-600 mt-0.5">{errors.employerPhone}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Work Instructions or Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring safety boots, reporting time 8:30 AM, water provided on-site..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Commission-Free Notice */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-blue-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Direct Model:</strong> No commission is cut. You negotiate and pay daily wages directly to the worker in cash or UPI.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-primary py-3 text-xs justify-center font-bold"
              >
                Confirm & Create Booking Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
