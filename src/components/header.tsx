
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Menu } from "lucide-react";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const textsToType = ["Corporate gifts", "Family presents", "Festive gifts"];

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentText = textsToType[textIndex];
      const displayedText = isDeleting
        ? currentText.substring(0, charIndex - 1)
        : currentText.substring(0, charIndex + 1);

      setPlaceholder(displayedText);

      if (!isDeleting && displayedText === currentText) {
        isDeleting = true;
        timeoutId = setTimeout(type, 2000); 
      } else if (isDeleting && displayedText === "") {
        isDeleting = false;
        charIndex = 0;
        textIndex = (textIndex + 1) % textsToType.length;
        timeoutId = setTimeout(type, 500);
      } else {
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
        timeoutId = setTimeout(type, isDeleting ? 100 : 150);
      }
    };

    timeoutId = setTimeout(type, 200);

    return () => clearTimeout(timeoutId);
  }, []);

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
                className="w-32 md:w-44"
              />
            </Link>
            <Image 
              src="/Online Chocolate Store.png" 
              alt="Online Chocolate Store" 
              width={120} 
              height={55}
              className="hidden sm:block w-24 md:w-32"
            />
          </div>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-custom-gold text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 justify-end">
          <div className="hidden md:flex items-center gap-1">
            <Button asChild size="sm" className="bg-white text-custom-gold rounded-full font-normal text-base hover:bg-transparent border border-white px-3 py-1">
              <a href="mailto:contact@bizhome.com">Enquire Now</a>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-foreground/50 mx-2" />
            <div className="flex items-center gap-2">
              <Link href="#" aria-label="Instagram">
                <AiOutlineInstagram className="h-8 w-8 transition-colors hover:text-custom-gold" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <IoLogoFacebook className="h-8 w-8 transition-colors hover:text-custom-gold" />
              </Link>
              <Link href="#" aria-label="Profile" className="ml-2">
                <CgProfile className="h-9 w-9 transition-colors hover:text-custom-gold" />
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-8 text-lg mt-12">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-custom-gold text-foreground/80"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="container max-w-screen-2xl px-8 md:px-12 mt-16">
        <div className="relative max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 to-white/20 backdrop-blur-sm -z-10"></div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-white' : 'text-gray-600'}`} />
          </div>
          <Input 
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-6 rounded-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xl text-xl"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>
    </header>
  );
}
