import Link from 'next/link';

const linkClass =
  'rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900';

// Static page: it does not read the session. /login sends signed-in users straight to the app.
const MarketingPage = () => (
  <div className="mx-auto min-h-screen max-w-3xl px-4">
    <header className="flex items-center justify-between py-4">
      <span className="font-semibold">Offerly</span>
      <Link href="/login" className={`${linkClass} border border-slate-300 hover:bg-slate-100`}>
        Sign in
      </Link>
    </header>
    <main className="flex flex-col items-start gap-6 py-20">
      <h1 className="text-4xl font-semibold">Keep your job search under control</h1>
      <p className="max-w-xl text-lg text-slate-600">
        Save vacancies, move each one through the hiring funnel and see where your applications
        stand.
      </p>
      <Link href="/login" className={`${linkClass} bg-slate-900 text-white hover:bg-slate-700`}>
        Get started
      </Link>
    </main>
  </div>
);

export default MarketingPage;
