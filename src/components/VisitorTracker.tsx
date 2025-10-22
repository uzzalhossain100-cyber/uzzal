import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/lib/translations'; // Import useTranslation
import { sanitizeToAscii } from '@/lib/utils'; // Import sanitizeToAscii

const VisitorTracker: React.FC = () => {
  const { user, profile, loading, recordVisit } = useAuth();
  const hasTrackedVisit = useRef(false);
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    const trackVisit = async () => {
      // Only track if loading is false and we haven't tracked this session yet
      if (!loading && !hasTrackedVisit.current) {
        let ipAddress: string | undefined;
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          ipAddress = data.ip;
        } catch (error) {
          console.error(t("common.failed_to_fetch_ip_address"), error); // Translated error message
        }

        // Determine if it's a guest or registered user visit
        if (user || profile) {
          recordVisit({
            userId: user?.id,
            username: sanitizeToAscii(profile?.username), // Sanitize username
            email: sanitizeToAscii(profile?.email),     // Sanitize email
            ipAddress: sanitizeToAscii(ipAddress), // Sanitize IP address
          });
        } else {
          // For completely anonymous users (before any login attempt)
          recordVisit({
            ipAddress: sanitizeToAscii(ipAddress), // Sanitize IP address
          });
        }
        hasTrackedVisit.current = true;
      }
    };

    trackVisit();
  }, [user, profile, loading, recordVisit, t]); // Re-run if user/profile/loading changes or translation changes

  return null; // This component does not render anything
};

export default VisitorTracker;