"use client";

import Link from "next/link";
import { Menu, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-bold">BizHome</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6" onClick={() => setSheetOpen(false)}>
                  <Mountain className="h-6 w-6 text-primary" />
                  <span className="font-bold">BizHome</span>
                </Link>
                <nav className="grid gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                      onClick={() => setSheetOpen(false)}
                    >
                      <span>{link.label}</span>
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <Button asChild className="hidden md:flex">
            <a href="#contact">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
