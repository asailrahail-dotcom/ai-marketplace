import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getHomepageContent } from '@/lib/content';
import { ProductCard } from '@/components/cards/ProductCard';
import { SupplierCard } from '@/components/cards/SupplierCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function DiscoverPage() {
  const content = await getHomepageContent();

  const [products, suppliers, services] = await Promise.all([
    prisma.product.findMany({
      where: { hidden: false },
      orderBy: [{ verified: 'desc' }, { createdAt: 'desc' }],
      take: 4,
      include: { seller: true, _count: { select: { reviews: true } } },
    }),
    prisma.supplier.findMany({
      where: { hidden: false },
      orderBy: [{ verified: 'desc' }, { createdAt: 'desc' }],
      take: 3,
    }),
    prisma.service.findMany({
      where: { hidden: false },
      orderBy: [{ verified: 'desc' }, { createdAt: 'desc' }],
      take: 3,
    }),
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

  return (
    <div className="container-content section space-y-16">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">DISCOVER</p>
        <h1 className="h1">{content.discoverTitle}</h1>
        <p className="text-muted mt-3 text-lg">{content.discoverSubtitle}</p>
      </div>

      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="h2">المنتجات</h2>
          <Link href="/products" className="text-sm font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>
        {productsWithRatings.length === 0 ? (
          <EmptyState title="لا توجد منتجات بعد" />
        ) : (
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
        )}
      </section>

      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="h2">الموردون</h2>
          <Link href="/suppliers" className="text-sm font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>
        {suppliersWithRatings.length === 0 ? (
          <EmptyState title="لا يوجد موردون بعد" />
        ) : (
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
        )}
      </section>

      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="h2">الخدمات</h2>
          <Link href="/services" className="text-sm font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>
        {servicesWithRatings.length === 0 ? (
          <EmptyState title="لا توجد خدمات بعد" />
        ) : (
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
        )}
      </section>
    </div>
  );
}
