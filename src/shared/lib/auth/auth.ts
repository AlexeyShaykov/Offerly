import 'server-only';

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { db } from '@/shared/lib/db';

import { authConfig } from './auth.config';
import { e2eProvider, isE2eAuthEnabled } from './e2e-provider';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: isE2eAuthEnabled() ? [...authConfig.providers, e2eProvider] : authConfig.providers,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
