"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IoLogoFacebook } from "react-icons/io";
import { AiOutlineInstagram } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

export function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

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
            <Button asChild size="default" className="bg-white text-custom-gold rounded-full font-normal text-base hover:bg-white/90 px-4 py-2">
              <a href="mailto:contact@bizhome.com">Enquire Now</a>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-foreground/50" />
            <div className="flex items-center gap-4">
              <Link href="#" aria-label="Instagram">
                <AiOutlineInstagram className="h-8 w-8 transition-colors hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <IoLogoFacebook className="h-8 w-8 transition-colors hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Profile">
                <CgProfile className="h-8 w-8 transition-colors hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
