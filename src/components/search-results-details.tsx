'use client';

import { ProductCard } from "./product-card";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/app/page";
import { ProductPopup } from "./product-popup";

interface SearchResultsDetailsProps {
  query: string;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  onProductClick: (product: Product) => void;
  selectedProduct: Product | null;
  onClosePopup: () => void;
}

export function SearchResultsDetails({ query, onAddToCart, cart, onProductClick, selectedProduct, onClosePopup }: SearchResultsDetailsProps) {
  const products: Product[] = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Diwali Collection Box ${i + 1}`,
  }));

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="bg-[#5D2B79] h-full flex-grow rounded-t-[40px] ml-12 mr-8 relative">
        <div className="bg-white/20 h-full w-full rounded-t-[40px] pt-8 pl-8">
            <div 
                ref={scrollContainerRef}
                className={cn(
                "h-full overflow-y-auto custom-scrollbar pr-8 pb-8",
                isScrolling && "is-scrolling"
                )}
            >
                <h2 className="text-xl text-white mb-6">
                Showing results for <span className="italic text-custom-gold">{query}</span>
                </h2>
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
        {selectedProduct && (
          <ProductPopup 
            product={selectedProduct} 
            onClose={onClosePopup} 
          />
        )}
    </div>
  );
}
