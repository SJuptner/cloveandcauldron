'use client';

import { useEffect, useState } from 'react';
import {
  readConsent,
  writeConsent,
  CONSENT_REOPEN_EVENT,
  type ConsentPreferences,
} from '@/lib/cookieConsent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);

  useEffect(() => {
    if (!readConsent()) setVisible(true);

    const reopen = () => {
      setAnalyticsChecked(readConsent()?.analytics ?? true);
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  function save(preferences: ConsentPreferences) {
    writeConsent(preferences);
    setVisible(false);
    setExpanded(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-outline/30 bg-surface-container-highest">
      <div className="parchment-grain opacity-5" />
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          We use essential cookies to remember preferences like light/dark mode, and, if you
          allow it, analytics cookies (Google Analytics) to understand site traffic. See the{' '}
          <a
            href="/privacy"
            className="text-secondary underline decoration-secondary/30 underline-offset-4"
          >
            Privacy Scroll
          </a>{' '}
          for details.
        </p>

        {expanded && (
          <label className="flex items-center gap-3 font-body-md text-body-md text-on-surface-variant w-fit">
            <input
              type="checkbox"
              checked={analyticsChecked}
              onChange={(e) => setAnalyticsChecked(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Analytics cookies (Google Analytics)
          </label>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          {!expanded ? (
            <>
              <button
                type="button"
                onClick={() => save({ analytics: true })}
                className="bg-primary text-on-primary px-6 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border hover:bg-secondary transition-colors"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => save({ analytics: false })}
                className="border border-outline/40 text-on-surface px-6 py-3 uppercase tracking-widest font-label-lg text-label-lg hover:border-primary transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="text-on-surface-variant underline decoration-secondary/30 underline-offset-4 font-body-md text-label-sm px-2 self-start md:self-center"
              >
                Customize
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => save({ analytics: analyticsChecked })}
              className="bg-primary text-on-primary px-6 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border hover:bg-secondary transition-colors"
            >
              Save Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
