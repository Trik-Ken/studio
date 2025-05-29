
'use client'; // Required for usePathname

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation'; // Import usePathname

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// export const metadata: Metadata = { // Metadata cannot be dynamic in a client component layout
//   title: 'B2B Commerce Connect',
//   description: 'Connecting businesses for commerce.',
// };

// If RootLayout is client component, metadata should be exported from page.tsx or a server component layout
// For simplicity in this prototype, we'll manage title via document.title if needed or accept this limitation.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBottomNav = !['/login', '/register'].includes(pathname);

  // It's generally better to export metadata from page files or a Server Component layout
  // For a client RootLayout, you might set document.title in a useEffect if needed.
  if (typeof window !== 'undefined') {
    document.title = 'B2B Commerce Connect';
  }


  return (
    <html lang="en">
      <head>
        {/* For metadata in client component layouts, manage through specific pages or a wrapper server component.
            For this prototype, basic meta tags can be here or we rely on page-specific metadata.
            The title and description from original metadata export will be used if this remains server component,
            but usePathname makes it a client component.
         */}
        <meta name="description" content="Connecting businesses for commerce." />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <main className={`flex-grow ${showBottomNav ? 'pb-20' : ''}`}> {/* Padding bottom conditional */}
            {children}
          </main>
          {showBottomNav && <BottomNavigation />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
