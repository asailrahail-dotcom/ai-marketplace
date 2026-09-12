import { verifyOtp } from '@/app/actions/auth';

export default function OtpPage({
  searchParams,
}: {
  searchParams: { email?: string; demoCode?: string; error?: string };
}) {
  const email = searchParams.email ?? '';

  return (
    <div className="container-content section max-w-md">
      <h1 className="h2 mb-2">تأكيد الحساب</h1>
      <p className="text-muted mb-6">
        أدخل رمز التحقق المرسل إلى <span className="font-medium text-ink">{email}</span>.
      </p>

      {searchParams.demoCode && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
          بيئة تجريبية — لا يوجد مزوّد إرسال رسائل حقيقي متصل بعد. رمز التحقق التجريبي:{' '}
          <span className="font-bold tracking-widest">{searchParams.demoCode}</span>
        </div>
      )}

      {searchParams.error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {searchParams.error}
        </div>
      )}

      <form action={verifyOtp} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <div>
          <label className="text-sm font-medium block mb-1.5">رمز التحقق</label>
          <input
            name="code"
            required
            maxLength={6}
            className="input text-center tracking-[0.5em] text-lg"
            placeholder="------"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          تأكيد
        </button>
      </form>
    </div>
  );
}
