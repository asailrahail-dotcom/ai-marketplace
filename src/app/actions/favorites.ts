'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function toggleFavorite(
  target: { productId?: string; supplierId?: string; serviceId?: string },
  redirectPath: string,
) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'يجب تسجيل الدخول لحفظ العناصر المفضلة.' };

  const existing = await prisma.favorite.findFirst({ where: { userId: user.id, ...target } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, ...target } });
  }
  revalidatePath(redirectPath);
  revalidatePath('/favorites');
  return { ok: true, favorited: !existing };
}
