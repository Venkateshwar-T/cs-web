
// @/components/header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./header/logo";
import { Navigation } from "./header/navigation";
import { UserActions } from "./header/user-actions";
import { SearchBar } from "./header/search-bar";
import type { ActiveView } from "@/app/page";

interface HeaderProps {
  onSearchSubmit: (query: string) => void;
  isCartVisible: boolean;
  onProfileOpenChange: (isOpen: boolean) => void;
  isContentScrolled: boolean;
  onReset: () => void;
  onNavigate: (view: 'about' | 'faq') => void;
  activeView: ActiveView;
}

export function Header({ onSearchSubmit, isCartVisible, onProfileOpenChange, isContentScrolled, onReset, onNavigate, activeView }: HeaderProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [targetWidth, setTargetWidth] = useState<number | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const isCompactHeader = activeView !== 'home';

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

    if (formRef.current && activeView === 'home') {
      const isLargeDesktop = window.innerWidth >= 1280;
      const reductionFactor = isLargeDesktop ? 0.85 : 0.5;
      setTargetWidth(formRef.current.offsetWidth * reductionFactor);
    }
    
    onSearchSubmit(currentSearchInput.trim());
  };

  const handleLogoClick = () => {
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
          
          <Navigation 
            isCompactHeader={isCompactHeader} 
            isEnquireOpen={isEnquireOpen}
            onNavigate={onNavigate}
            activeView={activeView}
          />
          
          <UserActions 
            isEnquireOpen={isEnquireOpen}
            isCompactHeader={isCompactHeader}
            onEnquireOpenChange={setIsEnquireOpen}
            onProfileOpenChange={onProfileOpenChange}
            onNavigate={onNavigate}
            activeView={activeView}
            showSearchIcon={activeView === 'about'}
          />
        </div>

        <SearchBar
          formRef={formRef}
          activeView={activeView}
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
