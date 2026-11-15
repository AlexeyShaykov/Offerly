import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { SignOutButton } from '@/features/auth';
import { auth } from '@/shared/lib/auth/auth';
import { QueryProvider } from '@/shared/lib/query/query-provider';

const AppLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  // Middleware already guards these routes; this is a second line of defense.
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4">
      <header className="flex items-center justify-between gap-4 py-4">
        <nav aria-label="Main" className="flex items-center gap-4">
          <span className="font-semibold">Offerly</span>
          <Link href="/vacancies" className="text-sm hover:underline">
            Vacancies
          </Link>
          <Link href="/stats" className="text-sm hover:underline">
            Stats
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <span className="truncate text-sm text-slate-600">{session.user.name}</span>
          <SignOutButton />
        </div>
      </header>
      <QueryProvider>{children}</QueryProvider>
    </div>
  );
};

export default AppLayout;
