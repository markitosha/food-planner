import Navigation from '@/components/navigation';
import { stackServerApp } from '@/stack';
import { Theme } from '@radix-ui/themes';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@radix-ui/themes/styles.css';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Food Planner',
  description: 'Easy app to plan your meals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Theme
              accentColor={'jade'}
              grayColor={'slate'}
              radius={'large'}
              panelBackground={'translucent'}
            >
              <Navigation />
              {children}
            </Theme>
            <SpeedInsights />
            <Analytics />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
