
'use client';

import { ProductCard } from "./product-card";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Product, FilterState } from "@/app/page";
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductCardSkeleton } from "./product-card-skeleton";

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
}

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
  onSortChange
}: SearchResultsDetailsProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isSearching && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isSearching]);

  return (
    <div className="bg-[#5D2B79] h-full flex-grow rounded-t-[40px] relative">
        <div className="bg-white/20 h-full w-full rounded-t-[40px] pt-4 md:pt-8 pl-4 md:pl-8">
            <div 
                ref={scrollContainerRef}
                className="h-full overflow-y-auto custom-scrollbar pr-4 md:pr-8 pb-8"
            >
                <div className={cn(
                    "flex flex-col md:flex-row justify-between md:items-center text-white mb-2",
                    activeFilters.length === 0 && 'mb-4'
                )}>
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
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
                      <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
                      <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                      <SelectItem value="best-sellers">Best Sellers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.map(filter => (
                      <div key={`${filter.type}-${filter.value}`} className="flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-3 py-1 text-sm font-medium">
                        <span>{filter.label}</span>
                        <button
                          onClick={() => onRemoveFilter(filter.type, filter.value)}
                          className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-black/10"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
  );
}
