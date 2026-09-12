import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logoutUser } from '@/app/actions/auth';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [productCount, supplierCount, serviceCount, orderCount] = await Promise.all([
    prisma.product.count({ where: { sellerId: user.id } }),
    prisma.supplier.count({ where: { ownerId: user.id } }),
    prisma.service.count({ where: { providerId: user.id } }),
    prisma.order.count({ where: { buyerId: user.id } }),
  ]);

  return (
    <div className="container-content section max-w-2xl">
      <h1 className="h2 mb-2">حسابي</h1>
      <p className="text-muted mb-8">{user.name} · {user.email}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <Stat label="منتجاتي" value={productCount} />
        <Stat label="كمورد" value={supplierCount} />
        <Stat label="خدماتي" value={serviceCount} />
        <Stat label="طلباتي" value={orderCount} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        <Link href="/orders" className="card p-5 hover:border-ink transition-colors">
          <p className="font-semibold">طلباتي</p>
          <p className="text-sm text-muted">تتبّع مشترياتك</p>
        </Link>
        <Link href="/favorites" className="card p-5 hover:border-ink transition-colors">
          <p className="font-semibold">المفضلة</p>
          <p className="text-sm text-muted">العناصر المحفوظة</p>
        </Link>
        <Link href="/project-needs" className="card p-5 hover:border-ink transition-colors">
          <p className="font-semibold">احتياجات مشروعي</p>
          <p className="text-sm text-muted">من مشروع AI</p>
        </Link>
        <Link href="/add" className="card p-5 hover:border-ink transition-colors">
          <p className="font-semibold">أضف منتجك</p>
          <p className="text-sm text-muted">منتج، مورد، أو خدمة</p>
        </Link>
      </div>

      <form action={logoutUser}>
        <button type="submit" className="btn btn-secondary">
          تسجيل الخروج
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
