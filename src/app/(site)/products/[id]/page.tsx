import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { firstImage } from '@/lib/images';
import { ratingFor } from '@/lib/ratings';
import { VerifiedBadge, RatingBadge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { seller: true, category: true },
  });
  if (!product || product.hidden) notFound();

  const [{ avg, count }, user] = await Promise.all([
    ratingFor({ productId: product.id }),
    getCurrentUser(),
  ]);

  const favorite = user
    ? await prisma.favorite.findFirst({ where: { userId: user.id, productId: product.id } })
    : null;

  return (
    <div className="container-content section">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-sand">
          <Image
            src={firstImage(product.images, product.name, product.id)}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {product.verified && <VerifiedBadge />}
            <RatingBadge average={avg} count={count} />
            <span className="badge badge-muted">{product.condition === 'NEW' ? 'جديد' : 'مستعمل'}</span>
            {product.category && <span className="badge badge-muted">{product.category.name}</span>}
          </div>

          <h1 className="h2 mb-2">{product.name}</h1>
          <p className="text-muted mb-4">البائع: {product.seller.name}</p>
          <p className="text-3xl font-bold mb-6">{product.price.toLocaleString('ar-SA')} ر.س</p>

          <p className="leading-relaxed mb-8">{product.description}</p>

          <div className="flex gap-3">
            <AddToCartButton productId={product.id} />
            <FavoriteButton
              target={{ productId: product.id }}
              redirectPath={`/products/${product.id}`}
              initialFavorited={Boolean(favorite)}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <ReviewsSection target={{ productId: product.id }} redirectPath={`/products/${product.id}`} />
      </div>
    </div>
  );
}
