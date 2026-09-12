import Link from 'next/link';
import Image from 'next/image';
import { VerifiedBadge, RatingBadge } from '@/components/ui/Badge';
import { firstImage } from '@/lib/images';

export function ServiceCard({
  id,
  name,
  type,
  areas,
  image,
  verified,
  ratingAvg,
  ratingCount,
}: {
  id: string;
  name: string;
  type: string;
  areas: string[];
  image: string | null;
  verified: boolean;
  ratingAvg: number;
  ratingCount: number;
}) {
  return (
    <div className="card group flex flex-col">
      <Link href={`/services/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={firstImage(image, name, id)}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {verified && <VerifiedBadge />}
          <RatingBadge average={ratingAvg} count={ratingCount} />
        </div>
        <Link href={`/services/${id}`} className="font-semibold leading-snug hover:underline">
          {name}
        </Link>
        <p className="text-sm text-muted">{type}</p>
        {areas.length > 0 && (
          <p className="text-xs text-muted truncate">مناطق الخدمة: {areas.join('، ')}</p>
        )}
        <Link href={`/services/${id}`} className="btn btn-secondary mt-auto">
          عرض الخدمة
        </Link>
      </div>
    </div>
  );
}
