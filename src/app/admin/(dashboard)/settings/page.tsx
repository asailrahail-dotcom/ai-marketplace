import { changeAdminPassword } from '@/app/actions/admin';

export default function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  return (
    <div className="max-w-md">
      <h1 className="h2 mb-8">الإعدادات</h1>

      <div className="card p-6">
        <p className="font-semibold mb-4">تغيير كلمة المرور</p>

        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {searchParams.error}
          </div>
        )}
        {searchParams.success && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">
            تم تحديث كلمة المرور بنجاح.
          </div>
        )}

        <form action={changeAdminPassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">كلمة المرور الحالية</label>
            <input name="currentPassword" type="password" required className="input" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">كلمة المرور الجديدة</label>
            <input name="newPassword" type="password" required minLength={8} className="input" />
          </div>
          <button type="submit" className="btn btn-primary w-full">حفظ</button>
        </form>
      </div>
    </div>
  );
}
