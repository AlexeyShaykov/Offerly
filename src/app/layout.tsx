import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'Offerly',
  description: 'Job application tracker',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body className="min-h-screen bg-white text-slate-900 antialiased">{children}</body>
  </html>
);

export default RootLayout;
