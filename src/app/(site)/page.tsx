import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getHomepageContent } from '@/lib/content';
import { DiscoverSection } from '@/components/home/DiscoverSection';
import { AiHero } from '@/components/home/AiHero';
import { ProductCard } from '@/components/cards/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function HomePage() {
  const content = await getHomepageContent();

  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { hidden: false },
      orderBy: [{ verified: 'desc' }, { createdAt: 'desc' }],
      take: 4,
      include: { seller: true, _count: { select: { reviews: true } } },
    }),
    prisma.category.findMany({ where: { hidden: false }, orderBy: { order: 'asc' }, take: 8 }),
  ]);

  const productsWithRatings = await Promise.all(
    featuredProducts.map(async (p) => {
      const agg = await prisma.review.aggregate({ where: { productId: p.id }, _avg: { rating: true } });
      return { ...p, ratingAvg: agg._avg.rating ?? 0 };
    }),
  );

  return (
    <>
      {/* 1. Discover — right after the header */}
      <DiscoverSection title={content.discoverTitle} subtitle={content.discoverSubtitle} />

      {/* 2. AI Hero — "وش مشروعك؟ وش تحتاج؟" */}
      <AiHero title={content.heroTitle} subtitle={content.heroSubtitle} />

      {/* 3. Remaining homepage content */}
      <section className="section">
        <div className="container-content">
          <div className="flex items-end justify-between mb-8">
            <h2 className="h2">تصفح حسب التصنيف</h2>
          </div>
          {categories.length === 0 ? (
            <EmptyState title="لا توجد تصنيفات بعد" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="card px-5 py-6 text-center hover:border-ink transition-colors"
                >
                  <p className="font-semibold">{c.name}</p>
                  {c.nameEn && <p className="text-xs text-muted mt-1">{c.nameEn}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-content">
          <div className="flex items-end justify-between mb-8">
            <h2 className="h2">منتجات مختارة</h2>
            <Link href="/products" className="text-sm font-semibold hover:underline shrink-0">
              عرض الكل
            </Link>
          </div>
          {productsWithRatings.length === 0 ? (
            <EmptyState title="لا توجد منتجات بعد" description="أضف أول منتج في المنصة." action={
              <Link href="/add-product" className="btn btn-primary">أضف منتجك</Link>
            } />
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
      </section>

      <section className="section pt-0">
        <div className="container-content">
          <div className="card bg-sand border-line p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
            <div>
              <h2 className="h2">عندك منتج أو خدمة تقدمها لمشاريع أخرى؟</h2>
              <p className="text-muted mt-2">انضم كمورد أو مزوّد خدمة وابدأ الوصول لأصحاب المشاريع.</p>
            </div>
            <Link href="/add" className="btn btn-primary shrink-0">أضف منتجك</Link>
          </div>
        </div>
      </section>
    </>
  );
}
