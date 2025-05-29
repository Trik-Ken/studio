
'use client';

import Link from 'next/link';

export function GlobalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto h-16 flex items-center justify-center sm:justify-start">
        <Link href="/" className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
          ConTrad
        </Link>
      </div>
    </header>
  );
}
