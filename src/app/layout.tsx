
'use client'; // Required for usePathname

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { GlobalHeader } from '@/components/layout/global-header';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata cannot be dynamic in a client component layout
// For simplicity in this prototype, we'll manage title via document.title if needed or accept this limitation.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBottomNav = !['/login', '/register'].includes(pathname);
  const showGlobalHeader = !['/login', '/register'].includes(pathname); // Condition for global header

  // It's generally better to export metadata from page files or a Server Component layout
  // For a client RootLayout, you might set document.title in a useEffect if needed.
  if (typeof window !== 'undefined') {
    document.title = 'ConTrad'; // Updated App Name
  }


  return (
    <html lang="en">
      <head>
        <meta name="description" content="Connecting businesses for commerce with ConTrad." /> {/* Updated App Name */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          {showGlobalHeader && <GlobalHeader />} {/* Conditionally render GlobalHeader */}
          <main className={`flex-grow ${showBottomNav ? 'pb-20' : ''} ${showGlobalHeader ? 'pt-16' : ''}`}> {/* Adjust padding top if header is shown */}
            {children}
          </main>
          {showBottomNav && <BottomNavigation />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
