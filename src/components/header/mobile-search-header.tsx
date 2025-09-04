// @/components/header/mobile-search-header.tsx
'use client';

import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileSearchHeaderProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isVisible: boolean;
}

export function MobileSearchHeader({ value, onChange, onSubmit, isVisible }: MobileSearchHeaderProps) {
    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-background h-16 flex items-center px-4 border-b border-white/20 transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "-translate-y-full"
        )}>
            <form onSubmit={onSubmit} className="w-full">
                 <div className="relative flex items-center">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                         <Image src="/icons/search_icon.png" alt="Search" width={24} height={24} onDragStart={(e) => e.preventDefault()} />
                     </div>
                     <Input 
                        name="search"
                        autoComplete="off"
                        value={value}
                        onChange={onChange}
                        placeholder={'Search for gifts...'}
                        className={cn(
                            `w-full pl-11 pr-10 h-10 rounded-full bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-base text-black`
                        )}
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                            className="absolute right-3 p-2 hover:bg-gray-200 rounded-full"
                            aria-label="Clear search"
                        >
                            <X size={18} className="text-gray-600"/>
                        </button>
                    )}
                 </div>
            </form>
        </header>
    );
}
