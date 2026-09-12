import { prisma } from '@/lib/db';
import type { ExtractedNeed } from '@/lib/ai/needs-extractor';

export interface NeedMarketMatch extends ExtractedNeed {
  categoryName: string | null;
  productCount: number;
  supplierCount: number;
  serviceCount: number;
}

/**
 * Turns each extracted need into a REAL marketplace search: it looks up the
 * matching category in the database and counts actual listings. Nothing here
 * is invented — a need with no matching category or listings simply reports
 * zero counts, and the caller is expected to render an honest "no results"
 * state rather than fabricate matches.
 */
export async function matchNeedsToMarketplace(needs: ExtractedNeed[]): Promise<NeedMarketMatch[]> {
  return Promise.all(
    needs.map(async (need) => {
      if (!need.categorySlug) {
        return { ...need, categoryName: null, productCount: 0, supplierCount: 0, serviceCount: 0 };
      }
      const category = await prisma.category.findUnique({ where: { slug: need.categorySlug } });
      if (!category) {
        return { ...need, categoryName: null, productCount: 0, supplierCount: 0, serviceCount: 0 };
      }
      const [productCount, supplierCount, serviceCount] = await Promise.all([
        prisma.product.count({ where: { categoryId: category.id, hidden: false } }),
        prisma.supplier.count({ where: { categoryId: category.id, hidden: false } }),
        prisma.service.count({ where: { categoryId: category.id, hidden: false } }),
      ]);
      return { ...need, categoryName: category.name, productCount, supplierCount, serviceCount };
    }),
  );
}
