import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
