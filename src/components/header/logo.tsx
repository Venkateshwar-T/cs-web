// @/components/header/logo.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    onLogoClick: () => void;
    isEnquireOpen: boolean;
}

export function Logo({ onLogoClick, isEnquireOpen }: LogoProps) {
    return (
        <div className="flex flex-1 justify-start transition-opacity duration-100 animate-slide-in-from-left" style={{ animationDuration: '0.5s' }}>
            <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
                <Link href="/" className="flex items-center gap-2" onClick={onLogoClick}>
                    <Image 
                        src="/Choco Smiley Logo.png" 
                        alt="Choco Smiley Logo" 
                        width={180} 
                        height={70}
                        className={cn("w-28 sm:w-32 md:w-36 lg:w-44", isEnquireOpen && "opacity-50")}
                        onDragStart={(e) => e.preventDefault()}
                    />
                </Link>
                <Image 
                    src="/Online Chocolate Store.png" 
                    alt="Online Chocolate Store" 
                    width={120} 
                    height={55}
                    className={cn("hidden sm:block w-20 md:w-24 lg:w-32", isEnquireOpen && "opacity-50")}
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>
        </div>
    );
}
