import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { firstImage } from '@/lib/images';
import { EmptyState } from '@/components/ui/EmptyState';
import { CartQuantityControl } from '@/components/cart/CartQuantityControl';

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  const available = items.filter((i) => !i.product.hidden);
  const total = available.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="container-content section">
      <h1 className="h2 mb-8">سلة المشتريات</h1>

      {available.length === 0 ? (
        <EmptyState
          title="سلتك فارغة"
          description="أضف منتجات من السوق لتظهر هنا."
          action={
            <Link href="/products" className="btn btn-primary">
              تصفح المنتجات
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <ul className="md:col-span-2 space-y-4">
            {available.map((item) => (
              <li key={item.id} className="card p-4 flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-sand shrink-0">
                  <Image
                    src={firstImage(item.product.images, item.product.name, item.product.id)}
                    alt={item.product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline block truncate">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted">{item.product.price.toLocaleString('ar-SA')} ر.س</p>
                </div>
                <CartQuantityControl cartItemId={item.id} quantity={item.quantity} />
              </li>
            ))}
          </ul>

          <div className="card p-6 h-fit">
            <div className="flex justify-between mb-4">
              <span className="text-muted">الإجمالي</span>
              <span className="font-bold text-lg">{total.toLocaleString('ar-SA')} ر.س</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full">
              إتمام الشراء
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
