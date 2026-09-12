import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { EmptyState } from '@/components/ui/EmptyState';
import { placeOrder } from '@/app/actions/orders';

export default async function CheckoutPage({ searchParams }: { searchParams: { error?: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  const available = items.filter((i) => !i.product.hidden);
  const total = available.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (available.length === 0) {
    return (
      <div className="container-content section">
        <EmptyState
          title="سلتك فارغة"
          description="أضف منتجات قبل إتمام الشراء."
          action={
            <Link href="/products" className="btn btn-primary">
              تصفح المنتجات
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-content section grid md:grid-cols-3 gap-8 max-w-4xl">
      <div className="md:col-span-2">
        <h1 className="h2 mb-6">إتمام الشراء</h1>

        {searchParams.error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {searchParams.error}
          </div>
        )}

        <form action={placeOrder} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">الاسم الكامل</label>
            <input name="fullName" required className="input" defaultValue={user.name} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">رقم الجوال</label>
            <input name="phone" required className="input" defaultValue={user.phone ?? ''} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">المدينة</label>
            <input name="city" required className="input" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">تفاصيل العنوان</label>
            <textarea name="details" required rows={3} className="input" />
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
            لا يوجد مزوّد دفع إلكتروني متصل بعد. سيتم إنشاء طلبك وتظهر حالة الدفع كـ"قيد الانتظار" حتى تأكيدها يدويًا.
          </div>

          <button type="submit" className="btn btn-primary w-full">
            تأكيد الطلب
          </button>
        </form>
      </div>

      <div className="card p-6 h-fit">
        <p className="font-semibold mb-4">ملخص الطلب</p>
        <ul className="space-y-2 mb-4">
          {available.map((i) => (
            <li key={i.id} className="flex justify-between text-sm">
              <span className="truncate ml-2">{i.product.name} × {i.quantity}</span>
              <span className="shrink-0">{(i.product.price * i.quantity).toLocaleString('ar-SA')} ر.س</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-4 font-bold">
          <span>الإجمالي</span>
          <span>{total.toLocaleString('ar-SA')} ر.س</span>
        </div>
      </div>
    </div>
  );
}
