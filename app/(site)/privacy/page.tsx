import CookiePreferencesButton from '@/components/CookiePreferencesButton';

export const metadata = {
  title: 'Privacy Scroll | Clove & Cauldron',
  description: 'Privacy policy for Clove & Cauldron.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="max-w-2xl">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-10">Privacy Scroll</h1>

        <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-6">
          <p>
            This site collects only what is needed to keep it running: basic,
            anonymized analytics, and, if you choose to subscribe, the email
            address you provide. We do not sell or share your information
            with third parties for marketing purposes.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary mt-8 mb-2">Cookies</h2>
          <p>
            We use essential cookies to remember preferences, such as light or
            dark mode, at all times. With your permission, we also use Google
            Analytics to understand overall site traffic — how many people
            visit, which pages they read, and roughly where they&apos;re
            visiting from. Google Analytics is not used to build an
            advertising profile of you here, but Google processes this data
            under its own{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline decoration-secondary/30 underline-offset-4"
            >
              privacy policy
            </a>
            .
          </p>
          <p>
            Analytics cookies only load after you accept them in the cookie
            consent banner shown on your first visit. You can change your
            choice at any time —{' '}
            <CookiePreferencesButton className="text-secondary underline decoration-secondary/30 underline-offset-4" />{' '}
            — or clear cookies at any time through your browser settings,
            which resets your choice.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary mt-8 mb-2">Disclaimer</h2>
          <p>
            Clove &amp; Cauldron is an independent research and archival
            project. Content here reflects ongoing research into Turkic
            history, folklore, and heritage, and is presented for educational
            and cultural interest. While we aim for accuracy, sources and
            interpretations evolve — corrections and citations are always
            welcome.
          </p>

          <p>
            This policy may be updated from time to time as the site grows.
            Questions can be sent to{' '}
            <a
              href="mailto:info.cloveandcauldron@gmail.com"
              className="text-secondary underline decoration-secondary/30 underline-offset-4"
            >
              info.cloveandcauldron@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
