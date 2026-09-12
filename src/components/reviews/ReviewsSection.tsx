import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createReview } from '@/app/actions/reviews';
import { EmptyState } from '@/components/ui/EmptyState';

export async function ReviewsSection({
  target,
  redirectPath,
}: {
  target: { productId?: string; supplierId?: string; serviceId?: string };
  redirectPath: string;
}) {
  const [reviews, user] = await Promise.all([
    prisma.review.findMany({
      where: target,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    }),
    getCurrentUser(),
  ]);

  return (
    <div>
      <h2 className="h2 mb-6">التقييمات</h2>

      {reviews.length === 0 ? (
        <EmptyState title="لا توجد تقييمات بعد" description="كن أول من يشارك رأيه." />
      ) : (
        <ul className="space-y-4 mb-8">
          {reviews.map((r) => (
            <li key={r.id} className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{r.author.name}</span>
                <span className="text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {r.comment && <p className="text-sm text-muted">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form action={createReview} className="card p-4 space-y-3">
          {target.productId && <input type="hidden" name="productId" value={target.productId} />}
          {target.supplierId && <input type="hidden" name="supplierId" value={target.supplierId} />}
          {target.serviceId && <input type="hidden" name="serviceId" value={target.serviceId} />}
          <input type="hidden" name="redirectPath" value={redirectPath} />
          <p className="font-semibold text-sm">أضف تقييمك</p>
          <select name="rating" required className="input max-w-[140px]" defaultValue="">
            <option value="" disabled>
              التقييم
            </option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)} ({n})
              </option>
            ))}
          </select>
          <textarea name="comment" rows={2} className="input" placeholder="اكتب تعليقك (اختياري)" />
          <button type="submit" className="btn btn-primary">
            إرسال التقييم
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          <a href="/login" className="underline">
            سجّل الدخول
          </a>{' '}
          لإضافة تقييم.
        </p>
      )}
    </div>
  );
}
