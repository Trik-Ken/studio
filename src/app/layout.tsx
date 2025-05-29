import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'B2B Commerce Connect',
  description: 'Connecting businesses for commerce.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow pb-20"> {/* Padding bottom for BottomNavigation */}
            {children}
          </main>
          <BottomNavigation />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
