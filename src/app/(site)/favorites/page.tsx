import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ProductCard } from '@/components/cards/ProductCard';
import { SupplierCard } from '@/components/cards/SupplierCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { seller: true, _count: { select: { reviews: true } } } },
      supplier: true,
      service: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const productFavs = favorites.filter((f) => f.product && !f.product.hidden);
  const supplierFavs = favorites.filter((f) => f.supplier && !f.supplier.hidden);
  const serviceFavs = favorites.filter((f) => f.service && !f.service.hidden);

  const productsWithRatings = await Promise.all(
    productFavs.map(async (f) => {
      const agg = await prisma.review.aggregate({ where: { productId: f.product!.id }, _avg: { rating: true } });
      return {
        ...f.product!,
        sellerName: f.product!.seller.name,
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: f.product!._count.reviews,
      };
    }),
  );
  const suppliersWithRatings = await Promise.all(
    supplierFavs.map(async (f) => {
      const agg = await prisma.review.aggregate({ where: { supplierId: f.supplier!.id }, _avg: { rating: true } });
      const count = await prisma.review.count({ where: { supplierId: f.supplier!.id } });
      return { ...f.supplier!, ratingAvg: agg._avg.rating ?? 0, ratingCount: count };
    }),
  );
  const servicesWithRatings = await Promise.all(
    serviceFavs.map(async (f) => {
      const agg = await prisma.review.aggregate({ where: { serviceId: f.service!.id }, _avg: { rating: true } });
      const count = await prisma.review.count({ where: { serviceId: f.service!.id } });
      return { ...f.service!, ratingAvg: agg._avg.rating ?? 0, ratingCount: count };
    }),
  );

  const total = productsWithRatings.length + suppliersWithRatings.length + servicesWithRatings.length;

  return (
    <div className="container-content section">
      <h1 className="h2 mb-8">المفضلة</h1>

      {total === 0 ? (
        <EmptyState
          title="لا توجد عناصر محفوظة بعد"
          description="اضغط زر الحفظ في أي منتج أو مورد أو خدمة لإضافته هنا."
          action={
            <Link href="/discover" className="btn btn-primary">
              اكتشف المنصة
            </Link>
          }
        />
      ) : (
        <div className="space-y-12">
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
                    sellerName={p.sellerName}
                    verified={p.verified}
                    ratingAvg={p.ratingAvg}
                    ratingCount={p.ratingCount}
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
