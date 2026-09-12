import { prisma } from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit';
import {
  createCategory,
  updateCategory,
  toggleCategoryHidden,
  deleteCategory,
  reorderCategory,
} from '@/app/actions/admin';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true, suppliers: true, services: true } } },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="h2 mb-6">التصنيفات</h1>

      <div className="card p-5 mb-8">
        <p className="font-semibold mb-3">إضافة تصنيف جديد</p>
        <form action={createCategory} className="grid sm:grid-cols-2 gap-3">
          <input name="name" required placeholder="الاسم بالعربية" className="input" />
          <input name="nameEn" placeholder="Name in English" className="input" />
          <input name="slug" required placeholder="slug (مثال: lighting)" className="input" />
          <input name="keywords" placeholder="كلمات مفتاحية مفصولة بفاصلة" className="input" />
          <button className="btn btn-primary sm:col-span-2">إضافة</button>
        </form>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="لا توجد تصنيفات بعد" />
      ) : (
        <div className="space-y-3">
          {categories.map((c, i) => (
            <div key={c.id} className="card p-4">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <form action={reorderCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button disabled={i === 0} className="btn btn-ghost text-xs px-2 py-1 disabled:opacity-30">▲</button>
                  </form>
                  <form action={reorderCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button disabled={i === categories.length - 1} className="btn btn-ghost text-xs px-2 py-1 disabled:opacity-30">▼</button>
                  </form>
                  <span className="font-semibold">{c.name}</span>
                  {c.hidden && <span className="badge badge-muted">مخفي</span>}
                </div>
                <div className="text-xs text-muted">
                  {c._count.products} منتج · {c._count.suppliers} مورد · {c._count.services} خدمة
                </div>
              </div>

              <form action={updateCategory} className="grid sm:grid-cols-3 gap-2 mb-3">
                <input type="hidden" name="id" value={c.id} />
                <input name="name" defaultValue={c.name} className="input text-sm" />
                <input name="nameEn" defaultValue={c.nameEn ?? ''} className="input text-sm" />
                <input name="keywords" defaultValue={c.keywords ?? ''} className="input text-sm" />
                <button className="btn btn-secondary text-sm sm:col-span-3">حفظ التعديلات</button>
              </form>

              <div className="flex gap-2">
                <form action={toggleCategoryHidden}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="btn btn-ghost text-xs py-1 px-2">{c.hidden ? 'إظهار' : 'إخفاء'}</button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmSubmit confirmText="سيتم حذف التصنيف وإزالة ربطه بالمنتجات الحالية. متابعة؟" className="btn btn-ghost text-xs py-1 px-2 text-red-600">
                    حذف
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted mt-8">
        الهيكل الحالي يدعم إضافة تصنيفات فرعية (subcategories) لاحقًا عبر حقل الأصل (parent) دون الحاجة لإعادة بناء النظام.
      </p>
    </div>
  );
}
