
// @/components/header/navigation.tsx
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

interface NavigationProps {
  isEnquireOpen: boolean;
  onNavigate: (view: 'about' | 'faq') => void;
  activeView: string;
}

const navLinks = [
    { id: "about", label: "About", href: "/about" },
    { id: "faq", label: "FAQ" },
] as const;


export function Navigation({ isEnquireOpen, onNavigate, activeView }: NavigationProps) {
    const router = useRouter();

    const handleClick = (link: typeof navLinks[number]) => {
        if (link.href) {
            router.push(link.href);
        } else {
            onNavigate(link.id as 'about' | 'faq');
        }
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
                        onClick={() => handleClick(link)}
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
        </nav>
    );
}
