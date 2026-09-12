import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { firstImage } from '@/lib/images';
import { ratingFor } from '@/lib/ratings';
import { VerifiedBadge, RatingBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!service || service.hidden) notFound();

  const [{ avg, count }, user] = await Promise.all([
    ratingFor({ serviceId: service.id }),
    getCurrentUser(),
  ]);

  const favorite = user
    ? await prisma.favorite.findFirst({ where: { userId: user.id, serviceId: service.id } })
    : null;
  const areas: string[] = JSON.parse(service.areas || '[]');

  return (
    <div className="container-content section">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand">
          <Image
            src={firstImage(service.image, service.name, service.id)}
            alt={service.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {service.verified && <VerifiedBadge />}
            <RatingBadge average={avg} count={count} />
            {service.category && <span className="badge badge-muted">{service.category.name}</span>}
          </div>

          <h1 className="h2 mb-2">{service.name}</h1>
          <p className="text-muted mb-2">{service.type}</p>
          {areas.length > 0 && (
            <p className="text-sm text-muted mb-6">مناطق الخدمة: {areas.join('، ')}</p>
          )}
          {service.description && <p className="leading-relaxed mb-8">{service.description}</p>}

          <FavoriteButton
            target={{ serviceId: service.id }}
            redirectPath={`/services/${service.id}`}
            initialFavorited={Boolean(favorite)}
          />
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <ReviewsSection target={{ serviceId: service.id }} redirectPath={`/services/${service.id}`} />
      </div>
    </div>
  );
}
