import 'server-only';

import { auth } from './auth';

// Returns the current user's id or null. Every DB query must be scoped by this id.
export const getSessionUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user.id ?? null;
};
