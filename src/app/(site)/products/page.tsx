import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/cards/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; condition?: string; q?: string };
}) {
  const categories = await prisma.category.findMany({ where: { hidden: false }, orderBy: { order: 'asc' } });

  const products = await prisma.product.findMany({
    where: {
      hidden: false,
      category: searchParams.category ? { slug: searchParams.category } : undefined,
      condition: searchParams.condition || undefined,
      name: searchParams.q ? { contains: searchParams.q } : undefined,
    },
    include: { seller: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const productsWithRatings = await Promise.all(
    products.map(async (p) => {
      const agg = await prisma.review.aggregate({ where: { productId: p.id }, _avg: { rating: true } });
      return { ...p, ratingAvg: agg._avg.rating ?? 0 };
    }),
  );

  return (
    <div className="container-content section">
      <h1 className="h2 mb-2">المنتجات</h1>
      <p className="text-muted mb-8">تصفح المنتجات المتاحة لمشروعك.</p>

      <form className="flex flex-wrap gap-2 mb-8" method="get">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="ابحث عن منتج…"
          className="input max-w-xs"
        />
        <select name="category" defaultValue={searchParams.category ?? ''} className="input max-w-[180px]">
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="condition" defaultValue={searchParams.condition ?? ''} className="input max-w-[160px]">
          <option value="">كل الحالات</option>
          <option value="NEW">جديد</option>
          <option value="USED">مستعمل</option>
        </select>
        <button className="btn btn-secondary" type="submit">
          تصفية
        </button>
      </form>

      {productsWithRatings.length === 0 ? (
        <EmptyState
          title="لا توجد منتجات مطابقة"
          description="جرّب تغيير عوامل التصفية أو الكلمات المستخدمة في البحث."
          action={
            <Link href="/products" className="btn btn-secondary">
              إعادة ضبط التصفية
            </Link>
          }
        />
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
    </div>
  );
}
