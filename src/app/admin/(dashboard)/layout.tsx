import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already blocks unauthenticated requests to
  // /admin/*, this re-checks at render time in case middleware config ever
  // drifts from route additions.
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-sand flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar adminName={admin.name} />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
