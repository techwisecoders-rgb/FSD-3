import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function WorkerRegistrationPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile', { replace: true });
    } else {
      navigate('/signup?mode=worker', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <h2 className="text-base font-bold text-slate-800">Directing to Unified Registration...</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        Worker and Provider registrations have been merged into a single application.
      </p>
    </div>
  );
}
