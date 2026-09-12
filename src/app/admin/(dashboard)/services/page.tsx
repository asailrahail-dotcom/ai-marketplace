import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit';
import { toggleServiceHidden, toggleServiceVerified, deleteServiceAdmin } from '@/app/actions/admin';

export default async function AdminServicesPage({ searchParams }: { searchParams: { q?: string } }) {
  const services = await prisma.service.findMany({
    where: { name: searchParams.q ? { contains: searchParams.q } : undefined },
    include: { category: true, provider: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="h2 mb-6">الخدمات</h1>

      <form className="flex gap-2 mb-6" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ابحث باسم الخدمة…" className="input max-w-xs" />
        <button className="btn btn-secondary" type="submit">بحث</button>
      </form>

      {services.length === 0 ? (
        <EmptyState title="لا توجد خدمات مطابقة" />
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div key={s.id} className="card p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-muted">{s.type} · {s.provider.email} · {s.category?.name ?? 'بدون تصنيف'}</p>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {s.verified && <span className="badge badge-verified">موثّق</span>}
                {s.hidden && <span className="badge badge-muted">مخفي</span>}
                <form action={toggleServiceVerified}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="btn btn-ghost text-xs py-1 px-2">{s.verified ? 'إلغاء التوثيق' : 'توثيق'}</button>
                </form>
                <form action={toggleServiceHidden}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="btn btn-ghost text-xs py-1 px-2">{s.hidden ? 'إظهار' : 'إخفاء'}</button>
                </form>
                <form action={deleteServiceAdmin}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmSubmit confirmText="هل تريد حذف هذه الخدمة نهائيًا؟" className="btn btn-ghost text-xs py-1 px-2 text-red-600">
                    حذف
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
