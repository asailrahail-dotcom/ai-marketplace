'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateCartItemQuantity, removeCartItem } from '@/app/actions/cart';

export function CartQuantityControl({ cartItemId, quantity }: { cartItemId: string; quantity: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function update(next: number) {
    startTransition(async () => {
      await updateCartItemQuantity(cartItemId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="flex items-center border border-line rounded-lg">
        <button
          type="button"
          disabled={pending}
          onClick={() => update(quantity - 1)}
          className="px-3 py-1.5 text-lg leading-none"
        >
          −
        </button>
        <span className="px-3 text-sm font-medium min-w-[2ch] text-center">{quantity}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => update(quantity + 1)}
          className="px-3 py-1.5 text-lg leading-none"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await removeCartItem(cartItemId);
            router.refresh();
          })
        }
        className="text-sm text-muted hover:text-ink"
      >
        إزالة
      </button>
    </div>
  );
}
