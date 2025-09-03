
'use client';

import type { Product, FilterState } from '@/app/page';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';
import { cn } from '@/lib/utils';

interface SearchViewProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  isSearching: boolean;
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
  return (
    <div className="flex w-full items-start flex-grow min-h-0">
      <div className="hidden md:block md:w-[17%] h-full">
        <FilterContainer 
          filters={filters} 
          onFilterChange={onFilterChange} 
          isSearching={isSearching}
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
