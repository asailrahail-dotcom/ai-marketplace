import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { EmptyState } from '@/components/ui/EmptyState';
import { ORDER_STATUS_LABELS } from '@/lib/order-status';

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container-content section">
      <h1 className="h2 mb-8">طلباتي</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="لا توجد طلبات بعد"
          description="عند إتمام أول عملية شراء ستظهر طلباتك هنا."
          action={
            <Link href="/products" className="btn btn-primary">
              تصفح المنتجات
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="card p-5 flex items-center justify-between hover:border-ink transition-colors">
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-sm text-muted">{o.items.length} منتج · {new Date(o.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">{o.total.toLocaleString('ar-SA')} ر.س</p>
                  <span className="badge badge-muted">{ORDER_STATUS_LABELS[o.status] ?? o.status}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
