'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentAdmin, hashAdminPassword, verifyAdminPassword } from '@/lib/admin-auth';

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

// ---------- Products ----------

export async function toggleProductHidden(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({ where: { id }, data: { hidden: !product.hidden } });
  revalidatePath('/admin/products');
}

export async function toggleProductVerified(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({ where: { id }, data: { verified: !product.verified } });
  revalidatePath('/admin/products');
}

export async function deleteProductAdmin(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  await prisma.favorite.deleteMany({ where: { productId: id } });
  await prisma.cartItem.deleteMany({ where: { productId: id } });
  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
}

// ---------- Suppliers ----------

export async function toggleSupplierHidden(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const s = await prisma.supplier.findUnique({ where: { id } });
  if (!s) return;
  await prisma.supplier.update({ where: { id }, data: { hidden: !s.hidden } });
  revalidatePath('/admin/suppliers');
}

export async function toggleSupplierVerified(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const s = await prisma.supplier.findUnique({ where: { id } });
  if (!s) return;
  await prisma.supplier.update({ where: { id }, data: { verified: !s.verified } });
  revalidatePath('/admin/suppliers');
}

export async function updateSupplierSpecialty(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const specialty = String(formData.get('specialty') || '').trim();
  if (!specialty) return;
  await prisma.supplier.update({ where: { id }, data: { specialty } });
  revalidatePath('/admin/suppliers');
}

// ---------- Services ----------

export async function toggleServiceHidden(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) return;
  await prisma.service.update({ where: { id }, data: { hidden: !s.hidden } });
  revalidatePath('/admin/services');
}

export async function toggleServiceVerified(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) return;
  await prisma.service.update({ where: { id }, data: { verified: !s.verified } });
  revalidatePath('/admin/services');
}

export async function deleteServiceAdmin(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  await prisma.favorite.deleteMany({ where: { serviceId: id } });
  await prisma.review.deleteMany({ where: { serviceId: id } });
  await prisma.service.delete({ where: { id } });
  revalidatePath('/admin/services');
}

// ---------- Orders ----------

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/admin/orders');
}

// ---------- Users ----------

export async function toggleUserVerified(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;
  await prisma.user.update({ where: { id }, data: { verified: !user.verified } });
  revalidatePath('/admin/users');
}

// ---------- Categories ----------

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  const nameEn = String(formData.get('nameEn') || '').trim() || null;
  const slug = String(formData.get('slug') || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  const keywords = String(formData.get('keywords') || '').trim() || null;
  if (!name || !slug) return;

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });
  await prisma.category.create({
    data: { name, nameEn, slug, keywords, order: (maxOrder._max.order ?? 0) + 1 },
  });
  revalidatePath('/admin/categories');
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const name = String(formData.get('name') || '').trim();
  const nameEn = String(formData.get('nameEn') || '').trim() || null;
  const keywords = String(formData.get('keywords') || '').trim() || null;
  if (!name) return;
  await prisma.category.update({ where: { id }, data: { name, nameEn, keywords } });
  revalidatePath('/admin/categories');
}

export async function toggleCategoryHidden(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const c = await prisma.category.findUnique({ where: { id } });
  if (!c) return;
  await prisma.category.update({ where: { id }, data: { hidden: !c.hidden } });
  revalidatePath('/admin/categories');
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  // Detach listings first so the FK on their optional categoryId never blocks
  // the delete — they simply become uncategorized rather than being removed.
  await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.supplier.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.service.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.category.updateMany({ where: { parentId: id }, data: { parentId: null } });
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}

export async function reorderCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const direction = String(formData.get('direction')); // 'up' | 'down'

  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
  const index = categories.findIndex((c) => c.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= categories.length) return;

  const a = categories[index];
  const b = categories[swapIndex];
  await prisma.$transaction([
    prisma.category.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.category.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath('/admin/categories');
}

// ---------- Content ----------

export async function updateHomepageContent(formData: FormData) {
  await requireAdmin();
  const value = {
    heroTitle: String(formData.get('heroTitle') || ''),
    heroSubtitle: String(formData.get('heroSubtitle') || ''),
    discoverTitle: String(formData.get('discoverTitle') || ''),
    discoverSubtitle: String(formData.get('discoverSubtitle') || ''),
  };
  await prisma.siteContent.upsert({
    where: { key: 'homepage' },
    update: { value: JSON.stringify(value) },
    create: { key: 'homepage', value: JSON.stringify(value) },
  });
  revalidatePath('/');
  revalidatePath('/admin/content');
}

// ---------- Settings ----------

export async function changeAdminPassword(formData: FormData) {
  const admin = await requireAdmin();
  const current = String(formData.get('currentPassword') || '');
  const next = String(formData.get('newPassword') || '');

  const fresh = await prisma.adminUser.findUnique({ where: { id: admin.id } });
  if (!fresh || !(await verifyAdminPassword(current, fresh.passwordHash))) {
    redirect(`/admin/settings?error=${encodeURIComponent('كلمة المرور الحالية غير صحيحة.')}`);
  }
  if (next.length < 8) {
    redirect(`/admin/settings?error=${encodeURIComponent('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.')}`);
  }

  await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash: await hashAdminPassword(next) } });
  redirect('/admin/settings?success=1');
}
