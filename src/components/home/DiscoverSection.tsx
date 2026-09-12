import Link from 'next/link';

const PILLARS = [
  {
    href: '/products',
    label: 'المنتجات',
    labelEn: 'Products',
    desc: 'كل ما يحتاجه مشروعك من منتجات جاهزة للشحن أو الاستلام.',
  },
  {
    href: '/suppliers',
    label: 'الموردون',
    labelEn: 'Suppliers',
    desc: 'موردون موثوقون في مختلف التخصصات لدعم مشروعك.',
  },
  {
    href: '/services',
    label: 'الخدمات',
    labelEn: 'Services',
    desc: 'خدمات تنفيذ وصيانة يقدمها مزوّدون متخصصون.',
  },
];

export function DiscoverSection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="section pt-10 md:pt-14">
      <div className="container-content">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow mb-3">DISCOVER</p>
          <h2 className="h2">{title}</h2>
          <p className="text-muted mt-3 text-lg">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative card p-8 min-h-[260px] flex flex-col justify-end overflow-hidden hover:border-ink transition-colors"
            >
              <span className="absolute top-8 right-8 text-xs font-semibold tracking-widest text-muted">
                {p.labelEn.toUpperCase()}
              </span>
              <h3 className="text-2xl font-bold mb-2">{p.label}</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">{p.desc}</p>
              <span className="inline-flex items-center gap-1 font-semibold text-sm">
                استكشف
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
