import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const ProtectedRoute: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation(); // Initialize useTranslation

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t("common.loading")}</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile exists and if user is active
  if (profile && !profile.is_active) {
    showError(t("common.account_deactivated"));
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;