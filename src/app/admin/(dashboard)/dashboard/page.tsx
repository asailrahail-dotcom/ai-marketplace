import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ORDER_STATUS_LABELS } from '@/lib/order-status';

export default async function AdminDashboardPage() {
  const [userCount, productCount, supplierCount, serviceCount, orderCount, salesAgg, recentOrders, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.supplier.count(),
      prisma.service.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { buyer: true } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

  const totalSales = salesAgg._sum.total ?? 0;

  return (
    <div className="max-w-6xl">
      <h1 className="h2 mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard label="إجمالي المبيعات" value={`${totalSales.toLocaleString('ar-SA')} ر.س`} />
        <StatCard label="المستخدمون" value={userCount} />
        <StatCard label="المنتجات" value={productCount} />
        <StatCard label="الموردون" value={supplierCount} />
        <StatCard label="الخدمات" value={serviceCount} />
        <StatCard label="الطلبات" value={orderCount} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">أحدث الطلبات</h2>
            <Link href="/admin/orders" className="text-sm font-semibold hover:underline">
              عرض الكل
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted">لا توجد طلبات بعد.</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between text-sm">
                  <span>{o.orderNumber} — {o.buyer.name}</span>
                  <span className="badge badge-muted">{ORDER_STATUS_LABELS[o.status] ?? o.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">أحدث المستخدمين</h2>
            <Link href="/admin/users" className="text-sm font-semibold hover:underline">
              عرض الكل
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted">لا يوجد مستخدمون بعد.</p>
          ) : (
            <ul className="space-y-3">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between text-sm">
                  <span>{u.name}</span>
                  <span className="text-muted">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
