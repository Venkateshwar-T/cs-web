
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
import Image from "next/image";
import { MobileSearchBar } from "./mobile-search-bar";

interface HeaderProps {
  onProfileOpenChange: (isOpen: boolean) => void;
  isContentScrolled: boolean;
  onReset: () => void;
  onNavigate: (view: 'about' | 'faq') => void;
  activeView: ActiveView;
}

export function Header({ 
  onProfileOpenChange, 
  isContentScrolled, 
  onReset, 
  onNavigate, 
  activeView, 
}: HeaderProps) {
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [isAnimatedSearchExpanded, setIsAnimatedSearchExpanded] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(activeView === 'search');
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
        "fixed top-0 z-50 w-full bg-transparent pt-4 md:pt-6 pb-4 md:pb-4 transition-all duration-100", 
        isContentScrolled && 'bg-background border-b-2',
        (isEnquireOpen && isContentScrolled) && 'bg-[#2e1440] border-b-2 border-custom-purple-dark',
      )}>
        <div className="container relative flex h-16 md:h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-24">
          
          {!(isMobileSearchExpanded && activeView !== 'search') && <Logo onLogoClick={handleLogoClick} isEnquireOpen={isEnquireOpen} />}
          
          <div className="hidden md:flex flex-1">
             {activeView === 'search' ? (
                <div className="flex-1 flex justify-center items-center px-4 lg:px-8">
                    <div className="w-full max-w-lg">
                      <AnimatedSearchBar 
                          onSearchSubmit={handleAnimatedSearchSubmit}
                          isExpanded={true}
                          onExpandedChange={() => {}}
                          isSearchingOnAbout={false}
                          activeView={activeView}
                      />
                    </div>
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
                    isSearchingOnAbout={false}
                    activeView={activeView}
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
              isSearchingOnAbout={false}
            />
          </div>

          <div className="md:hidden flex-1 flex justify-end items-center">
            {isMobileSearchExpanded || activeView === 'search' ? (
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
      </header>
    </>
  );
}
