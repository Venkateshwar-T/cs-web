"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  const FacebookIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors hover:opacity-80"
    >
      <rect width="24" height="24" rx="4" fill="white" />
      <path
        d="M15.12 12.8214H13.2V20H9.84V12.8214H8V10.0357H9.84V8.19643C9.84 6.65357 10.644 5 13.008 5H15.12V7.78571H13.728C13.248 7.78571 13.2 7.96429 13.2 8.44286V10.0357H15.228L15.12 12.8214Z"
        fill="hsl(var(--background))"
      />
    </svg>
  );

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent pt-6">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-8 md:px-12">
        <div className="flex flex-1 justify-start">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/Choco Smiley Logo.png" 
                alt="Choco Smiley Logo" 
                width={180} 
                height={70}
              />
            </Link>
            <Image 
              src="/Online Chocolate Store.png" 
              alt="Online Chocolate Store" 
              width={120} 
              height={55}
            />
          </div>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-4">
            <Button>Enquire Now</Button>
            <Separator orientation="vertical" className="h-6 bg-foreground/50" />
            <div className="flex items-center gap-3">
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 transition-colors hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <FacebookIcon />
              </Link>
              <Link href="#" aria-label="Profile">
                <User className="h-6 w-6 transition-colors hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
