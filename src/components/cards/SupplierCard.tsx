import Link from 'next/link';
import Image from 'next/image';
import { VerifiedBadge, RatingBadge } from '@/components/ui/Badge';
import { firstImage } from '@/lib/images';

export function SupplierCard({
  id,
  name,
  logo,
  specialty,
  city,
  verified,
  ratingAvg,
  ratingCount,
  categorySlug,
}: {
  id: string;
  name: string;
  logo: string | null;
  specialty: string;
  city: string | null;
  verified: boolean;
  ratingAvg: number;
  ratingCount: number;
  categorySlug?: string | null;
}) {
  return (
    <div className="card group flex flex-col">
      <Link href={`/suppliers/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={firstImage(logo, name, id, categorySlug)}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/suppliers/${id}`} className="font-semibold leading-snug hover:underline">
          {name}
        </Link>
        <p className="text-sm text-muted">{specialty}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {verified && <VerifiedBadge />}
          <RatingBadge average={ratingAvg} count={ratingCount} />
          {city && <span className="badge badge-muted">{city}</span>}
        </div>
        <Link href={`/suppliers/${id}`} className="btn btn-secondary mt-auto">
          عرض المورد
        </Link>
      </div>
    </div>
  );
}
