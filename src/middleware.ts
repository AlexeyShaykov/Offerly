import NextAuth from 'next-auth';

import { authConfig } from '@/shared/lib/auth/auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ['/vacancies/:path*', '/stats/:path*', '/login'],
};
