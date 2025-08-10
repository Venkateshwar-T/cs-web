"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent pt-6">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-8 md:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/Choco Smiley Logo.png" 
              alt="Choco Smiley Logo" 
              width={200} 
              height={80}
            />
          </Link>
          <Image 
            src="/Online Chocolate Store.png" 
            alt="Online Chocolate Store" 
            width={130} 
            height={65}
          />
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-lg">
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
        
        <div className="flex items-center gap-4">
          <Button>Enquire Now</Button>
          <Separator orientation="vertical" className="h-6 bg-foreground/50" />
          <div className="flex items-center gap-3">
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-6 w-6 transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-6 w-6 transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Profile">
              <User className="h-6 w-6 transition-colors hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
