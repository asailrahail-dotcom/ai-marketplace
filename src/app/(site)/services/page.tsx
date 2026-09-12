import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const categories = await prisma.category.findMany({ where: { hidden: false }, orderBy: { order: 'asc' } });

  const services = await prisma.service.findMany({
    where: {
      hidden: false,
      category: searchParams.category ? { slug: searchParams.category } : undefined,
      name: searchParams.q ? { contains: searchParams.q } : undefined,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const withRatings = await Promise.all(
    services.map(async (s) => {
      const agg = await prisma.review.aggregate({ where: { serviceId: s.id }, _avg: { rating: true } });
      const count = await prisma.review.count({ where: { serviceId: s.id } });
      return { ...s, ratingAvg: agg._avg.rating ?? 0, ratingCount: count };
    }),
  );

  return (
    <div className="container-content section">
      <h1 className="h2 mb-2">الخدمات</h1>
      <p className="text-muted mb-8">خدمات تنفيذ وصيانة لمشروعك.</p>

      <form className="flex flex-wrap gap-2 mb-8" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ابحث عن خدمة…" className="input max-w-xs" />
        <select name="category" defaultValue={searchParams.category ?? ''} className="input max-w-[180px]">
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" type="submit">
          تصفية
        </button>
      </form>

      {withRatings.length === 0 ? (
        <EmptyState
          title="لا توجد خدمات مطابقة"
          action={
            <Link href="/services" className="btn btn-secondary">
              إعادة ضبط التصفية
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {withRatings.map((s) => (
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
              categorySlug={s.category?.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
