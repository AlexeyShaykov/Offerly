import { signIn } from '@/shared/lib/auth/auth';

type SignInButtonProps = { redirectTo: string };

export const SignInButton = ({ redirectTo }: SignInButtonProps) => {
  const signInWithGitHub = async () => {
    'use server';
    await signIn('github', { redirectTo });
  };

  return (
    <form action={signInWithGitHub}>
      <button
        type="submit"
        className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Sign in with GitHub
      </button>
    </form>
  );
};
