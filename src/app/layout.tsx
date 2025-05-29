
'use client'; // Required for usePathname

// import type { Metadata } from 'next'; // Metadata type export not used in client component
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

// For a client RootLayout, metadata should ideally be handled by child server components or pages.
// Static metadata export is not effective here.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBottomNav = !['/login', '/register'].includes(pathname);
  const showGlobalHeader = !['/login', '/register'].includes(pathname);

  // Client-side title update as a fallback for client component layout
  if (typeof window !== 'undefined') {
    document.title = 'ConTrad';
  }

  return (
    <html lang="en">
      <head><meta name="description" content="Connecting businesses for commerce with ConTrad." />{/* Updated App Name */}</head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          {showGlobalHeader && <GlobalHeader />}
          <main className={`flex-grow ${showBottomNav ? 'pb-20' : ''} ${showGlobalHeader ? 'pt-16' : ''}`}>
            {children}
          </main>
          {showBottomNav && <BottomNavigation />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
