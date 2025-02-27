import Navigation from '@/components/Navigation';
import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import '@radix-ui/themes/styles.css';

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
      </body>
    </html>
  );
}
