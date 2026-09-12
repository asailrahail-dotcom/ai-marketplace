'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function createProduct(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const price = Number(formData.get('price'));
  const condition = String(formData.get('condition') || 'NEW');
  const categorySlug = String(formData.get('categorySlug') || '') || undefined;
  const imageUrl = String(formData.get('imageUrl') || '').trim();

  if (!name || !description || !price || price <= 0) {
    redirect(`/add-product?error=${encodeURIComponent('يرجى تعبئة جميع الحقول المطلوبة.')}`);
  }

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      condition,
      images: JSON.stringify(imageUrl ? [imageUrl] : []),
      categoryId: category?.id,
      sellerId: user.id,
    },
  });

  redirect(`/products/${product.id}`);
}

export async function createSupplier(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get('name') || '').trim();
  const specialty = String(formData.get('specialty') || '').trim();
  const description = String(formData.get('description') || '').trim() || null;
  const city = String(formData.get('city') || '').trim() || null;
  const categorySlug = String(formData.get('categorySlug') || '') || undefined;
  const logo = String(formData.get('logo') || '').trim() || null;

  if (!name || !specialty) {
    redirect(`/add-supplier?error=${encodeURIComponent('يرجى تعبئة جميع الحقول المطلوبة.')}`);
  }

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const supplier = await prisma.supplier.create({
    data: { name, specialty, description, city, logo, categoryId: category?.id, ownerId: user.id },
  });

  redirect(`/suppliers/${supplier.id}`);
}

export async function createService(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get('name') || '').trim();
  const type = String(formData.get('type') || '').trim();
  const description = String(formData.get('description') || '').trim() || null;
  const areas = String(formData.get('areas') || '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);
  const categorySlug = String(formData.get('categorySlug') || '') || undefined;
  const image = String(formData.get('image') || '').trim() || null;

  if (!name || !type) {
    redirect(`/add-service?error=${encodeURIComponent('يرجى تعبئة جميع الحقول المطلوبة.')}`);
  }

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const service = await prisma.service.create({
    data: { name, type, description, areas: JSON.stringify(areas), image, categoryId: category?.id, providerId: user.id },
  });

  redirect(`/services/${service.id}`);
}
