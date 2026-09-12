import Link from 'next/link';

const OPTIONS = [
  { href: '/add-product', title: 'أضف منتج', desc: 'اعرض منتجًا للبيع على منصة مشروع.' },
  { href: '/add-supplier', title: 'أضف كمورد', desc: 'سجّل مؤسستك كمورد لمشاريع أخرى.' },
  { href: '/add-service', title: 'أضف خدمة', desc: 'قدّم خدمتك لأصحاب المشاريع.' },
];

export default function AddHubPage() {
  return (
    <div className="container-content section">
      <h1 className="h2 mb-2">أضف منتجك</h1>
      <p className="text-muted mb-10">اختر نوع ما تريد إضافته إلى منصة مشروع.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {OPTIONS.map((o) => (
          <Link key={o.href} href={o.href} className="card p-8 hover:border-ink transition-colors">
            <h2 className="font-bold text-lg mb-2">{o.title}</h2>
            <p className="text-muted text-sm">{o.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
