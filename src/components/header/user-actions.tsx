
// @/components/header/user-actions.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Phone } from "lucide-react";
import { AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io5";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ActiveView } from "@/app/page";


interface UserActionsProps {
    isEnquireOpen: boolean;
    onEnquireOpenChange: (isOpen: boolean) => void;
    onProfileOpenChange: (isOpen: boolean) => void;
    onNavigate: (view: 'about' | 'faq') => void;
    activeView: ActiveView;
    onAnimatedSearchToggle: () => void;
    isAnimatedSearchExpanded: boolean;
    isSearchingOnAbout: boolean;
}

const navLinks = [
    { id: "about", label: "About" },
    { id: "faq", label: "FAQ" },
] as const;

export function UserActions({ 
    isEnquireOpen, 
    onEnquireOpenChange, 
    onProfileOpenChange, 
    onNavigate, 
    activeView,
    onAnimatedSearchToggle,
    isAnimatedSearchExpanded,
    isSearchingOnAbout,
}: UserActionsProps) {
    
    return (
        <>
            <div className="flex flex-1 justify-end animate-slide-in-from-right" style={{ animationDuration: '0.5s' }}>
                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-1">
                    {(activeView === 'about' || activeView === 'faq') && !isAnimatedSearchExpanded && !isSearchingOnAbout && (
                         <div className={cn(
                            "flex items-center gap-1",
                            isEnquireOpen && "opacity-50"
                         )}>
                            <div 
                                className="flex items-center justify-center opacity-0 animate-slide-in-from-right-and-fade"
                                style={{ animationDuration: '0.5s', animationDelay: '0.1s', animationFillMode: 'forwards' }}
                            >
                                <button onClick={onAnimatedSearchToggle} className="h-11 w-11 flex items-center justify-center" aria-label="Open search">
                                    <div className="h-11 w-11 bg-white rounded-full flex items-center justify-center">
                                        <Image src="/icons/search_icon.png" alt="Search" width={28} height={28} onDragStart={(e) => e.preventDefault()}/>
                                    </div>
                                </button>
                                <Separator orientation="vertical" className="h-6 bg-foreground/50 mx-1 lg:mx-2" />
                            </div>
                         </div>
                    )}
                    <Popover open={isEnquireOpen} onOpenChange={onEnquireOpenChange}>
                        <PopoverTrigger asChild>
                            <Button 
                                size="sm" 
                                className={cn(
                                    "rounded-full font-normal text-sm lg:text-base border border-custom-gold px-3 py-1 transition-all duration-100 hover:opacity-90",
                                    isEnquireOpen ? 'bg-white text-custom-purple-dark hover:bg-white' : 'bg-custom-gold text-custom-purple-dark hover:bg-custom-gold'
                                )}
                            >
                                Enquire Now
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            sideOffset={8}
                            align="end"
                            className="w-auto max-w-[280px] bg-white/80 backdrop-blur-md border-white/30 text-black p-4 rounded-3xl"
                        >
                            <div className="flex flex-col items-start text-left gap-1 w-full">
                                <h3 className="text-xl font-bold text-custom-purple-dark font-plex-sans">Looking for a Perfect Gift?</h3>
                                <p className="text-base font-semibold font-plex-sans-condensed w-full text-center">Get personalized advice on flavours, packaging, and more.</p>
                                <Separator className="my-2 bg-custom-purple-dark h-[1px] w-3/4 self-center" />
                                <Button asChild className="w-full h-auto py-2 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-lg font-plex-sans">
                                    <a href="tel:+1234567890">
                                        <Phone className="mr-2 h-4 w-4" /> Call Us
                                    </a>
                                </Button>
                                <p className="text-xs font-medium self-center">-OR-</p>
                                <Button asChild className="w-full h-auto py-2 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-lg font-plex-sans">
                                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                                        <AiOutlineWhatsApp className="mr-2 h-6 w-6" /> Whatsapp Us
                                    </a>
                                 </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    
                    <div className={cn(
                        "flex items-center gap-1 transition-opacity duration-100", 
                        isEnquireOpen && "opacity-50"
                    )}>
                        <Separator orientation="vertical" className="h-6 bg-foreground/50 mx-1 lg:mx-2" />
                        <div className="flex items-center gap-1 lg:gap-2">
                            <Link href="#" aria-label="Instagram">
                                <AiOutlineInstagram className="h-7 w-7 lg:h-8 lg:w-8 transition-colors hover:text-custom-gold" />
                            </Link>
                            <Link href="#" aria-label="Facebook">
                                <IoLogoFacebook className="h-7 w-7 lg:h-8 lg:w-8 transition-colors hover:text-custom-gold" />
                            </Link>
                            
                            <button onClick={() => onProfileOpenChange(true)} aria-label="Profile" className="ml-1 lg:ml-2">
                                <Image src="/icons/profile_icon.png" alt="Profile" width={36} height={36} className="h-8 w-8 lg:h-9 lg:w-9 transition-colors hover:opacity-80" onDragStart={(e) => e.preventDefault()} />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Actions (Hamburger Menu) */}
                <div className={cn(
                    "md:hidden transition-opacity duration-100", 
                    isEnquireOpen && "opacity-50"
                )}>
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
                                {navLinks.map((link) => {
                                    const isActive = activeView === link.id;
                                    return (
                                        <SheetClose asChild key={link.id}>
                                            <button
                                                onClick={() => onNavigate(link.id)}
                                                className={cn(
                                                    "transition-colors hover:text-custom-gold",
                                                    isActive ? "text-custom-gold font-semibold" : "text-foreground/80"
                                                )}
                                            >
                                                {link.label}
                                            </button>
                                        </SheetClose>
                                    )
                                })}
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
                                        <Image src="/icons/profile_icon.png" alt="Profile" width={36} height={36} className="h-9 w-9 transition-colors hover:opacity-80" onDragStart={(e) => e.preventDefault()} />
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    );
}
