import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { toggleUserVerified } from '@/app/actions/admin';

export default async function AdminUsersPage({ searchParams }: { searchParams: { q?: string; verified?: string } }) {
  const users = await prisma.user.findMany({
    where: {
      name: searchParams.q ? { contains: searchParams.q } : undefined,
      verified:
        searchParams.verified === 'yes' ? true : searchParams.verified === 'no' ? false : undefined,
    },
    include: { _count: { select: { products: true, suppliers: true, services: true, ordersAsBuyer: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="h2 mb-6">المستخدمون</h1>

      <form className="flex flex-wrap gap-2 mb-6" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ابحث بالاسم…" className="input max-w-xs" />
        <select name="verified" defaultValue={searchParams.verified ?? ''} className="input max-w-[180px]">
          <option value="">كل الحالات</option>
          <option value="yes">موثّق</option>
          <option value="no">غير موثّق</option>
        </select>
        <button className="btn btn-secondary" type="submit">تصفية</button>
      </form>

      {users.length === 0 ? (
        <EmptyState title="لا يوجد مستخدمون مطابقون" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-sand text-right">
              <tr>
                <th className="p-3">الاسم</th>
                <th className="p-3">البريد الإلكتروني</th>
                <th className="p-3">النشاط</th>
                <th className="p-3">حالة التوثيق</th>
                <th className="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-muted">{u.email}</td>
                  <td className="p-3 text-muted text-xs">
                    {u._count.products} منتج · {u._count.suppliers} مورد · {u._count.services} خدمة · {u._count.ordersAsBuyer} طلب
                  </td>
                  <td className="p-3">
                    {u.verified ? <span className="badge badge-verified">موثّق</span> : <span className="badge badge-muted">غير موثّق</span>}
                  </td>
                  <td className="p-3">
                    <form action={toggleUserVerified}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="btn btn-ghost text-xs py-1 px-2">
                        {u.verified ? 'إلغاء التوثيق' : 'توثيق'}
                      </button>
                    </form>
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
