'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { extractProjectNeeds } from '@/lib/ai/needs-extractor';

export async function saveProjectNeeds(formData: FormData) {
  const user = await getCurrentUser();
  const rawInput = String(formData.get('rawInput') || '');
  if (!user) {
    redirect(`/login?from=${encodeURIComponent(`/ai?q=${encodeURIComponent(rawInput)}`)}`);
  }
  if (!rawInput.trim()) redirect('/ai');

  const { projectType, projectStage, needs } = extractProjectNeeds(rawInput);

  await prisma.projectNeed.create({
    data: {
      userId: user.id,
      rawInput,
      projectType,
      projectStage,
      items: {
        create: needs.map((n) => ({ label: n.label, categorySlug: n.categorySlug })),
      },
    },
  });

  redirect('/project-needs');
}

export async function toggleProjectNeedItem(itemId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'غير مصرح.' };

  const item = await prisma.projectNeedItem.findUnique({
    where: { id: itemId },
    include: { projectNeed: true },
  });
  if (!item || item.projectNeed.userId !== user.id) return { ok: false, error: 'غير موجود.' };

  await prisma.projectNeedItem.update({ where: { id: itemId }, data: { done: !item.done } });
  revalidatePath('/project-needs');
  return { ok: true };
}

export async function deleteProjectNeed(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  const need = await prisma.projectNeed.findUnique({ where: { id } });
  if (!need || need.userId !== user.id) return;

  await prisma.projectNeedItem.deleteMany({ where: { projectNeedId: id } });
  await prisma.projectNeed.delete({ where: { id } });
  revalidatePath('/project-needs');
}
