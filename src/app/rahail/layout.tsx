import type { Metadata, Viewport } from 'next';
import { El_Messiri, Jost } from 'next/font/google';
import './rahail.css';

/* Display face chosen to echo the profile's headline lettering;
   body copy uses the site's IBM Plex Sans Arabic (--font-body). */
const display = El_Messiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--rh-font-display',
  display: 'swap',
});

const latin = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--rh-font-latin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAHAIL | رحائل',
  description: 'شركة متخصصة في تطوير الوجهات والمشاريع السياحية.',
};

export const viewport: Viewport = {
  themeColor: '#2a1209',
};

export default function RahailLayout({ children }: { children: React.ReactNode }) {
  return <div className={`rh ${display.variable} ${latin.variable}`}>{children}</div>;
}
