

'use client';

import { useRef, useEffect } from 'react';
import type { Product, FilterState } from '@/app/page';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';
import { cn } from '@/lib/utils';

interface SearchViewProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  isSearching: boolean;
  isNewSearch: boolean;
  products: Product[];
  query: string;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  onProductClick: (product: Product) => void;
  activeFilters: { type: keyof FilterState; value: string; label: string }[];
  onRemoveFilter: (filterType: keyof FilterState, value: string) => void;
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  isFilterSheetOpen: boolean;
  onFilterSheetOpenChange: (open: boolean) => void;
  isSortSheetOpen: boolean;
  onSortSheetOpenChange: (open: boolean) => void;
}

export function SearchView({
  filters,
  onFilterChange,
  isSearching,
  isNewSearch,
  products,
  query,
  onAddToCart,
  cart,
  onProductClick,
  activeFilters,
  onRemoveFilter,
  likedProducts,
  onLikeToggle,
  sortOption,
  onSortChange,
  isFilterSheetOpen,
  onFilterSheetOpenChange,
  isSortSheetOpen,
  onSortSheetOpenChange,
}: SearchViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only scroll to top if it's a new search, not just a filter change
    if (isNewSearch && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isNewSearch]);

  return (
    <div ref={scrollContainerRef} className="flex w-full items-start flex-grow min-h-0 overflow-y-auto custom-scrollbar">
      <div className="hidden md:block w-full md:w-auto md:sticky md:top-0 md:w-[17%] h-full">
        <FilterContainer 
          filters={filters} 
          onFilterChange={onFilterChange}
        />
      </div>
      <div className={cn("h-full flex-grow md:ml-8 md:mr-8 relative min-h-0 w-full md:w-auto")}>
        <SearchResultsDetails 
          products={products}
          query={query} 
          onAddToCart={onAddToCart} 
          cart={cart}
          onProductClick={onProductClick}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
          likedProducts={likedProducts}
          onLikeToggle={onLikeToggle}
          isSearching={isSearching}
          sortOption={sortOption}
          onSortChange={onSortChange}
          filters={filters}
          onFilterChange={onFilterChange}
          isFilterSheetOpen={isFilterSheetOpen}
          onFilterSheetOpenChange={onFilterSheetOpenChange}
          isSortSheetOpen={isSortSheetOpen}
          onSortSheetOpenChange={onSortSheetOpenChange}
        />
      </div>
    </div>
  );
}

    