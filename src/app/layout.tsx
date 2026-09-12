import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مشروع | Project',
  description: 'منصة مشروع — كل ما يحتاجه مشروعك من منتجات وموردين وخدمات في مكان واحد.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
