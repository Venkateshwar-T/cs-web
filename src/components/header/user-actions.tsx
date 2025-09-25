// @/components/header/user-actions.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Phone, Search, Info, HelpCircle, LogOut, Shield, LineChart, ShoppingBag } from "lucide-react";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ActiveView } from '@/app/page';
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/context/app-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


interface UserActionsProps {
    isEnquireOpen: boolean;
    onEnquireOpenChange: (isOpen: boolean) => void;
    onProfileOpenChange: (isOpen: boolean) => void;
    onNavigate: (view: 'about' | 'faq' | 'admin') => void;
    activeView: ActiveView;
    onAnimatedSearchToggle: () => void;
    isAnimatedSearchExpanded: boolean;
    isSearchingOnAbout: boolean;
}

const navLinks = [
    { id: "about", label: "About", href: "/about", icon: Info },
    { id: "faq", label: "FAQ", href: "/faq", icon: HelpCircle },
] as const;

const adminLinks = [
    { id: "admin", label: "Manage Orders", href: "/admin", icon: ShoppingBag },
    { id: "admin-analytics", label: "Analytics", href: "/admin/analytics", icon: LineChart },
];

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
    const isMobile = useIsMobile();
    const [isEnquireSheetOpen, setIsEnquireSheetOpen] = useState(false);
    const router = useRouter();
    const { logout, isAuthenticated, isAdmin, setAuthPopup } = useAppContext();

    const handleMobileNav = (href: string) => {
        router.push(href);
    };

    const handleLogout = () => {
        logout();
    };

    const handleProfileClick = () => {
      // Always open the profile popup, which will handle the auth state internally
      onProfileOpenChange(true);
    }
    
    return (
        <div className="flex items-center animate-slide-in-from-right" style={{ animationDuration: '0.5s' }}>
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1">
                { (activeView === 'about' || activeView === 'faq') && !isAnimatedSearchExpanded && (
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
                                    <IoLogoWhatsapp className="mr-2 h-6 w-6" /> Whatsapp Us
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
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                        <button onClick={handleProfileClick} aria-label="Profile" className="ml-1 lg:ml-2">
                            <Image src="/icons/profile_icon.png" alt="Profile" width={36} height={36} className="h-8 w-8 lg:h-9 lg:w-9 transition-colors hover:opacity-80" onDragStart={(e) => e.preventDefault()} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
             <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-background text-white w-[250px] flex flex-col p-0">
                        <SheetHeader className="p-4 pb-0">
                           <SheetTitle className="sr-only">Menu</SheetTitle>
                            <Link href="/">
                                <Image 
                                    src="/Choco Smiley Logo.png" 
                                    alt="Choco Smiley Logo" 
                                    width={150} 
                                    height={60}
                                    className="h-auto"
                                />
                            </Link>
                            <Separator className="bg-custom-purple-light/50"/>
                        </SheetHeader>
                        <div className="flex flex-col flex-grow p-4 pt-0">
                           <nav className="flex flex-col gap-4 text-lg">
                             {navLinks.map((link) => {
                                const isActive = activeView === link.id;
                                return (
                                    <SheetClose asChild key={link.id}>
                                        <button
                                            onClick={() => handleMobileNav(link.href)}
                                            className={cn(
                                                "transition-colors hover:text-custom-gold text-left flex items-center gap-3", 
                                                isActive ? "text-custom-gold font-semibold" : "text-foreground/80"
                                            )}
                                        >
                                            <link.icon className="h-5 w-5" />
                                            <span>{link.label}</span>
                                        </button>
                                    </SheetClose>
                                )
                            })}
                            {isAdmin && (
                                <>
                                    <Separator className="bg-white/20"/>
                                    <p className="text-sm font-semibold text-white/70 px-1">Admin</p>
                                    {adminLinks.map((link) => {
                                        const isActive = activeView === link.id;
                                        return (
                                            <SheetClose asChild key={link.id}>
                                                <button
                                                    onClick={() => handleMobileNav(link.href)}
                                                    className={cn(
                                                        "transition-colors hover:text-custom-gold text-left flex items-center gap-3", 
                                                        isActive ? "text-custom-gold font-semibold" : "text-foreground/80"
                                                    )}
                                                >
                                                    <link.icon className="h-5 w-5" />
                                                    <span>{link.label}</span>
                                                </button>
                                            </SheetClose>
                                        )
                                    })}
                                </>
                            )}
                           </nav>
                           {isAuthenticated && (
                            <>
                                <Separator className="bg-white/20 my-4"/>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button className="transition-colors text-red-500 text-left flex items-center gap-3 text-lg">
                                        <LogOut className="h-5 w-5" />
                                        <span>Log Out</span>
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        You will be returned to the login page.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <SheetClose asChild>
                                        <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                                      </SheetClose>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </>
                           )}

                           <div className='mt-auto flex flex-col gap-4'>
                            <SheetClose asChild>
                                <Button 
                                    onClick={() => {
                                        if (isMobile) {
                                            setIsEnquireSheetOpen(true);
                                        } else {
                                            onEnquireOpenChange(true);
                                        }
                                    }}
                                    variant="outline"
                                    className="w-full justify-center text-custom-gold border-custom-gold hover:bg-custom-gold hover:text-custom-purple-dark"
                                >
                                    Enquire Now
                                </Button>
                            </SheetClose>
                            <div className="flex items-center gap-4 self-center">
                                    <Link href="#" aria-label="Instagram">
                                        <AiOutlineInstagram className="h-7 w-7 transition-colors hover:text-custom-gold" />
                                    </Link>
                                    <Link href="#" aria-label="Facebook">
                                        <IoLogoFacebook className="h-7 w-7 transition-colors hover:text-custom-gold" />
                                    </Link>
                                </div>
                           </div>
                        </div>
                    </SheetContent>
                </Sheet>
                 <Sheet open={isEnquireSheetOpen} onOpenChange={setIsEnquireSheetOpen}>
                    <SheetContent side="bottom" className="bg-custom-purple-dark/90 text-white rounded-t-3xl border-t-2 border-custom-gold p-6">
                        <SheetHeader className="text-center">
                            <SheetTitle className="text-xl font-bold text-white font-plex-sans">Looking for a Perfect Gift?</SheetTitle>
                            <SheetDescription className="text-white/80 font-plex-sans-condensed text-base">
                                Get personalized advice on flavours, packaging, and more.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col gap-3 mt-6">
                            <Button asChild className="h-auto py-2 bg-white hover:bg-white/90 text-black rounded-full text-base font-plex-sans self-center w-48">
                                <a href="tel:+1234567890">
                                    <Phone className="mr-2 h-5 w-5" /> Call Us
                                </a>
                            </Button>
                            <p className="text-sm font-medium self-center text-white/80">-OR-</p>
                            <Button asChild className="h-auto py-2 bg-white hover:bg-white/90 text-black rounded-full text-base font-plex-sans self-center w-48">
                                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                                    <IoLogoWhatsapp className="mr-2 h-6 w-6" /> Whatsapp Us
                                </a>
                             </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
