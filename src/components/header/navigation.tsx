// @/components/header/navigation.tsx
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationProps {
    isSearchSubmitted: boolean;
    isEnquireOpen: boolean;
}

const navLinks = [
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
];

export function Navigation({ isSearchSubmitted, isEnquireOpen }: NavigationProps) {
    return (
        <nav className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-8 text-base lg:text-lg transition-opacity duration-100 animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.05s' }}>
            {!isSearchSubmitted && navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn("transition-colors hover:text-custom-gold text-foreground/80", isEnquireOpen && "opacity-50")}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
