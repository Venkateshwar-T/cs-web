
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/loader';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSubmit = () => {
    setIsSearchActive(true);
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen">
      <Header onSearchSubmit={handleSearchSubmit} onSearchActiveChange={setIsSearchActive} />
      <main className={cn(
        "flex-grow overflow-hidden flex items-center justify-center transition-all duration-500",
        isSearchActive ? 'pt-36' : 'pt-72'
      )}>
        {isSearchActive ? (
          <>
            {isLoading && <Loader />}
          </>
        ) : (
          <div className={cn("transition-opacity duration-500", isSearchActive ? 'opacity-0' : 'opacity-100 h-full w-full')}>
            <ExploreCategories />
          </div>
        )}
      </main>
    </div>
  );
}
