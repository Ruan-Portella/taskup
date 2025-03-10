import { type NextRequest } from 'next/server'
import { getUser } from './features/auth/api/get-user';
const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/authenticator'
]

let nextJoinUrl = ''

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth') || nextUrl.pathname.startsWith('/oauth');
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }
  const isLoggedIn = await getUser()

  if (nextUrl.pathname.includes('/join') && !isLoggedIn) {
    nextJoinUrl = nextUrl.pathname
    return Response.redirect(new URL('/sign-in', nextUrl));
  }

  if (isLoggedIn) {
    if (nextJoinUrl) {
      const nextUrlJoin = new URL(nextJoinUrl, nextUrl)
      nextJoinUrl = '';
      return Response.redirect(nextUrlJoin)
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/', nextUrl));
    }
    return null;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL('/sign-in', nextUrl));
  }

  return null;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}