'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';
import { Button } from '@/components/ui/button';
import { ProductPopup } from '@/components/product-popup';

export type Product = {
  id: number;
  name: string;
};

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(true);
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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur, 0);

  return (
    <>
      {selectedProduct && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={handleClosePopup} />
      )}
      <div className={cn("flex flex-col h-screen", selectedProduct ? 'opacity-50' : '')}>
        <Header onSearchSubmit={handleSearchSubmit} onSearchActiveChange={setIsSearchActive} />
        <main className={cn(
          "flex-grow overflow-hidden flex transition-all duration-500 relative items-start",
          isSearchActive ? 'pt-36' : 'pt-72'
        )}>
          {!isSearchActive && (
            <div className={cn("transition-opacity duration-500 w-full", isSearchActive ? 'opacity-0' : 'opacity-100 h-full')}>
              <ExploreCategories />
            </div>
          )}
          {isSearchActive && (
            <>
              <div className="flex w-full h-full">
                <FilterContainer />
                <div className="h-full flex-grow ml-12 mr-8 relative">
                    <SearchResultsDetails 
                      query={searchQuery} 
                      onAddToCart={handleAddToCart} 
                      cart={cart}
                      onProductClick={handleProductClick}
                    />
                    {selectedProduct && (
                        <div className="absolute inset-0 z-50">
                            <ProductPopup product={selectedProduct} onClose={handleClosePopup} />
                        </div>
                    )}
                </div>
              </div>
              <Button
                className={cn(
                  "absolute bottom-8 right-8 shadow-lg bg-custom-gold hover:bg-custom-gold/90 transition-all duration-100 ease-in-out flex items-center justify-center overflow-visible",
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
    </>
  );
}