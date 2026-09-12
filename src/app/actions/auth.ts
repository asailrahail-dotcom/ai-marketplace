'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import {
  createUserSession,
  clearUserSession,
  hashPassword,
  verifyPassword,
  generateOtp,
} from '@/lib/auth';

export async function registerUser(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = String(formData.get('phone') || '').trim() || null;
  const password = String(formData.get('password') || '');

  if (!name || !email || password.length < 6) {
    redirect(`/register?error=${encodeURIComponent('يرجى تعبئة جميع الحقول (كلمة المرور 6 أحرف على الأقل).')}`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(`/register?error=${encodeURIComponent('يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.')}`);
  }

  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash: await hashPassword(password) },
  });

  const code = generateOtp();
  await prisma.otpCode.create({
    data: {
      userId: user.id,
      target: email,
      code,
      purpose: 'REGISTER',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // No real SMS/email provider is configured in this environment, so the
  // demo code is returned to the caller instead of being silently "sent".
  redirect(`/otp?email=${encodeURIComponent(email)}&demoCode=${code}`);
}

export async function verifyOtp(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const code = String(formData.get('code') || '').trim();

  const otp = await prisma.otpCode.findFirst({
    where: { target: email, code, purpose: 'REGISTER', consumed: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp || otp.expiresAt < new Date()) {
    redirect(
      `/otp?email=${encodeURIComponent(email)}&error=${encodeURIComponent('رمز التحقق غير صحيح أو منتهي الصلاحية.')}`,
    );
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
  const user = await prisma.user.update({
    where: { email },
    data: { verified: true },
  });

  await createUserSession(user.id);
  redirect('/');
}

export async function loginUser(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect(`/login?error=${encodeURIComponent('البريد الإلكتروني أو كلمة المرور غير صحيحة.')}`);
  }

  await createUserSession(user.id);
  redirect('/');
}

export async function logoutUser() {
  clearUserSession();
  redirect('/');
}
