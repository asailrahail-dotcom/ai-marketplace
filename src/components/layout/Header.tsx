import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

const NAV_LINKS = [
  { href: '/discover', label: 'اكتشف' },
  { href: '/products', label: 'المنتجات' },
  { href: '/suppliers', label: 'الموردون' },
  { href: '/services', label: 'الخدمات' },
  { href: '/ai', label: 'مشروع AI' },
];

export async function Header() {
  const user = await getCurrentUser();
  const cartCount = user
    ? await prisma.cartItem.aggregate({
        where: { userId: user.id },
        _sum: { quantity: true },
      })
    : null;
  const count = cartCount?._sum.quantity ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="container-content flex items-center h-16 md:h-[4.5rem] gap-8">
        <Link href="/" className="font-bold text-lg tracking-tightish shrink-0">
          مشروع
        </Link>

        <nav className="hidden md:flex items-center gap-7 flex-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative py-2 text-sm font-medium text-ink/75 hover:text-ink transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 mr-auto md:mr-0">
          <Link
            href="/cart"
            className="relative px-2 py-2 hover:text-accent transition-colors"
            aria-label="السلة"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005 17h12M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <Link
            href={user ? '/account' : '/login'}
            className="hidden sm:inline-flex px-3 py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            {user ? 'حسابي' : 'دخول'}
          </Link>

          <Link href="/add" className="btn btn-primary text-sm py-2 px-4 mr-1 hidden md:inline-flex">
            أضف منتجك
          </Link>
        </div>
      </div>
    </header>
  );
}
