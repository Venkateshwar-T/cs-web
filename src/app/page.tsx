
'use client';

import { useState } from 'react';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (query: string) => {
    setIsSearchActive(true);
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header isSearchActive={isSearchActive} onSearchSubmit={handleSearchSubmit} />
      {!isSearchActive ? (
        <main className="flex-grow pt-72 overflow-hidden transition-opacity duration-500 opacity-100 flex">
          <ExploreCategories />
        </main>
      ) : (
        <main className="flex-grow pt-48">
            <div className="bg-white h-full mx-8 md:mx-32 rounded-t-2xl p-8">
                {/* Search results will go here */}
            </div>
        </main>
      )}
    </div>
  );
}
