export type ConsentPreferences = {
  analytics: boolean;
};

const COOKIE_NAME = 'cookie_consent';
const COOKIE_MAX_AGE_DAYS = 365;

// Custom events let the GA loader and the banner react to a saved/changed
// choice immediately, without a page reload.
export const CONSENT_CHANGE_EVENT = 'cookie-consent:change';
export const CONSENT_REOPEN_EVENT = 'cookie-consent:reopen';

export function readConsent(): ConsentPreferences | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return typeof parsed?.analytics === 'boolean' ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(preferences: ConsentPreferences) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(preferences)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: preferences }));
}
