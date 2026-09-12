import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="container-content section max-w-md">
      <h1 className="h2 mb-2">إنشاء حساب</h1>
      <p className="text-muted mb-8">انضم إلى مشروع وابدأ في اكتشاف كل ما يحتاجه مشروعك.</p>

      {searchParams.error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {searchParams.error}
        </div>
      )}

      <form action={registerUser} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">الاسم الكامل</label>
          <input name="name" required className="input" placeholder="اسمك" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">البريد الإلكتروني</label>
          <input name="email" type="email" required className="input" placeholder="name@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">رقم الجوال (اختياري)</label>
          <input name="phone" className="input" placeholder="05XXXXXXXX" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">كلمة المرور</label>
          <input name="password" type="password" required minLength={6} className="input" placeholder="6 أحرف على الأقل" />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          إنشاء الحساب
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        لديك حساب بالفعل؟{' '}
        <Link href="/login" className="text-ink font-medium hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
