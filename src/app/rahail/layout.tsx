import type { Metadata, Viewport } from 'next';
import { Tajawal, Jost } from 'next/font/google';
import './rahail.css';

const display = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700'],
  variable: '--rh-font-display',
  display: 'swap',
});

const latin = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--rh-font-latin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAHAIL | رحائل',
  description: 'شركة متخصصة في تطوير الوجهات والمشاريع السياحية.',
};

export const viewport: Viewport = {
  themeColor: '#141311',
};

export default function RahailLayout({ children }: { children: React.ReactNode }) {
  return <div className={`rh ${display.variable} ${latin.variable}`}>{children}</div>;
}
