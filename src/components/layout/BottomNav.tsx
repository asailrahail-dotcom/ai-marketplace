'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/', label: 'الرئيسية', icon: HomeIcon },
  { href: '/discover', label: 'اكتشف', icon: DiscoverIcon },
  { href: '/ai', label: 'AI', icon: AiIcon },
  { href: '/orders', label: 'طلباتي', icon: OrdersIcon },
  { href: '/account', label: 'حسابي', icon: AccountIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-line">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                active ? 'text-ink' : 'text-muted'
              }`}
            >
              <Icon active={active} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11.5L12 4l8 7.5M6 9.5V20h12V9.5"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" />
    </svg>
  );
}
function AiIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v3m0 12v3m9-9h-3M6 12H3m13.95 6.95l-2.12-2.12M8.17 8.17L6.05 6.05m11.9 0l-2.12 2.12M8.17 15.83l-2.12 2.12"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.6}
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} />
    </svg>
  );
}
function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9l3 3v15H6V3z"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.6}
        strokeLinejoin="round"
      />
      <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" />
    </svg>
  );
}
function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} />
      <path d="M4.5 20a7.5 7.5 0 0115 0" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" />
    </svg>
  );
}
