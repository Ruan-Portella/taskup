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

  /// **O ping do cron passa antes de qualquer coisa.**
  ///
  /// Sem esta linha o keep-alive era inútil e parecia funcionar: o matcher abaixo
  /// pega tudo que não é arquivo estático, e quem não está logado cai no
  /// `Response.redirect` para `/sign-in`. O cron receberia um 307, a rota
  /// `/api/health` nunca rodaria, e **nada falaria com o Appwrite** — o projeto
  /// pausaria com o cron verde.
  ///
  /// Vem antes do `getUser()` de propósito: o ping não tem sessão e não deve
  /// gastar uma ida ao Appwrite para descobrir isso.
  if (nextUrl.pathname === '/api/health') {
    return null;
  }

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