'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function addToCart(productId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: 'يجب تسجيل الدخول لإضافة منتج إلى السلة.' };
  }
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.hidden) {
    return { ok: false, error: 'هذا المنتج غير متاح حاليًا.' };
  }

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { quantity: { increment: 1 } },
    create: { userId: user.id, productId, quantity: 1 },
  });

  revalidatePath('/cart');
  return { ok: true };
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'غير مصرح.' };

  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.userId !== user.id) return { ok: false, error: 'غير موجود.' };

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
  }
  revalidatePath('/cart');
  return { ok: true };
}

export async function removeCartItem(cartItemId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'غير مصرح.' };
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.userId !== user.id) return { ok: false, error: 'غير موجود.' };
  await prisma.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath('/cart');
  return { ok: true };
}
