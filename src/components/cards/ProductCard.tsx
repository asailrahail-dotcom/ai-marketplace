import Link from 'next/link';
import Image from 'next/image';
import { VerifiedBadge, RatingBadge } from '@/components/ui/Badge';
import { firstImage } from '@/lib/images';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

export function ProductCard({
  id,
  name,
  condition,
  price,
  images,
  sellerName,
  verified,
  ratingAvg,
  ratingCount,
  categorySlug,
}: {
  id: string;
  name: string;
  condition: string;
  price: number;
  images: string | null;
  sellerName: string;
  verified: boolean;
  ratingAvg: number;
  ratingCount: number;
  categorySlug?: string | null;
}) {
  return (
    <div className="card group flex flex-col">
      <Link href={`/products/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={firstImage(images, name, id, categorySlug)}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 badge bg-paper/90 text-ink">
          {condition === 'NEW' ? 'جديد' : 'مستعمل'}
        </span>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {verified && <VerifiedBadge />}
          <RatingBadge average={ratingAvg} count={ratingCount} />
        </div>
        <Link href={`/products/${id}`} className="font-semibold leading-snug hover:underline">
          {name}
        </Link>
        <p className="text-sm text-muted">{sellerName}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold">{price.toLocaleString('ar-SA')} ر.س</span>
          <AddToCartButton productId={id} />
        </div>
      </div>
    </div>
  );
}
