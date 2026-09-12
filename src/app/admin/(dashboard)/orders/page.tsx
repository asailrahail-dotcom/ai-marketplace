import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from '@/lib/order-status';

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const orders = await prisma.order.findMany({
    where: { status: searchParams.status || undefined },
    include: { buyer: true, items: { include: { product: { include: { seller: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="h2 mb-6">الطلبات</h1>

      <form className="flex gap-2 mb-6" method="get">
        <select name="status" defaultValue={searchParams.status ?? ''} className="input max-w-[200px]">
          <option value="">كل الحالات</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" type="submit">تصفية</button>
      </form>

      {orders.length === 0 ? (
        <EmptyState title="لا توجد طلبات مطابقة" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-sand text-right">
              <tr>
                <th className="p-3">رقم الطلب</th>
                <th className="p-3">المشتري</th>
                <th className="p-3">البائع</th>
                <th className="p-3">المنتج</th>
                <th className="p-3">السعر</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="p-3 font-medium">{o.orderNumber}</td>
                  <td className="p-3">{o.buyer.name}</td>
                  <td className="p-3 text-muted">{o.items[0]?.product.seller.name ?? '—'}</td>
                  <td className="p-3 text-muted">
                    {o.items.length > 1 ? `${o.items[0]?.product.name} +${o.items.length - 1}` : o.items[0]?.product.name}
                  </td>
                  <td className="p-3">{o.total.toLocaleString('ar-SA')} ر.س</td>
                  <td className="p-3 text-muted">{new Date(o.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td className="p-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
