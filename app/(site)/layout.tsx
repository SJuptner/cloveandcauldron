import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="parchment-grain" />
      <Header />
      {children}
      <Footer />
      <ScrollReveal />
    </>
  );
}
