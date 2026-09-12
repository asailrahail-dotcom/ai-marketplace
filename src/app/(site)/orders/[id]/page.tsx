import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ORDER_STATUS_LABELS } from '@/lib/order-status';

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { placed?: string };
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } }, address: true },
  });
  if (!order || order.buyerId !== user.id) notFound();

  return (
    <div className="container-content section max-w-2xl">
      {searchParams.placed && (
        <div className="mb-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">
          تم إنشاء طلبك بنجاح. سيتم التواصل معك لتأكيد الدفع والتوصيل.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h2">{order.orderNumber}</h1>
          <p className="text-muted text-sm mt-1">{new Date(order.createdAt).toLocaleString('ar-SA')}</p>
        </div>
        <span className="badge badge-muted">{ORDER_STATUS_LABELS[order.status] ?? order.status}</span>
      </div>

      <div className="card p-5 mb-6">
        <p className="font-semibold mb-3">المنتجات</p>
        <ul className="space-y-2">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between text-sm">
              <span>{it.product.name} × {it.quantity}</span>
              <span>{(it.price * it.quantity).toLocaleString('ar-SA')} ر.س</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-3 mt-3 font-bold">
          <span>الإجمالي</span>
          <span>{order.total.toLocaleString('ar-SA')} ر.س</span>
        </div>
      </div>

      {order.address && (
        <div className="card p-5">
          <p className="font-semibold mb-2">عنوان التوصيل</p>
          <p className="text-sm text-muted">
            {order.address.fullName} · {order.address.phone}
            <br />
            {order.address.city} — {order.address.details}
          </p>
        </div>
      )}
    </div>
  );
}
