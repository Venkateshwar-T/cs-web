
'use client';

import type { Product, FilterState } from '@/app/page';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';

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
}: SearchViewProps) {
  return (
    <div className="flex w-full items-start flex-grow min-h-0">
      <FilterContainer 
        filters={filters} 
        onFilterChange={onFilterChange} 
        isSearching={isSearching}
      />
      <div className="h-full flex-grow ml-8 mr-8 relative min-h-0">
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
        />
      </div>
    </div>
  );
}
