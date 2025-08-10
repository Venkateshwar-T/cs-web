
'use client';

import { useState } from 'react';
import { Header } from "@/components/header";

export default function Home() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header isSearchFocused={isSearchFocused} onFocusChange={setIsSearchFocused} />
      <main className={`flex-grow pt-72 overflow-hidden transition-opacity duration-500 ${isSearchFocused ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-white/50 h-full rounded-t-2xl mx-8 md:mx-32 p-8 overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-bold text-white mb-8 pl-4">Explore Categories</h2>
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
