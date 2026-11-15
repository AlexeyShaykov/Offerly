import 'server-only';

import { db } from '@/shared/lib/db';
import { createDemoData } from '@/shared/lib/demo-data';

// Opt-in: a portfolio deployment fills a new account with demo data so that nobody lands on an empty app.
export const isDemoDataOnSignupEnabled = () => process.env.DEMO_DATA_ON_SIGNUP === 'true';

export const seedDemoDataForNewUser = async (userId: string) => {
  if (!isDemoDataOnSignupEnabled()) return;

  try {
    await db.$transaction((tx) => createDemoData(tx, userId), { timeout: 20_000 });
  } catch {
    // Signing in must never fail because the demo data could not be created.
  }
};
