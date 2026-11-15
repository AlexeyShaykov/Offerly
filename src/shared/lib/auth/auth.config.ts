import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';

// Edge-safe config: no Prisma and no Node-only imports, it is also used by middleware.
const PROTECTED_PREFIXES = ['/vacancies', '/stats'];

const isProtectedPath = (pathname: string) =>
  PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const authConfig = {
  providers: [GitHub],
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);

      if (isProtectedPath(nextUrl.pathname)) {
        return isLoggedIn;
      }

      if (nextUrl.pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/vacancies', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
