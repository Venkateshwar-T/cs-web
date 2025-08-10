
'use client';

import { useState } from 'react';
import { Header } from "@/components/header";

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
      <main className={`flex-grow pt-72 overflow-hidden transition-opacity duration-500 ${!isSearchActive && isSearchActive ? 'opacity-0' : 'opacity-100'} flex`}>
        {isSearchActive && (
          <div className="w-64 bg-white/30 backdrop-blur-sm rounded-tr-2xl flex-shrink-0">
            {/* Sidebar content can go here */}
          </div>
        )}
        <div className={`bg-white/50 h-full rounded-t-2xl p-8 overflow-y-auto no-scrollbar ${isSearchActive ? 'mx-8' : 'mx-8 md:mx-32'} flex-grow`}>
          <h2 className="text-2xl font-bold text-white mb-8 pl-4">
            {isSearchActive ? `Showing results for "${searchQuery}"` : 'Explore Categories'}
          </h2>
          <div className="flex flex-wrap justify-around gap-8">
            <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
            <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
            <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
            <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
