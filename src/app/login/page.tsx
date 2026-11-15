import { SignInButton } from '@/features/auth';

type LoginPageProps = { searchParams: Promise<{ callbackUrl?: string }> };

const DEFAULT_REDIRECT = '/vacancies';

// Only same-origin relative paths are allowed to avoid open redirects.
const getSafeRedirect = (callbackUrl: string | undefined) =>
  callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : DEFAULT_REDIRECT;

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { callbackUrl } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Sign in to Offerly</h1>
      <SignInButton redirectTo={getSafeRedirect(callbackUrl)} />
    </main>
  );
};

export default LoginPage;
