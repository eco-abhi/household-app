import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('household-auth');
  const isAuthenticated = authCookie && authCookie.value === process.env.AUTH_SECRET;

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to login page, auth API routes, and static files
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/icon.svg') ||
    request.nextUrl.pathname.startsWith('/manifest.json')
  ) {
    return NextResponse.next();
  }

  // Check if authenticated for protected routes
  if (!isAuthenticated) {
    // For API routes, return JSON error instead of redirecting to HTML page
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // For page routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

