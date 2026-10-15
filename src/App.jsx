import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { WorkForceProvider } from './context/WorkForceContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import WorkersPage from './pages/WorkersPage';
import JobsPage from './pages/JobsPage';
import JobPostingPage from './pages/JobPostingPage';
import WorkerRegistrationPage from './pages/WorkerRegistrationPage';
import MatchingPage from './pages/MatchingPage';
import MapPage from './pages/MapPage';
import BookingsDashboardPage from './pages/BookingsDashboardPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import MyProfilePage from './pages/MyProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Full-page layout for auth screens (no Navbar/Footer)
function AuthLayout({ children }) {
  return <>{children}</>;
}

// Standard app layout with Navbar + Footer
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkForceProvider>
          <ScrollToTop />
          <Routes>
            {/* Auth routes — full screen, no Navbar */}
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />

            {/* App routes — with Navbar + Footer */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/workers" element={<AppLayout><WorkersPage /></AppLayout>} />
            <Route path="/workers/:workerId" element={<AppLayout><WorkerProfilePage /></AppLayout>} />
            <Route path="/jobs" element={<AppLayout><JobsPage /></AppLayout>} />
            <Route path="/post-job" element={<AppLayout><JobPostingPage /></AppLayout>} />
            <Route path="/register-worker" element={<AppLayout><WorkerRegistrationPage /></AppLayout>} />
            <Route path="/match" element={<AppLayout><MatchingPage /></AppLayout>} />
            <Route path="/map" element={<AppLayout><MapPage /></AppLayout>} />
            <Route path="/dashboard" element={<AppLayout><BookingsDashboardPage /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><MyProfilePage /></AppLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WorkForceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
