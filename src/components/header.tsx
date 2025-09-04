
// @/components/header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./header/logo";
import { Navigation } from "./header/navigation";
import { UserActions } from "./header/user-actions";
import { SearchBar } from "./header/search-bar";
import type { ActiveView } from "@/app/page";
import { AnimatedSearchBar } from "./animated-search-bar";
import Image from "next/image";
import { MobileSearchBar } from "./mobile-search-bar";

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
  const [isAnimatedSearchExpanded, setIsAnimatedSearchExpanded] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const router = useRouter();
  
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
    
    router.push(`/search?q=${encodeURIComponent(currentSearchInput.trim())}`);
  };
  
  const handleAnimatedSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onSearchSubmit(query, true);
  };
  
  const handleAnimatedSearchToggle = () => {
    setIsAnimatedSearchExpanded(prev => !prev);
  };
  
  const handleLogoClick = () => {
    setSearchInput("");
    setIsAnimatedSearchExpanded(false);
    router.push('/');
    onReset();
  };
  
  const showAnimatedSearch = isAnimatedSearchExpanded || isUsingAnimatedSearch;
  
  return (
    <>
      {isEnquireOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" />
      )}
      <header className={cn(
        "fixed top-0 z-50 w-full bg-transparent pt-4 md:pt-6 pb-4 md:pb-8 transition-all duration-100", 
        isContentScrolled && 'bg-background border-b-2',
        (isEnquireOpen && isContentScrolled) && 'bg-[#2e1440] border-b-2 border-custom-purple-dark',
      )}>
        <div className="container relative flex h-16 md:h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-24">
          
          {!isMobileSearchExpanded && <Logo onLogoClick={handleLogoClick} isEnquireOpen={isEnquireOpen} />}
          
          <div className="hidden md:flex flex-1">
            <Navigation 
              isEnquireOpen={isEnquireOpen}
              onNavigate={onNavigate}
              activeView={activeView}
              isNavVisible={isNavVisible}
            />
          </div>
          
          {showAnimatedSearch && (
             <div className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                isEnquireOpen && "opacity-50 pointer-events-none"
              )}>
                <AnimatedSearchBar 
                    onSearchSubmit={handleAnimatedSearchSubmit}
                    isExpanded={showAnimatedSearch}
                    onExpandedChange={setIsAnimatedSearchExpanded}
                    width={500}
                    isSearchingOnAbout={isSearchingOnAbout || isUsingAnimatedSearch}
                />
             </div>
          )}
          
          <div className="hidden md:flex flex-1 justify-end">
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

          <div className="md:hidden flex-1 flex justify-end items-center">
            {isMobileSearchExpanded ? (
              <MobileSearchBar
                onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
                onCollapse={() => setIsMobileSearchExpanded(false)}
              />
            ) : (
              <button onClick={() => setIsMobileSearchExpanded(true)} className="h-10 w-10 flex items-center justify-center" aria-label="Open search">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                      <Image src="/icons/search_icon.png" alt="Search" width={24} height={24} onDragStart={(e) => e.preventDefault()}/>
                  </div>
              </button>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          {!showAnimatedSearch && (
            <SearchBar
                formRef={formRef}
                activeView={activeView}
                isEnquireOpen={isEnquireOpen}
                onSubmit={handleSearchSubmit}
                searchInput={searchInput}
                onSearchInputChange={setSearchInput}
              />
          )}
        </div>
      </header>
    </>
  );
}
