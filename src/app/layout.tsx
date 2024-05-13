import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
import { Provider } from 'jotai';
export const metadata: Metadata = {
  title: 'ALL Bot App',
  description: 'ALL Bot App',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
  authors: [
    { name: 'EkStep Foundation' },
    {
      name: 'EkStep Foundation',
      url: 'https://in.linkedin.com/company/ekstep-foundation',
    },
  ],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/128.png' },
    { rel: 'icon', url: 'icons/128.png' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <Provider>
        <body className={`${inter.className}`}>{children}</body>
      </Provider>
    </html>
  );
}
