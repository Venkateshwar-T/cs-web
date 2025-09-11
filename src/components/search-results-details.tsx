// src/components/search-results-details.tsx
'use client';

import { ProductCard } from "./product-card";
import { useEffect, useRef, type UIEvent } from "react";
import { cn } from "@/lib/utils";
import { X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from "./product-card-skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterContainer } from "./filter-container";
import type { SanityProduct, StructuredFilter } from '@/types'; // CHANGED: Use real types

// CHANGED: The props interface is updated to use the new data types
interface SearchResultsDetailsProps {
  products: SanityProduct[];
  filters: StructuredFilter[];
  query: string;
  isSearching: boolean;
  activeFilters: { type: string; value: string; label: string }[];
  onRemoveFilter: (filterType: string, value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  isFilterSheetOpen: boolean;
  onFilterSheetOpenChange: (open: boolean) => void;
  isSortSheetOpen: boolean;
  onSortSheetOpenChange: (open: boolean) => void;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  isMobile: boolean;
  onProductClick: (product: SanityProduct) => void;
  cart: Record<string, number>;
  likedProducts: Record<string, boolean>;
  onLikeToggle: (productId: string) => void;
  onAddToCart: (productName: string, quantity: number) => void;
}

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low-to-high", label: "Price: Low to High" },
    { value: "price-high-to-low", label: "Price: High to Low" },
    { value: "new-arrivals", label: "New Arrivals" },
    { value: "best-sellers", label: "Best Sellers" },
];

export function SearchResultsDetails({ 
  products,
  filters,
  query, 
  isSearching,
  activeFilters, 
  onRemoveFilter, 
  sortOption,
  onSortChange,
  isFilterSheetOpen,
  onFilterSheetOpenChange,
  isSortSheetOpen,
  onSortSheetOpenChange,
  onScroll,
  isMobile,
  onProductClick, 
  cart, 
  likedProducts, 
  onLikeToggle,
  onAddToCart, 
}: SearchResultsDetailsProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isSearching && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isSearching]);

  return (
    <>
      <div className="bg-[#5D2B79] h-full rounded-t-[20px] md:rounded-t-[40px] relative mt-0 min-h-0 flex flex-col">
          <div className="bg-white/20 h-full w-full rounded-t-[20px] md:rounded-t-[40px] pt-3 mt-3 md:mt-0 md:pt-6 flex flex-col">
              {/* Header section - now separate and non-scrolling */}
              <div className="flex-shrink-0 px-4 md:pb-4 md:px-8">
                {/* Mobile Header and Filters */}
                <div className="md:hidden">
                  <div>
                    <div className="flex justify-between items-center text-white">
                      <h2 className="text-sm">
                        Showing {products.length} results for <span className="italic text-custom-gold">{query || 'all products'}</span>
                      </h2>
                      <div className="flex items-center gap-2">
                        <Sheet open={isFilterSheetOpen} onOpenChange={onFilterSheetOpenChange}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-custom-gold hover:text-custom-purple-dark">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-auto p-0">
                                <SheetHeader className="p-4 border-b border-white/20">
                                    <SheetTitle className="text-white text-center">Filters and Sorting</SheetTitle>
                                </SheetHeader>
                                <FilterContainer 
                                  filters={filters}
                                  isMobile={true}
                                />
                            </SheetContent>
                        </Sheet>
                        {/* ... your mobile sort sheet ... */}
                      </div>
                    </div>
                    {activeFilters.length > 0 && (
                      <div className="flex gap-2 mt-1 flex-nowrap overflow-x-auto no-scrollbar">
                        {activeFilters.map(filter => (
                          <div key={`${filter.type}-${filter.value}`} className="flex-shrink-0 flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-2.5 py-0.5 text-xs font-medium">
                            <span>{filter.label}</span>
                            <button
                              onClick={() => onRemoveFilter(filter.type, filter.value)}
                              className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-black/10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-b border-white/20 my-4 md:hidden" />
                </div>
                
                {/* Desktop Header */}
                <div className="hidden md:flex flex-col md:flex-row justify-between md:items-center text-white">
                  <h2 className="text-lg md:text-xl mb-2 md:mb-0">
                    Showing {products.length} results for <span className="italic text-custom-gold">{query || 'all products'}</span>
                  </h2>
                  {/* ... your desktop sort select ... */}
                </div>
                {activeFilters.length > 0 && (
                  <div className="hidden md:flex gap-2 mt-4 flex-nowrap overflow-x-auto no-scrollbar">
                     {activeFilters.map(filter => (
                          <div key={`${filter.type}-${filter.value}`} className="flex-shrink-0 flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-3 py-1 text-sm font-medium">
                            <span>{filter.label}</span>
                            <button
                              onClick={() => onRemoveFilter(filter.type, filter.value)}
                              className="ml-2 -mr-1.5 p-1 rounded-full hover:bg-black/10"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                  </div>
                )}
              </div>

              {/* Scrollable grid section */}
              <div 
                  ref={scrollContainerRef}
                  onScroll={onScroll}
                  className="flex-grow h-full overflow-y-auto custom-scrollbar pt-0 md:pt-4 pb-8 min-h-0 px-4 md:px-8"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {isSearching 
                    ? Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)
                    : products.map((product) => (
                        <ProductCard
                          key={product._id} // CHANGED: Use Sanity's unique ID
                          product={product}
                          onAddToCart={onAddToCart}
                          quantity={cart[product.name] || 0}
                          onProductClick={onProductClick}
                          isLiked={!!likedProducts[product._id]}
                          onLikeToggle={() => onLikeToggle(product._id)}
                          isMobile={isMobile}
                        />
                    ))
                  }
                </div>
              </div>
          </div>
      </div>
    </>
  );
}
