'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/app/actions/admin';
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from '@/lib/order-status';

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      className="input text-xs py-1"
      onChange={(e) => {
        const formData = new FormData();
        formData.set('id', orderId);
        formData.set('status', e.target.value);
        startTransition(async () => {
          await updateOrderStatus(formData);
          router.refresh();
        });
      }}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
