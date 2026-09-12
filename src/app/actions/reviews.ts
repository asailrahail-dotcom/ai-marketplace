'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function createReview(formData: FormData) {
  const user = await getCurrentUser();
  const redirectPath = String(formData.get('redirectPath') || '/');
  if (!user) redirect('/login');

  const rating = Number(formData.get('rating'));
  const comment = String(formData.get('comment') || '').trim() || null;
  const productId = (formData.get('productId') as string) || undefined;
  const supplierId = (formData.get('supplierId') as string) || undefined;
  const serviceId = (formData.get('serviceId') as string) || undefined;

  if (!rating || rating < 1 || rating > 5) {
    redirect(`${redirectPath}?error=${encodeURIComponent('يرجى اختيار تقييم صحيح.')}`);
  }

  await prisma.review.create({
    data: { rating, comment, authorId: user.id, productId, supplierId, serviceId },
  });

  revalidatePath(redirectPath);
  redirect(redirectPath);
}
