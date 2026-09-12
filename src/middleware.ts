import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_SESSION_COOKIE = 'mashroo_admin_session';
const USER_SESSION_COOKIE = 'mashroo_session';

async function isValid(token: string | undefined, secretEnv: string) {
  if (!token) return false;
  const secret = process.env[secretEnv];
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area is fully isolated: any /admin/* route except the admin login
  // page itself requires a valid admin session. A normal user session cookie
  // never satisfies this check.
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await isValid(token, 'ADMIN_JWT_SECRET');
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // User-only account areas require a normal user session.
  const protectedUserPaths = [
    '/account',
    '/cart',
    '/checkout',
    '/orders',
    '/favorites',
    '/project-needs',
    '/add-product',
    '/add-supplier',
    '/add-service',
  ];
  if (protectedUserPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    const token = req.cookies.get(USER_SESSION_COOKIE)?.value;
    const valid = await isValid(token, 'USER_JWT_SECRET');
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/favorites/:path*',
    '/project-needs/:path*',
    '/add-product/:path*',
    '/add-supplier/:path*',
    '/add-service/:path*',
  ],
};
