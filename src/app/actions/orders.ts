'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `MSH-${stamp}-${rand}`;
}

export async function placeOrder(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const fullName = String(formData.get('fullName') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const details = String(formData.get('details') || '').trim();

  if (!fullName || !phone || !city || !details) {
    redirect(`/checkout?error=${encodeURIComponent('يرجى تعبئة جميع بيانات عنوان التوصيل.')}`);
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  const available = cartItems.filter((i) => !i.product.hidden);
  if (available.length === 0) {
    redirect('/cart');
  }

  const address = await prisma.address.create({
    data: { userId: user.id, fullName, phone, city, details },
  });

  const total = available.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      buyerId: user.id,
      addressId: address.id,
      total,
      items: {
        create: available.map((i) => ({
          productId: i.productId,
          sellerId: i.product.sellerId,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId: user.id } });

  redirect(`/orders/${order.id}?placed=1`);
}
