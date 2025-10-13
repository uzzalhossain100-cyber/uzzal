import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const VisitorTracker: React.FC = () => {
  const { user, profile, loading, recordVisit } = useAuth();
  const hasTrackedVisit = useRef(false);
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    const trackVisit = async () => {
      if (loading || hasTrackedVisit.current) {
        return;
      }

      let ipAddress: string | undefined;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        console.error(t("common.failed_to_fetch_ip_address"), error); // Translated error message
      }

      if (user || profile) {
        recordVisit({
          userId: user?.id,
          guestId: profile?.is_guest ? profile.id : undefined,
          username: profile?.username,
          email: profile?.email,
          ipAddress: ipAddress,
          isGuestVisit: profile?.is_guest || false,
        });
      } else {
        // For completely anonymous users (before any login/guest login attempt)
        recordVisit({
          ipAddress: ipAddress,
          isGuestVisit: false, // Not a guest session, just an anonymous visit
        });
      }
      hasTrackedVisit.current = true;
    };

    trackVisit();
  }, [user, profile, loading, recordVisit, t]); // Re-run if user/profile/loading changes or translation changes

  return null; // This component does not render anything
};

export default VisitorTracker;