import 'server-only';

import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { db } from '@/shared/lib/db';

// Test-only sign-in for Playwright, where GitHub OAuth cannot be used.
// It exists only when E2E_TEST_MODE is set AND the app is not a production build.
export const isE2eAuthEnabled = () =>
  process.env.E2E_TEST_MODE === 'true' && process.env.NODE_ENV !== 'production';

const credentialsSchema = z.object({ email: z.email() });

export const e2eProvider = Credentials({
  id: 'e2e',
  name: 'E2E test user',
  credentials: { email: { label: 'Email', type: 'email' } },
  authorize: async (credentials) => {
    const parsed = credentialsSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email } = parsed.data;
    return db.user.upsert({ where: { email }, update: {}, create: { email, name: 'E2E User' } });
  },
});
