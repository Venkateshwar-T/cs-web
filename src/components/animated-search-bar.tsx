// @/components/animated-search-bar.tsx
'use client';

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ActiveView } from "@/app/page";

interface AnimatedSearchBarProps {
  onSearchSubmit: (query: string) => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  className?: string;
  isSearchingOnAbout: boolean;
  activeView: ActiveView;
}

export function AnimatedSearchBar({ 
  onSearchSubmit,
  isExpanded,
  onExpandedChange,
  className,
  isSearchingOnAbout,
  activeView,
}: AnimatedSearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
        toast({
            title: "Empty Field",
            description: "Search field cannot be empty.",
            variant: "destructive",
        });
        return;
    }
    onSearchSubmit(inputValue);
  };
  
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSearchingOnAbout) {
      setInputValue("");
    } else {
      onExpandedChange(false);
    }
  };

  const showCloseButton = inputValue && activeView !== 'search';

  if (!isExpanded) return null;

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center w-full", className)}>
      <motion.div
        className="flex items-center h-10 md:h-11 rounded-full bg-white text-black shadow-lg overflow-hidden w-full"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center w-full h-full">
            <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <Image src="/icons/search_icon.png" alt="Search" width={28} height={28} onDragStart={(e) => e.preventDefault()}/>
            </div>

            <div className="flex-1 flex items-center pr-2">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for gifts..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent outline-none text-black placeholder:text-gray-500 text-lg md:text-xl"
                    onClick={(e) => e.stopPropagation()}
                />
                {showCloseButton && (
                  <button
                      type="button"
                      onClick={handleCloseClick}
                      className="p-2 hover:bg-gray-200 rounded-full"
                      aria-label="Close search"
                  >
                      <X size={20} />
                  </button>
                )}
            </div>
        </div>
      </motion.div>
    </form>
  );
}
