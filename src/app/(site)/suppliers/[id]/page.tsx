import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { firstImage } from '@/lib/images';
import { ratingFor } from '@/lib/ratings';
import { VerifiedBadge, RatingBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';

export default async function SupplierDetailPage({ params }: { params: { id: string } }) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!supplier || supplier.hidden) notFound();

  const [{ avg, count }, user] = await Promise.all([
    ratingFor({ supplierId: supplier.id }),
    getCurrentUser(),
  ]);

  const favorite = user
    ? await prisma.favorite.findFirst({ where: { userId: user.id, supplierId: supplier.id } })
    : null;

  return (
    <div className="container-content section">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-sand">
          <Image
            src={firstImage(supplier.logo, supplier.name, supplier.id)}
            alt={supplier.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {supplier.verified && <VerifiedBadge />}
            <RatingBadge average={avg} count={count} />
            {supplier.city && <span className="badge badge-muted">{supplier.city}</span>}
            {supplier.category && <span className="badge badge-muted">{supplier.category.name}</span>}
          </div>

          <h1 className="h2 mb-2">{supplier.name}</h1>
          <p className="text-muted mb-6">{supplier.specialty}</p>
          {supplier.description && <p className="leading-relaxed mb-8">{supplier.description}</p>}

          <FavoriteButton
            target={{ supplierId: supplier.id }}
            redirectPath={`/suppliers/${supplier.id}`}
            initialFavorited={Boolean(favorite)}
          />
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <ReviewsSection target={{ supplierId: supplier.id }} redirectPath={`/suppliers/${supplier.id}`} />
      </div>
    </div>
  );
}
