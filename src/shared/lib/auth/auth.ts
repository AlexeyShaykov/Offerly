import 'server-only';

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { db } from '@/shared/lib/db';

import { authConfig } from './auth.config';
import { seedDemoDataForNewUser } from './demo-data-on-signup';
import { e2eProvider, isE2eAuthEnabled } from './e2e-provider';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: isE2eAuthEnabled() ? [...authConfig.providers, e2eProvider] : authConfig.providers,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  events: {
    // Fires once, when the adapter creates the user on their first sign-in.
    createUser: async ({ user }) => {
      if (user.id) await seedDemoDataForNewUser(user.id);
    },
  },
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
