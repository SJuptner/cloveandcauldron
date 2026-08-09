import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Analytics from '@/components/Analytics';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="parchment-grain" />
      <Header />
      {children}
      <Footer />
      <ScrollReveal />
      <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </>
  );
}
