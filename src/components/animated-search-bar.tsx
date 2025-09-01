// @/components/animated-search-bar.tsx
'use client';

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AnimatedSearchBarProps {
  onSearchSubmit: (query: string) => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  className?: string;
}

export function AnimatedSearchBar({ 
  onSearchSubmit,
  isExpanded,
  onExpandedChange,
  className
}: AnimatedSearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const containerVariants = {
    collapsed: {
      width: "0px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    expanded: {
      width: "300px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpandedChange(false);
    setInputValue("");
  };

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
    onExpandedChange(false);
    setInputValue("");
  };

  if (!isExpanded) return null;

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center", className)}>
      <motion.div
        className="flex items-center h-11 rounded-full bg-white text-black shadow-lg overflow-hidden"
        variants={containerVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        style={{ cursor: isExpanded ? "auto" : "pointer" }}
      >
        <div className="flex items-center w-full h-full">
            <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <Image src="/icons/search_icon.png" alt="Search" width={24} height={24} />
            </div>

            <div className="flex-1 flex items-center pr-2">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for gifts..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent outline-none text-black placeholder:text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    type="button"
                    onClick={handleCloseClick}
                    className="p-2 hover:bg-gray-200 rounded-full"
                    aria-label="Close search"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
      </motion.div>
    </form>
  );
}
