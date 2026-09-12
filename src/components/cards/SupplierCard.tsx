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
}: {
  id: string;
  name: string;
  logo: string | null;
  specialty: string;
  city: string | null;
  verified: boolean;
  ratingAvg: number;
  ratingCount: number;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-sand shrink-0">
          <Image src={firstImage(logo, name, id)} alt={name} fill unoptimized className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{name}</p>
          <p className="text-sm text-muted truncate">{specialty}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {verified && <VerifiedBadge />}
        <RatingBadge average={ratingAvg} count={ratingCount} />
        {city && <span className="badge badge-muted">{city}</span>}
      </div>
      <Link href={`/suppliers/${id}`} className="btn btn-secondary mt-1 w-full">
        عرض المورد
      </Link>
    </div>
  );
}
