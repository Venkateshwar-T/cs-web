
'use client';

import { useState } from 'react';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header onSearchActiveChange={setIsSearchActive} />
      <main className="flex-grow pt-72 overflow-hidden">
        {!isSearchActive && (
          <div className="transition-opacity duration-500 opacity-100">
            <ExploreCategories />
          </div>
        )}
      </main>
    </div>
  );
}
