'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/app/actions/cart';

export function AddToCartButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        className="btn btn-primary text-sm py-2 px-4 disabled:opacity-60"
        onClick={() => {
          startTransition(async () => {
            const res = await addToCart(productId);
            if (!res.ok) {
              setMessage(res.error ?? 'حدث خطأ.');
              if (res.error?.includes('تسجيل الدخول')) {
                router.push('/login');
              }
            } else {
              setMessage('أُضيف للسلة');
              router.refresh();
            }
          });
        }}
      >
        {pending ? 'جارٍ الإضافة…' : 'أضف للسلة'}
      </button>
      {message && <span className="text-xs text-muted">{message}</span>}
    </div>
  );
}
