export const metadata = {
  title: 'Privacy Scroll | Clove & Cauldron',
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
            We use a small number of cookies to remember preferences, such as
            light or dark mode, and to understand overall site traffic. These
            are not used to build an advertising profile of you. You can
            clear cookies at any time through your browser settings.
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
