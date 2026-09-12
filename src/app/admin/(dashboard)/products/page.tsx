import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit';
import { toggleProductHidden, toggleProductVerified, deleteProductAdmin } from '@/app/actions/admin';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        name: searchParams.q ? { contains: searchParams.q } : undefined,
        category: searchParams.category ? { slug: searchParams.category } : undefined,
      },
      include: { seller: true, category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <div>
      <h1 className="h2 mb-6">المنتجات</h1>

      <form className="flex flex-wrap gap-2 mb-6" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ابحث باسم المنتج…" className="input max-w-xs" />
        <select name="category" defaultValue={searchParams.category ?? ''} className="input max-w-[180px]">
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" type="submit">تصفية</button>
      </form>

      {products.length === 0 ? (
        <EmptyState title="لا توجد منتجات مطابقة" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-sand text-right">
              <tr>
                <th className="p-3">المنتج</th>
                <th className="p-3">البائع</th>
                <th className="p-3">السعر</th>
                <th className="p-3">التصنيف</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted">{p.seller.name}</td>
                  <td className="p-3">{p.price.toLocaleString('ar-SA')} ر.س</td>
                  <td className="p-3 text-muted">{p.category?.name ?? '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.verified && <span className="badge badge-verified">موثّق</span>}
                      {p.hidden && <span className="badge badge-muted">مخفي</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      <form action={toggleProductVerified}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="btn btn-ghost text-xs py-1 px-2">
                          {p.verified ? 'إلغاء التوثيق' : 'توثيق'}
                        </button>
                      </form>
                      <form action={toggleProductHidden}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="btn btn-ghost text-xs py-1 px-2">
                          {p.hidden ? 'إظهار' : 'إخفاء'}
                        </button>
                      </form>
                      <form action={deleteProductAdmin}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmit confirmText="هل تريد حذف هذا المنتج نهائيًا؟" className="btn btn-ghost text-xs py-1 px-2 text-red-600">
                          حذف
                        </ConfirmSubmit>
                      </form>
                    </div>
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
