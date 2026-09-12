import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { toggleSupplierHidden, toggleSupplierVerified, updateSupplierSpecialty } from '@/app/actions/admin';

export default async function AdminSuppliersPage({ searchParams }: { searchParams: { q?: string } }) {
  const suppliers = await prisma.supplier.findMany({
    where: { name: searchParams.q ? { contains: searchParams.q } : undefined },
    include: { category: true, owner: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="h2 mb-6">الموردون</h1>

      <form className="flex gap-2 mb-6" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ابحث باسم المورد…" className="input max-w-xs" />
        <button className="btn btn-secondary" type="submit">بحث</button>
      </form>

      {suppliers.length === 0 ? (
        <EmptyState title="لا يوجد موردون مطابقون" />
      ) : (
        <div className="space-y-4">
          {suppliers.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-muted">{s.owner.email} · {s.category?.name ?? 'بدون تصنيف'}</p>
                </div>
                <div className="flex gap-1">
                  {s.verified && <span className="badge badge-verified">موثّق</span>}
                  {s.hidden && <span className="badge badge-muted">مخفي</span>}
                </div>
              </div>

              <form action={updateSupplierSpecialty} className="flex gap-2 mb-3">
                <input type="hidden" name="id" value={s.id} />
                <input name="specialty" defaultValue={s.specialty} className="input flex-1" />
                <button className="btn btn-secondary text-sm">حفظ التخصص</button>
              </form>

              <div className="flex gap-2 flex-wrap">
                <form action={toggleSupplierVerified}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="btn btn-ghost text-xs py-1 px-2">{s.verified ? 'إلغاء التوثيق' : 'توثيق'}</button>
                </form>
                <form action={toggleSupplierHidden}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="btn btn-ghost text-xs py-1 px-2">{s.hidden ? 'إظهار' : 'إخفاء'}</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
