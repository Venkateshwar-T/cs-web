
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/loader';
import { SearchResultsContainer } from '@/components/search-results-container';

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
        "flex-grow overflow-hidden flex justify-start transition-all duration-500",
        isSearchActive ? 'pt-24' : 'pt-72',
        isLoading ? 'items-center justify-center' : 'items-start'
      )}>
        {!isSearchActive && (
          <div className={cn("transition-opacity duration-500 w-full", isSearchActive ? 'opacity-0' : 'opacity-100 h-full')}>
            <ExploreCategories />
          </div>
        )}
        {isLoading && <Loader className="mt-[-6rem]" />}
        {isSearchActive && !isLoading && <SearchResultsContainer />}
      </main>
    </div>
  );
}
