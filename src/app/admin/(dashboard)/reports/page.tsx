import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from '@/lib/order-status';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const from = searchParams.from ? new Date(searchParams.from) : undefined;
  const to = searchParams.to ? new Date(searchParams.to) : undefined;

  const where = {
    createdAt: {
      gte: from,
      lte: to,
    },
  };

  const orders = await prisma.order.findMany({ where, select: { total: true, status: true } });
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const byStatus = ORDER_STATUSES.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="max-w-4xl">
      <h1 className="h2 mb-6">التقارير</h1>

      <form className="flex flex-wrap gap-2 mb-8" method="get">
        <input type="date" name="from" defaultValue={searchParams.from} className="input max-w-[180px]" />
        <input type="date" name="to" defaultValue={searchParams.to} className="input max-w-[180px]" />
        <button className="btn btn-secondary" type="submit">تطبيق</button>
      </form>

      {orders.length === 0 ? (
        <EmptyState title="لا توجد بيانات مطابقة لهذه الفترة" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4">
              <p className="text-2xl font-bold">{totalSales.toLocaleString('ar-SA')} ر.س</p>
              <p className="text-xs text-muted mt-1">إجمالي المبيعات</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-xs text-muted mt-1">عدد الطلبات</p>
            </div>
          </div>

          <div className="card p-6">
            <p className="font-semibold mb-4">الطلبات حسب الحالة</p>
            <ul className="space-y-2">
              {byStatus.map((s) => (
                <li key={s.status} className="flex justify-between text-sm">
                  <span>{ORDER_STATUS_LABELS[s.status]}</span>
                  <span className="font-medium">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
