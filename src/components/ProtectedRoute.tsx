import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const ProtectedRoute: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">লোডিং...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile exists and if user is active
  if (profile && !profile.is_active) {
    showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;