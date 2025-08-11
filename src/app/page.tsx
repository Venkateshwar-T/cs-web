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
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(true);
    setIsLoading(true);
  };
  
  const handleAddToCart = (productName: string, quantity: number) => {
    const newCart = { ...cart, [productName]: quantity };
    if (quantity === 0) {
      delete newCart[productName];
    }
    setCart(newCart);

    const prevQuantity = cart[productName] || 0;
    if (quantity > prevQuantity) {
      setCartMessage(`${quantity - prevQuantity} ${productName} added`);
      setIsCartButtonExpanded(true);
  
      setTimeout(() => {
        setIsCartButtonExpanded(false);
      }, 1500);
    }
  };

  const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur, 0);

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
        {isLoading && <Loader />}
        {isSearchActive && !isLoading && (
          <>
            <div className="flex w-full h-full">
              <FilterContainer />
              <SearchResultsDetails query={searchQuery} onAddToCart={handleAddToCart} cart={cart} />
            </div>
            <Button
              className={cn(
                "absolute bottom-8 right-8 shadow-lg bg-custom-gold hover:bg-custom-gold/90 transition-all duration-300 ease-in-out flex items-center justify-center overflow-visible",
                isCartButtonExpanded ? 'w-72 h-16 rounded-full' : 'w-16 h-16 rounded-full'
              )}
              size="icon"
            >
              {isCartButtonExpanded ? (
                <span className="text-custom-purple-dark font-semibold whitespace-nowrap">{cartMessage}</span>
              ) : (
                <>
                  <Image src="/icons/cart.png" alt="Cart" width={28} height={28} />
                  {totalQuantity > 0 && (
                    <div className="absolute -top-1 -right-1 bg-custom-purple-dark text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {totalQuantity}
                    </div>
                  )}
                </>
              )}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
