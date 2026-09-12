import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/cards/ProductCard';
import { SupplierCard } from '@/components/cards/SupplierCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';

type Tab = 'all' | 'products' | 'suppliers' | 'services';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: Tab };
}) {
  const q = (searchParams.q ?? '').trim();
  const tab: Tab = searchParams.type ?? 'all';

  const [products, suppliers, services] = await Promise.all([
    q && tab !== 'suppliers' && tab !== 'services'
      ? prisma.product.findMany({
          where: { hidden: false, name: { contains: q } },
          include: { seller: true, _count: { select: { reviews: true } } },
          take: 24,
        })
      : Promise.resolve([]),
    q && tab !== 'products' && tab !== 'services'
      ? prisma.supplier.findMany({ where: { hidden: false, name: { contains: q } }, take: 24 })
      : Promise.resolve([]),
    q && tab !== 'products' && tab !== 'suppliers'
      ? prisma.service.findMany({ where: { hidden: false, name: { contains: q } }, take: 24 })
      : Promise.resolve([]),
  ]);

  const productsWithRatings = await Promise.all(
    products.map(async (p) => {
      const agg = await prisma.review.aggregate({ where: { productId: p.id }, _avg: { rating: true } });
      return { ...p, ratingAvg: agg._avg.rating ?? 0 };
    }),
  );
  const suppliersWithRatings = await Promise.all(
    suppliers.map(async (s) => {
      const agg = await prisma.review.aggregate({ where: { supplierId: s.id }, _avg: { rating: true } });
      const count = await prisma.review.count({ where: { supplierId: s.id } });
      return { ...s, ratingAvg: agg._avg.rating ?? 0, ratingCount: count };
    }),
  );
  const servicesWithRatings = await Promise.all(
    services.map(async (s) => {
      const agg = await prisma.review.aggregate({ where: { serviceId: s.id }, _avg: { rating: true } });
      const count = await prisma.review.count({ where: { serviceId: s.id } });
      return { ...s, ratingAvg: agg._avg.rating ?? 0, ratingCount: count };
    }),
  );

  const totalResults = productsWithRatings.length + suppliersWithRatings.length + servicesWithRatings.length;
  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'products', label: 'المنتجات' },
    { key: 'suppliers', label: 'الموردون' },
    { key: 'services', label: 'الخدمات' },
  ];

  return (
    <div className="container-content section">
      <h1 className="h2 mb-6">البحث</h1>

      <form method="get" className="mb-6">
        <input type="hidden" name="type" value={tab} />
        <input
          name="q"
          defaultValue={q}
          placeholder="ابحث في المنتجات والموردين والخدمات…"
          className="input"
        />
      </form>

      <div className="flex gap-2 mb-10 border-b border-line">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/search?q=${encodeURIComponent(q)}&type=${t.key}`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              tab === t.key ? 'border-ink text-ink' : 'border-transparent text-muted'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {!q ? (
        <EmptyState title="اكتب كلمة للبحث" description="ابحث في كل المنتجات والموردين والخدمات المتاحة على المنصة." />
      ) : totalResults === 0 ? (
        <EmptyState title="لم نجد نتائج مطابقة" description={`لا توجد نتائج لـ "${q}" حاليًا داخل المنصة.`} />
      ) : (
        <div className="space-y-14">
          {productsWithRatings.length > 0 && (
            <div>
              <h2 className="font-bold text-lg mb-4">المنتجات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {productsWithRatings.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    condition={p.condition}
                    price={p.price}
                    images={p.images}
                    sellerName={p.seller.name}
                    verified={p.verified}
                    ratingAvg={p.ratingAvg}
                    ratingCount={p._count.reviews}
                  />
                ))}
              </div>
            </div>
          )}

          {suppliersWithRatings.length > 0 && (
            <div>
              <h2 className="font-bold text-lg mb-4">الموردون</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {suppliersWithRatings.map((s) => (
                  <SupplierCard
                    key={s.id}
                    id={s.id}
                    name={s.name}
                    logo={s.logo}
                    specialty={s.specialty}
                    city={s.city}
                    verified={s.verified}
                    ratingAvg={s.ratingAvg}
                    ratingCount={s.ratingCount}
                  />
                ))}
              </div>
            </div>
          )}

          {servicesWithRatings.length > 0 && (
            <div>
              <h2 className="font-bold text-lg mb-4">الخدمات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {servicesWithRatings.map((s) => (
                  <ServiceCard
                    key={s.id}
                    id={s.id}
                    name={s.name}
                    type={s.type}
                    areas={JSON.parse(s.areas || '[]')}
                    image={s.image}
                    verified={s.verified}
                    ratingAvg={s.ratingAvg}
                    ratingCount={s.ratingCount}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
