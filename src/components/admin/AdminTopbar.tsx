'use client';

import { useRouter, usePathname } from 'next/navigation';
import { logoutAdmin } from '@/app/actions/admin-auth';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'المستخدمون' },
  { href: '/admin/products', label: 'المنتجات' },
  { href: '/admin/suppliers', label: 'الموردون' },
  { href: '/admin/services', label: 'الخدمات' },
  { href: '/admin/orders', label: 'الطلبات' },
  { href: '/admin/categories', label: 'التصنيفات' },
  { href: '/admin/reports', label: 'التقارير' },
  { href: '/admin/content', label: 'المحتوى' },
  { href: '/admin/settings', label: 'الإعدادات' },
];

export function AdminTopbar({ adminName }: { adminName: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="bg-paper border-b border-line px-6 md:px-10 py-4 flex items-center justify-between gap-4">
      <select
        className="input md:hidden max-w-[160px]"
        value={NAV.find((n) => pathname.startsWith(n.href))?.href ?? NAV[0].href}
        onChange={(e) => router.push(e.target.value)}
      >
        {NAV.map((n) => (
          <option key={n.href} value={n.href}>
            {n.label}
          </option>
        ))}
      </select>
      <span className="hidden md:block text-sm text-muted">لوحة إدارة مشروع</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{adminName}</span>
        <form action={logoutAdmin}>
          <button type="submit" className="btn btn-secondary text-sm py-1.5 px-3">
            خروج
          </button>
        </form>
      </div>
    </header>
  );
}
