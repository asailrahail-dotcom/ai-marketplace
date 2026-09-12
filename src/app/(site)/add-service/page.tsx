import { prisma } from '@/lib/db';
import { createService } from '@/app/actions/listings';

export default async function AddServicePage({ searchParams }: { searchParams: { error?: string } }) {
  const categories = await prisma.category.findMany({ where: { hidden: false }, orderBy: { order: 'asc' } });

  return (
    <div className="container-content section max-w-xl">
      <h1 className="h2 mb-8">أضف خدمة</h1>

      {searchParams.error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {searchParams.error}
        </div>
      )}

      <form action={createService} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">اسم الخدمة</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">نوع الخدمة</label>
          <input name="type" required className="input" placeholder="مثال: تركيب وصيانة" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">نبذة (اختياري)</label>
          <textarea name="description" rows={4} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">مناطق الخدمة (افصل بفاصلة)</label>
          <input name="areas" className="input" placeholder="الرياض، جدة" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">التصنيف</label>
          <select name="categorySlug" className="input">
            <option value="">بدون تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">رابط صورة (اختياري)</label>
          <input name="image" type="url" className="input" placeholder="https://…" />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          نشر الخدمة
        </button>
      </form>
    </div>
  );
}
