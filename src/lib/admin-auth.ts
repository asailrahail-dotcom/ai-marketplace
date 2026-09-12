import 'server-only';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// Isolated from end-user auth on purpose: separate cookie name, separate
// signing secret, separate table (AdminUser). A user session token can never
// be used to satisfy an admin check, and vice versa.
const ADMIN_SESSION_COOKIE = 'mashroo_admin_session';

function adminSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function hashAdminPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyAdminPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ aid: adminId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(adminSecret());

  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export function clearAdminSession() {
  cookies().set(ADMIN_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getCurrentAdmin() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, adminSecret());
    const aid = payload.aid as string;
    if (!aid) return null;
    const admin = await prisma.adminUser.findUnique({ where: { id: aid } });
    if (!admin || !admin.active) return null;
    return admin;
  } catch {
    return null;
  }
}

export { ADMIN_SESSION_COOKIE };
