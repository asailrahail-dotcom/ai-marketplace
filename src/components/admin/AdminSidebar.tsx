'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[#0B0B0C] text-white min-h-screen hidden md:flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-bold text-lg">مشروع</p>
        <p className="text-white/40 text-xs tracking-widest">ADMIN</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-2.5 text-sm font-medium ${
                active ? 'bg-white/10 text-white border-r-2 border-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
