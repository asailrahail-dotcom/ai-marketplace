'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFavorite } from '@/app/actions/favorites';

export function FavoriteButton({
  target,
  redirectPath,
  initialFavorited,
}: {
  target: { productId?: string; supplierId?: string; serviceId?: string };
  redirectPath: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="حفظ في المفضلة"
      onClick={() => {
        startTransition(async () => {
          const res = await toggleFavorite(target, redirectPath);
          if (!res.ok) {
            router.push('/login');
            return;
          }
          setFavorited(Boolean(res.favorited));
        });
      }}
      className={`btn ${favorited ? 'btn-primary' : 'btn-secondary'} text-sm py-2 px-4`}
    >
      {favorited ? 'محفوظ ✓' : 'حفظ'}
    </button>
  );
}
