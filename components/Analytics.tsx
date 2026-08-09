'use client';

import { useEffect, useState } from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import CookieConsentBanner from './CookieConsentBanner';
import { readConsent, CONSENT_CHANGE_EVENT, type ConsentPreferences } from '@/lib/cookieConsent';

// GA must not fire until the visitor has actively opted in -- consent starts
// false and only flips on after reading (or receiving) a saved preference.
export default function Analytics({ measurementId }: { measurementId?: string }) {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    setAnalyticsAllowed(readConsent()?.analytics ?? false);

    const onChange = (event: Event) => {
      const preferences = (event as CustomEvent<ConsentPreferences>).detail;
      setAnalyticsAllowed(Boolean(preferences?.analytics));
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  return (
    <>
      <CookieConsentBanner />
      {measurementId && analyticsAllowed && <GoogleAnalytics measurementId={measurementId} />}
    </>
  );
}
