// @/components/header.tsx
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./header/logo";
import { Navigation } from "./header/navigation";
import { UserActions } from "./header/user-actions";
import { SearchBar } from "./header/search-bar";

interface HeaderProps {
  onSearchSubmit: (query: string) => void;
  isCartVisible: boolean;
  onProfileOpenChange: (isOpen: boolean) => void;
  isContentScrolled: boolean;
  onReset: () => void;
}

export function Header({ onSearchSubmit, isCartVisible, onProfileOpenChange, isContentScrolled, onReset }: HeaderProps) {
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [targetWidth, setTargetWidth] = useState<number | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>, currentSearchInput: string) => {
    e.preventDefault();
    
    if (!currentSearchInput.trim()) {
      toast({
        title: "Empty Field",
        description: "Search field cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (formRef.current && !isSearchSubmitted) {
      const isLargeDesktop = window.innerWidth >= 1280;
      const reductionFactor = isLargeDesktop ? 0.85 : 0.5;
      setTargetWidth(formRef.current.offsetWidth * reductionFactor);
    }
    
    setIsSearchSubmitted(true);
    onSearchSubmit(currentSearchInput.trim());
  };

  const handleLogoClick = () => {
    setIsSearchSubmitted(false);
    setTargetWidth(undefined);
    setSearchInput("");
    onReset();
  };

  return (
    <>
      {isEnquireOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-100" />
      )}
      <header className={cn(
        "fixed top-0 z-50 w-full bg-transparent pt-6 pb-8 transition-all duration-100", 
        isContentScrolled && 'bg-background border-b-2',
        (isEnquireOpen && isContentScrolled) && 'bg-[#2e1440] border-b-2 border-custom-purple-dark',
      )}>
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-24">
          
          <Logo onLogoClick={handleLogoClick} isEnquireOpen={isEnquireOpen} />
          
          <Navigation isSearchSubmitted={isSearchSubmitted} isEnquireOpen={isEnquireOpen} />
          
          <UserActions 
            isEnquireOpen={isEnquireOpen}
            isSearchSubmitted={isSearchSubmitted}
            onEnquireOpenChange={setIsEnquireOpen}
            onProfileOpenChange={onProfileOpenChange}
          />
        </div>

        <SearchBar
          formRef={formRef}
          isSearchSubmitted={isSearchSubmitted}
          isEnquireOpen={isEnquireOpen}
          targetWidth={targetWidth}
          onSubmit={handleSearchSubmit}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
        />
      </header>
    </>
  );
}
