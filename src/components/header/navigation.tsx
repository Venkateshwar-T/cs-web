// @/components/header/navigation.tsx
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationProps {
    isSearchSubmitted: boolean;
    isEnquireOpen: boolean;
    onNavigate: (view: 'about' | 'faq') => void;
    activeView: string;
}

const navLinks = [
    { id: "about", label: "About" },
    { id: "faq", label: "FAQ" },
] as const;


export function Navigation({ isSearchSubmitted, isEnquireOpen, onNavigate, activeView }: NavigationProps) {
    return (
        <nav className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-8 text-base lg:text-lg transition-opacity duration-100 animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.05s' }}>
            {!isSearchSubmitted && navLinks.map((link) => {
                const isActive = activeView === link.id;
                return (
                    <button
                        key={link.id}
                        onClick={() => onNavigate(link.id)}
                        className={cn(
                            "transition-colors hover:text-custom-gold", 
                            isEnquireOpen && "opacity-50",
                            isActive ? "text-custom-gold font-semibold" : "text-foreground/80"
                        )}
                    >
                        {link.label}
                    </button>
                )
            })}
        </nav>
    );
}
