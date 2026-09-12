import 'server-only';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

const SESSION_COOKIE = 'mashroo_session';

function userSecret() {
  const secret = process.env.USER_JWT_SECRET;
  if (!secret) throw new Error('USER_JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createUserSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(userSecret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearUserSession() {
  cookies().set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, userSecret());
    const uid = payload.uid as string;
    if (!uid) return null;
    return prisma.user.findUnique({ where: { id: uid } });
  } catch {
    return null;
  }
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
