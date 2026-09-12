import { prisma } from '@/lib/db';

export async function ratingFor(target: { productId?: string; supplierId?: string; serviceId?: string }) {
  const agg = await prisma.review.aggregate({
    where: target,
    _avg: { rating: true },
    _count: { rating: true },
  });
  return { avg: agg._avg.rating ?? 0, count: agg._count.rating };
}
