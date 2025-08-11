
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/loader';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
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
        "flex-grow overflow-hidden flex transition-all duration-500 relative",
        isSearchActive ? 'pt-36' : 'pt-72',
        isLoading ? 'items-center justify-center' : 'items-start'
      )}>
        {!isSearchActive && (
          <div className={cn("transition-opacity duration-500 w-full", isSearchActive ? 'opacity-0' : 'opacity-100 h-full')}>
            <ExploreCategories />
          </div>
        )}
        {isLoading && <Loader className="-mt-24" />}
        {isSearchActive && !isLoading && (
          <>
            <div className="flex w-full h-full">
              <FilterContainer />
              <SearchResultsDetails query={searchQuery} />
            </div>
            <Button
              className="absolute bottom-8 right-8 rounded-full h-16 w-16 shadow-lg"
              size="icon"
            >
              <Image src="/icons/cart.png" alt="Cart" width={28} height={28} />
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
