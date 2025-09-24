
// @/components/header/navigation.tsx
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import type { ActiveView } from '@/app/page';
import { useAppContext } from "@/context/app-context";

interface NavigationProps {
  isEnquireOpen: boolean;
  onNavigate: (view: 'about' | 'faq' | 'admin') => void;
  activeView: ActiveView;
}

const navLinks = [
    { id: "about", label: "About", href: "/about" },
    { id: "faq", label: "FAQ", href: "/faq" },
] as const;


export function Navigation({ isEnquireOpen, onNavigate, activeView }: NavigationProps) {
    const router = useRouter();
    const { isAdmin } = useAppContext();

    const handleClick = (linkId: 'about' | 'faq' | 'admin') => {
        router.push(`/${linkId}`);
    };

    return (
        <nav className={cn(
            "hidden md:flex justify-center items-center gap-4 lg:gap-8 text-base lg:text-lg animate-slide-down"
        )} style={{ animationDuration: '0.3s' }}>
            {navLinks.map((link) => {
                const isActive = activeView === link.id;
                return (
                    <button
                        key={link.id}
                        onClick={() => handleClick(link.id)}
                        className={cn(
                            "transition-colors hover:text-custom-gold", 
                            isEnquireOpen && "opacity-50",
                            isActive ? "text-custom-gold font-base" : "text-foreground/80"
                        )}
                    >
                        {link.label}
                    </button>
                )
            })}
             {isAdmin && (
                <button
                    onClick={() => handleClick("admin")}
                    className={cn(
                        "transition-colors hover:text-custom-gold", 
                        isEnquireOpen && "opacity-50",
                        activeView === 'admin' ? "text-custom-gold font-base" : "text-foreground/80"
                    )}
                >
                    Admin
                </button>
            )}
        </nav>
    );
}
