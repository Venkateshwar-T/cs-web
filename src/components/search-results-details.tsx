
'use client';

import { ProductCard } from "./product-card";
import { useEffect, useRef, type UIEvent } from "react";
import { cn } from "@/lib/utils";
import type { Product, FilterState } from "@/app/page";
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

interface SearchResultsDetailsProps {
  products: Product[];
  query: string;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  onProductClick: (product: Product) => void;
  activeFilters: { type: keyof FilterState, value: string, label: string }[];
  onRemoveFilter: (filterType: keyof FilterState, value: string) => void;
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  isSearching: boolean;
  sortOption: string;
  onSortChange: (value: string) => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  isFilterSheetOpen: boolean;
  onFilterSheetOpenChange: (open: boolean) => void;
  isSortSheetOpen: boolean;
  onSortSheetOpenChange: (open: boolean) => void;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
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
  query, 
  onAddToCart, 
  cart, 
  onProductClick, 
  activeFilters, 
  onRemoveFilter, 
  likedProducts, 
  onLikeToggle,
  isSearching,
  sortOption,
  onSortChange,
  filters,
  onFilterChange,
  isFilterSheetOpen,
  onFilterSheetOpenChange,
  isSortSheetOpen,
  onSortSheetOpenChange,
  onScroll,
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
          <div className="bg-white/20 h-full w-full rounded-t-[20px] md:rounded-t-[40px] pt-4 md:pt-6 flex flex-col">
              {/* Header section - now separate and non-scrolling */}
              <div className="flex-shrink-0 px-4 md:pb-4 md:px-8">
                {/* Mobile Header and Filters */}
                <div className="md:hidden">
                  <div>
                    <div className="flex justify-between items-center text-white">
                      <h2 className="text-sm">
                        Showing results for <span className="italic text-custom-gold">{query}</span>
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
                                  onFilterChange={onFilterChange}
                                  isMobile={true}
                                />
                            </SheetContent>
                        </Sheet>
                        <Sheet open={isSortSheetOpen} onOpenChange={onSortSheetOpenChange}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-custom-gold hover:text-custom-purple-dark">
                                  <ArrowUpDown className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-auto p-0">
                                <SheetHeader className="p-4 border-b border-white/20">
                                    <SheetTitle className="text-white text-center">Sort By</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-2 p-4">
                                  {sortOptions.map(option => (
                                      <Button
                                        key={option.value}
                                        variant="ghost"
                                        onClick={() => onSortChange(option.value)}
                                        className={cn(
                                          "w-full justify-start text-lg py-6",
                                          sortOption === option.value && "bg-white/20"
                                        )}
                                      >
                                        {option.label}
                                      </Button>
                                  ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                    {activeFilters.length > 0 && (
                      <div className="flex gap-2 mt-1 flex-nowrap overflow-x-auto no-scrollbar md:flex-wrap md:overflow-x-visible">
                        {activeFilters.map(filter => (
                          <div key={`${filter.type}-${filter.value}`} className="flex-shrink-0 flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-2.5 py-0.5 text-xs font-medium md:px-3 md:py-1 md:text-sm">
                            <span>{filter.label}</span>
                            <button
                              onClick={() => onRemoveFilter(filter.type, filter.value)}
                              className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 md:ml-2 md:-mr-1.5 md:p-1"
                            >
                              <X className="h-3 w-3 md:h-4 md:w-4" />
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
                    Showing results for <span className="italic text-custom-gold">{query}</span>
                  </h2>
                  <Select value={sortOption} onValueChange={onSortChange}>
                    <SelectTrigger className="w-full md:w-[220px] rounded-full bg-white text-custom-purple-dark border-2 border-custom-purple-dark h-8 md:h-9 focus:ring-0 focus:ring-offset-0 text-xs md:text-sm">
                      <SelectValue>
                        Sort By: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1).replace(/-/g, ' ')}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white text-custom-purple-dark">
                        {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {activeFilters.length > 0 && (
                  <div className="hidden md:flex gap-2 mt-4 flex-nowrap overflow-x-auto no-scrollbar md:flex-wrap md:overflow-x-visible">
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
                  className="flex-grow h-full overflow-y-auto custom-scrollbar pb-8 min-h-0 px-4 md:px-8"
              >
                {/* Unified Product Grid for all screen sizes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {isSearching 
                    ? Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)
                    : products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={onAddToCart}
                          quantity={cart[product.name] || 0}
                          onProductClick={onProductClick}
                          isLiked={!!likedProducts[product.id]}
                          onLikeToggle={() => onLikeToggle(product.id)}
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
