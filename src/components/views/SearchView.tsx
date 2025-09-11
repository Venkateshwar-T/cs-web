
// src/components/views/SearchView.tsx
'use client';

import { useRef, useEffect, type UIEvent } from 'react';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';
import { cn } from '@/lib/utils';
import type { SanityProduct, StructuredFilter } from '@/types'; // Use real types from Sanity

// The props interface is updated to use the new data types
interface SearchViewProps {
  filters: StructuredFilter[];
  products: SanityProduct[];
  query: string;
  isSearching: boolean;
  isNewSearch: boolean;
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
  // Pass down the interactive props needed by child components
  onProductClick: (product: SanityProduct) => void;
  cart: Record<string, number>;
  likedProducts: Record<string, boolean>; // Sanity ID (_id) is a string
  onLikeToggle: (productId: string) => void;
  onAddToCart: (productName: string, quantity: number) => void;
}

export function SearchView({
  filters,
  products,
  query,
  isSearching,
  isNewSearch,
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
}: SearchViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only scroll to top if it's a new search, not just a filter change
    if (isNewSearch && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isNewSearch]);

  return (
    <div className="flex w-full items-start h-full flex-grow min-h-0">
      <div className="hidden md:block w-full md:w-auto md:sticky md:top-0 md:w-[17%] h-full">
        {/* The FilterContainer for desktop now receives the live filter data */}
        <FilterContainer 
          filters={filters} 
        />
      </div>
      <div className={cn("h-full flex-grow md:ml-8 md:mr-8 relative min-h-0 w-full md:w-auto px-4 md:px-0")}>
        {/* SearchResultsDetails receives the products and all interactive props */}
        <SearchResultsDetails 
          products={products}
          query={query} 
          isSearching={isSearching}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
          sortOption={sortOption}
          onSortChange={onSortChange}
          isFilterSheetOpen={isFilterSheetOpen}
          onFilterSheetOpenChange={onFilterSheetOpenChange}
          isSortSheetOpen={isSortSheetOpen}
          onSortSheetOpenChange={onSortSheetOpenChange}
          onScroll={onScroll}
          isMobile={isMobile}
          onProductClick={onProductClick}
          cart={cart}
          likedProducts={likedProducts}
          onLikeToggle={onLikeToggle}
          onAddToCart={onAddToCart}
          // The FilterContainer for mobile is rendered inside SearchResultsDetails, so it also needs the filters
          filters={filters}
        />
      </div>
    </div>
  );
}
