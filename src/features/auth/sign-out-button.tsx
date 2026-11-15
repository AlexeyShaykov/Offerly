import { signOut } from '@/shared/lib/auth/auth';

const signOutAction = async () => {
  'use server';
  await signOut({ redirectTo: '/' });
};

export const SignOutButton = () => (
  <form action={signOutAction}>
    <button
      type="submit"
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      Sign out
    </button>
  </form>
);
