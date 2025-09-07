
// @/components/header.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Logo } from "./header/logo";
import { Navigation } from "./header/navigation";
import { UserActions } from "./header/user-actions";
import type { ActiveView } from "@/app/page";
import { AnimatedSearchBar } from "./animated-search-bar";

interface HeaderProps {
  onProfileOpenChange: (isOpen: boolean) => void;
  isContentScrolled: boolean;
  onReset: () => void;
  onNavigate: (view: 'about' | 'faq') => void;
  activeView: ActiveView;
  onSearchSubmit?: (query: string) => void;
  isSearchingOnAbout?: boolean;
  isUsingAnimatedSearch?: boolean;
  searchInput?: string;
  onSearchInputChange?: (value: string) => void;
}

export function Header({ 
  onProfileOpenChange, 
  isContentScrolled, 
  onReset, 
  onNavigate, 
  activeView,
  onSearchSubmit = () => {},
  isSearchingOnAbout = false,
  isUsingAnimatedSearch = false,
  searchInput = '',
  onSearchInputChange = () => {},
}: HeaderProps) {
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [isAnimatedSearchExpanded, setIsAnimatedSearchExpanded] = useState(isUsingAnimatedSearch);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (isAnimatedSearchExpanded) {
        setIsNavVisible(false);
    } else {
        const timer = setTimeout(() => {
            setIsNavVisible(true);
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [isAnimatedSearchExpanded]);

  const handleAnimatedSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const handleAnimatedSearchToggle = () => {
    setIsAnimatedSearchExpanded(prev => !prev);
  };
  
  const handleLogoClick = () => {
    setIsAnimatedSearchExpanded(false);
    onReset();
  };
  
  return (
    <>
      {isEnquireOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" />
      )}
      <header className={cn(
        "fixed top-0 z-50 w-full pt-4 md:pt-6 pb-4 md:pb-4 transition-all duration-100", 
        isContentScrolled ? 'bg-background border-b-2' : 'bg-transparent',
        (activeView === 'cart' || activeView === 'profile') && 'border-b border-white/20',
        (isEnquireOpen && isContentScrolled) && 'bg-[#2e1440] border-b-2 border-custom-purple-dark',
      )}>
        <div className="container relative flex h-16 md:h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-24">
          
          <div className="flex justify-start">
            <Logo onLogoClick={handleLogoClick} isEnquireOpen={isEnquireOpen} />
          </div>
          
          <div className="hidden md:flex flex-1 justify-center px-4">
             {(activeView === 'search' || activeView === 'order-confirmed') ? (
                <div className={cn("w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl", isEnquireOpen && 'opacity-50 pointer-events-none')}>
                  <AnimatedSearchBar 
                      onSearchSubmit={onSearchSubmit}
                      isExpanded={true}
                      onExpandedChange={() => {}}
                      isSearchingOnAbout={isSearchingOnAbout}
                      activeView={activeView}
                      searchInput={searchInput}
                      onSearchInputChange={onSearchInputChange}
                  />
                </div>
            ) : (
              isNavVisible &&
              <Navigation 
                isEnquireOpen={isEnquireOpen}
                onNavigate={onNavigate}
                activeView={activeView}
              />
            )}
          </div>
          
          {isAnimatedSearchExpanded && activeView !== 'search' && (
             <div className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4",
                isEnquireOpen && "opacity-50 pointer-events-none"
              )}>
                <AnimatedSearchBar 
                    onSearchSubmit={handleAnimatedSearchSubmit}
                    isExpanded={isAnimatedSearchExpanded}
                    onExpandedChange={setIsAnimatedSearchExpanded}
                    isSearchingOnAbout={isSearchingOnAbout}
                    activeView={activeView}
                    searchInput={searchInput}
                    onSearchInputChange={onSearchInputChange}
                />
             </div>
          )}
          
          <div className="flex justify-end">
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
        </div>
      </header>
    </>
  );
}
