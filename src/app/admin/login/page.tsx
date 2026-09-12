import { loginAdmin } from '@/app/actions/admin-auth';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold">مشروع</p>
          <p className="text-white/50 text-sm mt-1 tracking-widest">ADMIN CONSOLE</p>
        </div>

        <div className="bg-[#151516] border border-white/10 rounded-2xl p-8">
          <h1 className="text-lg font-semibold mb-6">تسجيل دخول الإدارة</h1>

          {searchParams.error && (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
              {searchParams.error}
            </div>
          )}

          <form action={loginAdmin} className="space-y-4">
            {searchParams.from && <input type="hidden" name="from" value={searchParams.from} />}
            <div>
              <label className="text-sm text-white/70 block mb-1.5">البريد الإلكتروني</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#0B0B0C] border border-white/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                placeholder="admin@mashroo.sa"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-1.5">كلمة المرور</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-[#0B0B0C] border border-white/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/40"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-[#0B0B0C] font-semibold rounded-lg py-3 text-sm hover:bg-white/90 transition-colors"
            >
              دخول
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          هذه اللوحة مخصصة لفريق إدارة منصة مشروع فقط.
        </p>
      </div>
    </div>
  );
}
