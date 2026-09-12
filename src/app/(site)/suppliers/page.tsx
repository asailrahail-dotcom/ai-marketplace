import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SupplierCard } from '@/components/cards/SupplierCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const categories = await prisma.category.findMany({ where: { hidden: false }, orderBy: { order: 'asc' } });

  const suppliers = await prisma.supplier.findMany({
    where: {
      hidden: false,
      category: searchParams.category ? { slug: searchParams.category } : undefined,
      name: searchParams.q ? { contains: searchParams.q } : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });

  const withRatings = await Promise.all(
    suppliers.map(async (s) => {
      const agg = await prisma.review.aggregate({ where: { supplierId: s.id }, _avg: { rating: true } });
      const count = await prisma.review.count({ where: { supplierId: s.id } });
      return { ...s, ratingAvg: agg._avg.rating ?? 0, ratingCount: count };
    }),
  );

  return (
    <div className="container-content section">
      <h1 className="h2 mb-2">الموردون</h1>
      <p className="text-muted mb-8">موردون متخصصون لدعم مشروعك.</p>

      <form className="flex flex-wrap gap-2 mb-8" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ابحث عن مورد…" className="input max-w-xs" />
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
          title="لا يوجد موردون مطابقون"
          action={
            <Link href="/suppliers" className="btn btn-secondary">
              إعادة ضبط التصفية
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {withRatings.map((s) => (
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
    </div>
  );
}
