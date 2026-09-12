import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { matchNeedsToMarketplace } from '@/lib/ai/needs-search';
import { deleteProjectNeed } from '@/app/actions/project-needs';
import { ProjectNeedItemToggle } from '@/components/project-needs/ProjectNeedItemToggle';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit';

export default async function ProjectNeedsPage() {
  const user = await getCurrentUser();
  if (!user) return null; // middleware redirects to /login before this renders

  const projectNeeds = await prisma.projectNeed.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container-content section max-w-3xl">
      <h1 className="h2 mb-2">احتياجات مشروعي</h1>
      <p className="text-muted mb-10">الاحتياجات التي استخرجها مشروع AI من طلباتك، ومرتبطة مباشرة بالسوق.</p>

      {projectNeeds.length === 0 ? (
        <EmptyState
          title="لا توجد احتياجات محفوظة بعد"
          description="استخدم مشروع AI لوصف مشروعك، ثم احفظ الاحتياجات هنا لمتابعتها."
          action={
            <Link href="/ai" className="btn btn-primary">
              اذهب إلى مشروع AI
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {await Promise.all(
            projectNeeds.map(async (pn) => {
              const matches = await matchNeedsToMarketplace(
                pn.items.map((i) => ({ label: i.label, categorySlug: i.categorySlug })),
              );
              return (
                <div key={pn.id} className="card p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex gap-2 flex-wrap mb-1">
                        {pn.projectType && <span className="badge badge-muted">{pn.projectType}</span>}
                        {pn.projectStage && <span className="badge badge-muted">{pn.projectStage}</span>}
                      </div>
                      <p className="text-sm text-muted">{pn.rawInput}</p>
                    </div>
                    <form action={deleteProjectNeed}>
                      <input type="hidden" name="id" value={pn.id} />
                      <ConfirmSubmit confirmText="هل تريد حذف هذه الاحتياجات؟" className="btn btn-ghost text-sm">
                        حذف
                      </ConfirmSubmit>
                    </form>
                  </div>

                  <ul className="space-y-3">
                    {pn.items.map((item) => {
                      const match = matches.find((m) => m.label === item.label);
                      const total = match ? match.productCount + match.supplierCount + match.serviceCount : 0;
                      return (
                        <li key={item.id} className="flex items-center justify-between gap-4 border-t border-line pt-3 first:border-0 first:pt-0">
                          <ProjectNeedItemToggle itemId={item.id} label={item.label} done={item.done} />
                          {total > 0 ? (
                            <div className="flex gap-2 text-xs shrink-0">
                              <Link href={`/products?category=${item.categorySlug}`} className="badge badge-muted hover:bg-line">
                                منتجات {match?.productCount}
                              </Link>
                              <Link href={`/suppliers?category=${item.categorySlug}`} className="badge badge-muted hover:bg-line">
                                موردون {match?.supplierCount}
                              </Link>
                              <Link href={`/services?category=${item.categorySlug}`} className="badge badge-muted hover:bg-line">
                                خدمات {match?.serviceCount}
                              </Link>
                            </div>
                          ) : (
                            <span className="text-xs text-muted shrink-0">لا توجد نتائج حاليًا</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}
