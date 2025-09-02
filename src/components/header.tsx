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
import { AnimatedSearchBar } from "./animated-search-bar";

interface HeaderProps {
  onSearchSubmit: (query: string, fromAnimated?: boolean) => void;
  onProfileOpenChange: (isOpen: boolean) => void;
  isContentScrolled: boolean;
  onReset: () => void;
  onNavigate: (view: 'about' | 'faq') => void;
  activeView: ActiveView;
  isSearchingOnAbout: boolean;
  isUsingAnimatedSearch: boolean;
}

export function Header({ 
  onSearchSubmit, 
  onProfileOpenChange, 
  isContentScrolled, 
  onReset, 
  onNavigate, 
  activeView, 
  isSearchingOnAbout,
  isUsingAnimatedSearch
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [targetWidth, setTargetWidth] = useState<number | undefined>(undefined);
  const [isAnimatedSearchExpanded, setIsAnimatedSearchExpanded] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // When the animated search bar is closed, reset the target width
    // to ensure it's recalculated on the next open.
    if (!isAnimatedSearchExpanded) {
      setTargetWidth(undefined);
    }
  }, [isAnimatedSearchExpanded]);
  
  useEffect(() => {
    if (isAnimatedSearchExpanded || isUsingAnimatedSearch) {
        setIsNavVisible(false);
    } else {
        // Delay making nav visible to allow for animation
        const timer = setTimeout(() => {
            setIsNavVisible(true);
        }, 300); // Should match animation duration
        return () => clearTimeout(timer);
    }
  }, [isAnimatedSearchExpanded, isUsingAnimatedSearch]);

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
  
  const handleAnimatedSearchSubmit = (query: string) => {
    onSearchSubmit(query, true);
  };
  
  const handleAnimatedSearchToggle = () => {
    if (!isAnimatedSearchExpanded && formRef.current) {
      const isLargeDesktop = window.innerWidth >= 1280;
      const reductionFactor = isLargeDesktop ? 0.85 : 0.5;
      setTargetWidth(formRef.current.offsetWidth * reductionFactor);
    }
    setIsAnimatedSearchExpanded(prev => !prev);
  };
  
  const handleLogoClick = () => {
    setTargetWidth(undefined);
    setSearchInput("");
    setIsAnimatedSearchExpanded(false);
    onReset();
  };
  
  const showAnimatedSearch = isAnimatedSearchExpanded || isUsingAnimatedSearch;
  
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
        <div className="container relative flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-24">
          
          <Logo onLogoClick={handleLogoClick} isEnquireOpen={isEnquireOpen} />
          
          <Navigation 
            isEnquireOpen={isEnquireOpen}
            onNavigate={onNavigate}
            activeView={activeView}
            isNavVisible={isNavVisible}
          />
          
          {showAnimatedSearch && (
             <div className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                isEnquireOpen && "hidden"
              )}>
                <AnimatedSearchBar 
                    onSearchSubmit={handleAnimatedSearchSubmit}
                    isExpanded={showAnimatedSearch}
                    onExpandedChange={setIsAnimatedSearchExpanded}
                    width={targetWidth}
                    isSearchingOnAbout={isSearchingOnAbout || isUsingAnimatedSearch}
                />
             </div>
          )}
          
          <UserActions 
            isEnquireOpen={isEnquireOpen}
            onEnquireOpenChange={setIsEnquireOpen}
            onProfileOpenChange={onProfileOpenChange}
            onNavigate={onNavigate}
            activeView={activeView}
            onAnimatedSearchToggle={handleAnimatedSearchToggle}
            isAnimatedSearchExpanded={isAnimatedSearchExpanded}
            isSearchingOnAbout={isSearchingOnAbout}
          />
        </div>

        {!showAnimatedSearch && (
           <SearchBar
              formRef={formRef}
              activeView={activeView}
              isEnquireOpen={isEnquireOpen}
              targetWidth={targetWidth}
              onSubmit={handleSearchSubmit}
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
            />
        )}
      </header>
    </>
  );
}
