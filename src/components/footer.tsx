"use client";

import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="container flex flex-col gap-4 sm:flex-row sm:justify-between items-center text-center sm:text-left">
        <Link href="/" className="flex items-center space-x-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-bold">BizHome</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © {year} BizHome. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
