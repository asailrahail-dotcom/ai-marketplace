import Link from 'next/link';
import { extractProjectNeeds } from '@/lib/ai/needs-extractor';
import { matchNeedsToMarketplace } from '@/lib/ai/needs-search';
import { saveProjectNeeds } from '@/app/actions/project-needs';

export default async function AiPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? '').trim();

  if (!q) {
    return (
      <div className="container-content section max-w-2xl text-center">
        <p className="eyebrow mb-4">مشروع AI</p>
        <h1 className="h1">وش مشروعك؟ وش تحتاج؟</h1>
        <p className="text-muted text-lg mt-4">
          اكتب احتياجك، وخلي مشروع يساعدك تلقى المنتجات والموردين والخدمات المناسبة.
        </p>
        <form action="/ai" method="get" className="mt-10">
          <div className="card p-2 flex flex-col sm:flex-row gap-2">
            <textarea
              name="q"
              rows={3}
              required
              placeholder="اكتب احتياج مشروعك هنا…"
              className="flex-1 resize-none px-4 py-3 focus:outline-none"
            />
            <button className="btn btn-primary px-6 self-end sm:self-stretch">ابدأ مع مشروع</button>
          </div>
        </form>
        <p className="text-muted text-xs mt-4">
          مثال: أبي أجهز شاليه من الصفر وأحتاج إضاءة وأثاث ومسبح وكهربائي وسباك.
        </p>
      </div>
    );
  }

  const extracted = extractProjectNeeds(q);
  const matches = await matchNeedsToMarketplace(extracted.needs);
  const anyResults = matches.some((m) => m.productCount + m.supplierCount + m.serviceCount > 0);

  return (
    <div className="container-content section max-w-4xl">
      <div className="mb-10">
        <p className="eyebrow mb-2">مشروع AI</p>
        <p className="text-muted bg-sand rounded-xl p-4 text-sm leading-relaxed">"{q}"</p>
      </div>

      <div className="card p-6 mb-10">
        <h1 className="h2 mb-6">فهمنا احتياجك</h1>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="eyebrow mb-1">نوع المشروع</p>
            <p className="font-semibold text-lg">{extracted.projectType ?? 'غير محدد'}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">مرحلة المشروع</p>
            <p className="font-semibold text-lg">{extracted.projectStage ?? 'غير محدد'}</p>
          </div>
        </div>
        {extracted.needs.length > 0 && (
          <div className="mt-6">
            <p className="eyebrow mb-2">الاحتياجات</p>
            <div className="flex flex-wrap gap-2">
              {extracted.needs.map((n) => (
                <span key={n.label} className="badge badge-muted">
                  {n.label}
                  {n.estimatedQuantity ? ` (≈ ${n.estimatedQuantity})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {extracted.needs.length === 0 ? (
        <div className="card p-8 text-center mb-10">
          <p className="font-semibold mb-2">لم نتمكن من تحديد احتياجات واضحة من النص</p>
          <p className="text-muted text-sm mb-6">
            جرّب إعادة صياغة احتياجك بتفاصيل أكثر، أو تصفّح المنصة مباشرة.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/discover" className="btn btn-secondary">تصفح المنصة</Link>
          </div>
        </div>
      ) : (
        <>
          <h2 className="h2 mb-6">احتياجات مشروعك</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {matches.map((m) => {
              const total = m.productCount + m.supplierCount + m.serviceCount;
              return (
                <div key={m.label} className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{m.label}</h3>
                    {m.estimatedQuantity && (
                      <span className="badge badge-muted">الكمية التقديرية: {m.estimatedQuantity}</span>
                    )}
                  </div>
                  {total === 0 ? (
                    <p className="text-sm text-muted">لم نجد نتائج مطابقة حاليًا داخل المنصة.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Link
                        href={`/products?category=${m.categorySlug}`}
                        className="rounded-lg bg-sand py-3 hover:bg-line transition-colors"
                      >
                        <p className="font-bold">{m.productCount}</p>
                        <p className="text-xs text-muted">منتجات</p>
                      </Link>
                      <Link
                        href={`/suppliers?category=${m.categorySlug}`}
                        className="rounded-lg bg-sand py-3 hover:bg-line transition-colors"
                      >
                        <p className="font-bold">{m.supplierCount}</p>
                        <p className="text-xs text-muted">موردون</p>
                      </Link>
                      <Link
                        href={`/services?category=${m.categorySlug}`}
                        className="rounded-lg bg-sand py-3 hover:bg-line transition-colors"
                      >
                        <p className="font-bold">{m.serviceCount}</p>
                        <p className="text-xs text-muted">خدمات</p>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!anyResults && (
            <div className="card p-6 mb-10 bg-sand border-line">
              <p className="text-sm">لم نجد نتائج مطابقة حاليًا داخل المنصة لأي من هذه الاحتياجات.</p>
            </div>
          )}

          <form action={saveProjectNeeds} className="mb-10">
            <input type="hidden" name="rawInput" value={q} />
            <button type="submit" className="btn btn-primary">
              حفظ في احتياجات مشروعي
            </button>
          </form>
        </>
      )}

      <p className="text-xs text-muted border-t border-line pt-6">
        هذه التقديرات تقريبية وليست استشارة هندسية أو مواصفات تنفيذية.
      </p>
    </div>
  );
}
