'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createAdminSession, clearAdminSession, verifyAdminPassword } from '@/lib/admin-auth';

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const from = String(formData.get('from') || '/admin');

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.active || !(await verifyAdminPassword(password, admin.passwordHash))) {
    redirect(`/admin/login?error=${encodeURIComponent('بيانات الدخول غير صحيحة.')}`);
  }

  await createAdminSession(admin.id);
  redirect(from.startsWith('/admin') ? from : '/admin');
}

export async function logoutAdmin() {
  clearAdminSession();
  redirect('/admin/login');
}
