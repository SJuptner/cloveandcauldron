'use client';

import { CONSENT_REOPEN_EVENT } from '@/lib/cookieConsent';

export default function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className={className}
    >
      Cookie Preferences
    </button>
  );
}
