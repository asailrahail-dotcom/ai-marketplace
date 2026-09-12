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
        aria-label="أضف للسلة"
        className="w-9 h-9 rounded-full bg-green text-white flex items-center justify-center hover:bg-greenDark transition-colors disabled:opacity-60 shrink-0"
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      {message && <span className="text-xs text-muted">{message}</span>}
    </div>
  );
}
