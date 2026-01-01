// middleware/authMiddleware.ts
import { verifyToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server';

export async function authmiddleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value || req.headers.get('authorization')?.split(' ')[1]; 
  if (!token) {
    // For API routes, return JSON error
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }
    // For pages, redirect to login
    return NextResponse.redirect(new URL('/', req.url));
  }
  const decoded = await verifyToken(token);
  if (!decoded) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  // if url with /dashboard/bar/manager/
  if ((req.nextUrl.pathname.startsWith('/dashboard/bar/partner') && decoded.role !== 'PARTNER_ADMIN')) {
    return NextResponse.redirect(new URL('/', req.url));
  }


    // if url with /dashboard/bar/manager/
  if ((req.nextUrl.pathname.startsWith('/dashboard/bar/manager') && decoded.role !== 'MANAGER')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

   // if url with /dashboard/bar/workers/
  if ((req.nextUrl.pathname.startsWith('/dashboard/bar/waiters') && decoded.role !== 'WAITER') ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

    // if url with /bar-restaurant
  if ((req.nextUrl.pathname.startsWith('/bar-restaurant/') && decoded.role !== 'MANAGER') || (req.nextUrl.pathname.startsWith('/bar-restaurant/') && decoded.role !== 'WAITER') || (req.nextUrl.pathname.startsWith('/bar-restaurant/') && decoded.role !== 'PARTNER_ADMIN') || (req.nextUrl.pathname.startsWith('/bar-restaurant/') && decoded.role !== 'CHEF') || (req.nextUrl.pathname.startsWith('/bar-restaurant/') && decoded.role !== 'KITCHEN')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

    // if url with /admin/ and user is not admin
  if ((req.nextUrl.pathname.startsWith('/supermarket/') && decoded.role !== 'MANAGER') || (req.nextUrl.pathname.startsWith('/supermarket/') && decoded.role !== 'WAITER') || (req.nextUrl.pathname.startsWith('/supermarket/') && decoded.role !== 'PARTNER_ADMIN')) {
    return NextResponse.redirect(new URL('/', req.url));
  }


  // Add user info to request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', decoded.id.toString());
  requestHeaders.set('x-user-role', decoded.role || '');
  requestHeaders.set('x-partner-id', decoded.partnerId || '');
  
  requestHeaders.set('x-ebmToken-id', 'HcwWRxDv-i09o6TX.Bvx6BuSLsE_e0F-rWM6OU7_NkH1pyhb8SAygdDILkxnAlxfl0WS-LlsFDG1Nuo0sbpMMHczWNfz4Ag2juJFUK-kNpn956WivB5OOManPwyk.cJt9RgDhxuwEWLFvvCXQ_w');
  // Continue with the request
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}