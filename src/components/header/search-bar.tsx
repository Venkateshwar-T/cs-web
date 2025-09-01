
// @/components/header/search-bar.tsx
'use client';

import { useState, useEffect, RefObject } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ActiveView } from '@/app/page';

interface SearchBarProps {
    formRef: RefObject<HTMLFormElement>;
    activeView: ActiveView;
    isEnquireOpen: boolean;
    targetWidth: number | undefined;
    onSubmit: (e: React.FormEvent<HTMLFormElement>, searchInput: string) => void;
    searchInput: string;
    onSearchInputChange: (value: string) => void;
}

const textsToType = ["Corporate gifts", "Family presents", "Festive gifts", "Birthday surprises", "Anniversary specials"];

export function SearchBar({ formRef, activeView, isEnquireOpen, targetWidth, onSubmit, searchInput, onSearchInputChange }: SearchBarProps) {
    const [placeholder, setPlaceholder] = useState("");
    const isSearchSubmitted = activeView === 'search';
    const isAboutView = activeView === 'about';

    useEffect(() => {
        if (activeView !== 'home') return;
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
    }, [activeView]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onSubmit(e, searchInput);
    };

    if (isAboutView) {
        return (
             <div className={cn(
                "container max-w-screen-2xl px-8 md:px-12 transition-all duration-500 ease-in-out -mt-[3.75rem] opacity-0",
             )}>
                 {/* Render an invisible placeholder to prevent layout shifts */}
                <form className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <Input className="invisible" />
                </form>
             </div>
        );
    }

    return (
        <div className={cn(
            "container max-w-screen-2xl px-8 md:px-12 transition-all duration-500 ease-in-out",
            isSearchSubmitted ? '-mt-[3.75rem]' : 'mt-8 sm:mt-12 md:mt-16',
            isEnquireOpen && "opacity-50 transition-opacity duration-100"
        )}>
            <form 
                ref={formRef}
                onSubmit={handleSubmit} 
                className={`relative mx-auto transition-all duration-500 ease-in-out animate-slide-down ${!targetWidth ? 'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl' : ''}`}
                style={{ maxWidth: targetWidth ? `${targetWidth}px` : undefined, animationDuration: '0.5s', animationDelay: '0.05s' }}
            >
                <div className="absolute inset-0 rounded-full bg-white -z-10"></div>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Image src="/icons/search_icon.png" alt="Search" width={28} height={28} onDragStart={(e) => e.preventDefault()} />
                </div>
                <Input 
                    name="search"
                    autoComplete="off"
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.target.value)}
                    placeholder={activeView !== 'home' ? 'Search for gifts...' : placeholder}
                    className={`w-full pl-12 pr-4 h-11 rounded-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-lg md:text-xl text-black`}
                />
            </form>
        </div>
    );
}
