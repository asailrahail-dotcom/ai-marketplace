import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-line bg-sand mt-16 mb-16 md:mb-0">
      <div className="container-content py-12 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-bold text-lg">مشروع</p>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            منصة تجمع المنتجات والموردين والخدمات لكل مشروع، مدعومة بالذكاء الاصطناعي.
          </p>
        </div>
        <FooterCol title="السوق" links={[
          { href: '/products', label: 'المنتجات' },
          { href: '/suppliers', label: 'الموردون' },
          { href: '/services', label: 'الخدمات' },
        ]} />
        <FooterCol title="مشروعك" links={[
          { href: '/ai', label: 'مشروع AI' },
          { href: '/project-needs', label: 'احتياجات مشروعي' },
          { href: '/orders', label: 'طلباتي' },
        ]} />
        <FooterCol title="الحساب" links={[
          { href: '/login', label: 'تسجيل الدخول' },
          { href: '/register', label: 'إنشاء حساب' },
          { href: '/add', label: 'أضف منتجك' },
        ]} />
      </div>
      <div className="container-content py-6 border-t border-line text-xs text-muted">
        © {new Date().getFullYear()} مشروع. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="font-semibold text-sm mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
