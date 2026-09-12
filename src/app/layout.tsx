import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const bodyFont = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مشروع | Project',
  description: 'منصة مشروع — كل ما يحتاجه مشروعك من منتجات وموردين وخدمات في مكان واحد.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={bodyFont.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
