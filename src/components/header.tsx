
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Menu, Phone } from "lucide-react";
import { AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


interface HeaderProps {
  onSearchActiveChange: (isActive: boolean) => void;
  onSearchSubmit: (query: string) => void;
}

export function Header({ onSearchActiveChange, onSearchSubmit }: HeaderProps) {
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [targetWidth, setTargetWidth] = useState<number | undefined>(undefined);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  const [placeholder, setPlaceholder] = useState("");
  const textsToType = ["Corporate gifts", "Family presents", "Festive gifts", "Birthday surprises", "Anniversary specials"];

  useEffect(() => {
    if (isSearchSubmitted) return;
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
  }, [isSearchSubmitted]);
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const isLargeDesktop = window.innerWidth >= 1280;
      const reductionFactor = isLargeDesktop ? 0.85 : 0.5; // 15% reduction for large desktop, 50% for others
      setTargetWidth(formRef.current.offsetWidth * reductionFactor);
    }
    const formData = new FormData(e.currentTarget);
    const searchInput = formData.get('search') as string;
    if (searchInput.trim()) {
      setIsSearchSubmitted(true);
      onSearchActiveChange(true);
      onSearchSubmit(searchInput.trim());
    }
  };

  const handleLogoClick = () => {
    setIsSearchSubmitted(false);
    onSearchActiveChange(false);
    setTargetWidth(undefined);
  }

  return (
    <>
      {isEnquireOpen && <div className="fixed inset-0 z-50 bg-black/60" />}
      <header className="fixed top-0 z-50 w-full bg-transparent pt-6">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-24">
          <div className="flex flex-1 justify-start">
            <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
              <Link href="/" className="flex items-center gap-2" onClick={handleLogoClick}>
                <Image 
                  src="/Choco Smiley Logo.png" 
                  alt="Choco Smiley Logo" 
                  width={180} 
                  height={70}
                  className="w-28 sm:w-32 md:w-36 lg:w-44"
                />
              </Link>
              <Image 
                src="/Online Chocolate Store.png" 
                alt="Online Chocolate Store" 
                width={120} 
                height={55}
                className="hidden sm:block w-20 md:w-24 lg:w-32"
              />
            </div>
          </div>
          
          <nav className={`hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-8 text-base lg:text-lg transition-opacity duration-300 ${isSearchSubmitted ? 'opacity-0' : 'opacity-100'}`}>
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
              <Popover open={isEnquireOpen} onOpenChange={setIsEnquireOpen}>
                <PopoverTrigger asChild>
                  <Button size="sm" className="relative z-[60] bg-custom-gold text-white rounded-full font-normal text-sm lg:text-base hover:bg-white hover:text-custom-gold border border-custom-gold px-3 py-1">
                    Enquire Now
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  sideOffset={8}
                  className="relative z-[60] w-auto max-w-[280px] bg-white/80 backdrop-blur-md border-white/30 text-black p-4 rounded-3xl"
                >
                  <div className="flex flex-col items-start text-left gap-1 w-full">
                    <h3 className="text-xl font-bold text-custom-purple-dark font-plex-sans">Looking for a Perfect Gift?</h3>
                    <p className="text-base text-center font-semibold font-plex-sans-condensed w-full">Get personalized advice on flavours, packaging, and more.</p>
                    <Separator className="my-2 bg-custom-purple-dark h-[1px] w-3/4 self-center" />
                    <Button asChild className="w-full h-auto py-2 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-lg font-plex-sans">
                      <a href="tel:+1234567890">
                        <Phone className="mr-2 h-4 w-4" /> Call Us
                      </a>
                    </Button>
                    <p className="text-xs font-medium self-center">-OR-</p>
                    <Button asChild className="w-full h-auto py-2 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-lg font-plex-sans">
                      <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                        <AiOutlineWhatsApp className="mr-2 h-5 w-5" /> Whatsapp Us
                      </a>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Separator orientation="vertical" className="h-6 bg-foreground/50 mx-1 lg:mx-2" />
              <div className="flex items-center gap-1 lg:gap-2">
                <Link href="#" aria-label="Instagram">
                  <AiOutlineInstagram className="h-7 w-7 lg:h-8 lg:w-8 transition-colors hover:text-custom-gold" />
                </Link>
                <Link href="#" aria-label="Facebook">
                  <IoLogoFacebook className="h-7 w-7 lg:h-8 lg:w-8 transition-colors hover:text-custom-gold" />
                </Link>
                <Link href="#" aria-label="Profile" className="ml-1 lg:ml-2">
                  <CgProfile className="h-8 w-8 lg:h-9 lg:w-9 transition-colors hover:text-custom-gold" />
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
                  <SheetHeader />
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
                  <Separator className="my-8" />
                  <div className="flex flex-col gap-4">
                    <Button asChild size="lg" className="bg-custom-gold text-white rounded-full font-normal text-base hover:bg-white hover:text-custom-gold border border-custom-gold">
                      <a href="mailto:contact@bizhome.com">Enquire Now</a>
                    </Button>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Link href="#" aria-label="Instagram">
                        <AiOutlineInstagram className="h-8 w-8 transition-colors hover:text-custom-gold" />
                      </Link>
                      <Link href="#" aria-label="Facebook">
                        <IoLogoFacebook className="h-8 w-8 transition-colors hover:text-custom-gold" />
                      </Link>
                      <Link href="#" aria-label="Profile">
                        <CgProfile className="h-9 w-9 transition-colors hover:text-custom-gold" />
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className={`container max-w-screen-2xl px-8 md:px-12 transition-all duration-500 ease-in-out ${isSearchSubmitted ? '-mt-[3.75rem]' : 'mt-8 sm:mt-12 md:mt-16'}`}>
          <form 
            ref={formRef}
            onSubmit={handleSearchSubmit} 
            className={`relative mx-auto transition-all duration-500 ease-in-out ${!targetWidth ? 'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl' : ''}`}
            style={{ maxWidth: targetWidth ? `${targetWidth}px` : undefined }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 to-white/20 backdrop-blur-sm -z-10"></div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search className={`h-5 w-5 transition-colors ${isSearchSubmitted ? 'text-white' : 'text-white'}`} />
            </div>
            <Input 
              name="search"
              autoComplete="off"
              placeholder={isSearchSubmitted ? 'Search for gifts...' : placeholder}
              className={`w-full pl-12 pr-4 py-4 rounded-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-600 text-lg md:text-xl ${isSearchSubmitted ? 'text-white' : ''}`}
            />
          </form>
        </div>
      </header>
    </>
  );
}
