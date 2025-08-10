
'use client';

import { useState } from 'react';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { SearchResults } from '@/components/search-results';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header onSearchActiveChange={setIsSearchActive} />
      <main className={cn("flex-grow pt-72 overflow-hidden transition-opacity duration-500", !isSearchActive ? "opacity-100" : "opacity-0 h-0")}>
        <ExploreCategories />
      </main>
      {isSearchActive && <SearchResults />}
    </div>
  );
}
