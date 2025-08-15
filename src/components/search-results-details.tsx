'use client';

import { ProductCard } from "./product-card";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/app/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchResultsDetailsProps {
  query: string;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  onProductClick: (product: Product) => void;
}

export function SearchResultsDetails({ query, onAddToCart, cart, onProductClick }: SearchResultsDetailsProps) {
  const products: Product[] = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Diwali Collection Box ${i + 1}`,
  }));

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sortOption, setSortOption] = useState("featured");

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  

  return (
    <div className="bg-[#5D2B79] h-full flex-grow rounded-t-[40px] relative">
        <div className="bg-white/20 h-full w-full rounded-t-[40px] pt-8 pl-8">
            <div 
                ref={scrollContainerRef}
                className={cn(
                "h-full overflow-y-auto custom-scrollbar pr-8 pb-8",
                isScrolling && "is-scrolling"
                )}
            >
                <div className="flex justify-between items-center text-white mb-6">
                  <h2 className="text-xl">
                    Showing results for <span className="italic text-custom-gold">{query}</span>
                  </h2>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[220px] rounded-full bg-white text-custom-purple-dark border-2 border-custom-purple-dark focus:ring-custom-gold h-9">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    quantity={cart[product.name] || 0}
                    onProductClick={onProductClick}
                    />
                ))}
                </div>
            </div>
        </div>
    </div>
  );
}
