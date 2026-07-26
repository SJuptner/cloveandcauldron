import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="parchment-grain" />
      <Header />
      {children}
      <Footer />
      <IntersectionRevealScript />
    </>
  );
}

// Re-creates the original inline <script> that fades sections/articles in on
// scroll, ported to a client component so it still runs in Next.js.
function IntersectionRevealScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var observerOptions = { threshold: 0.1 };
            var observer = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  entry.target.classList.add('opacity-100');
                  entry.target.classList.remove('opacity-0', 'translate-y-8');
                }
              });
            }, observerOptions);
            document.querySelectorAll('section, article').forEach(function(el) {
              el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-8');
              observer.observe(el);
            });
          })();
        `,
      }}
    />
  );
}
