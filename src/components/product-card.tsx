
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';
import { SparkleIcon } from './sparkle-icon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productName: string, quantity: number) => void;
  quantity: number;
  onProductClick: (product: Product) => void;
  isLiked: boolean;
  onLikeToggle: () => void;
}

export function ProductCard({ product, onAddToCart, quantity, onProductClick, isLiked, onLikeToggle }: ProductCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [likeClickCount, setLikeClickCount] = useState(0);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, quantity - 1);
  };
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeClickCount(prev => prev + 1);
    onLikeToggle();
    if (!isLiked) {
        setIsAnimating(true);
    }
  }

  return (
    <div
      onClick={() => onProductClick(product)}
      className="bg-white text-black rounded-lg md:rounded-2xl overflow-hidden flex flex-col h-full shadow-custom-dark cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative w-full pt-[80%]">
        <Image
          src="/choco img.png"
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg md:rounded-t-2xl"
        />
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        <div className="flex-grow md:flex-grow-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm md:text-base leading-tight flex-1 pr-2 whitespace-nowrap truncate">{product.name}</h3>
            <div className="relative">
              <button onClick={handleLikeClick} className="pl-1 py-1">
                <Heart 
                  key={likeClickCount}
                  className={cn(
                    "h-5 w-5 md:h-6 md:w-6 stroke-current transition-colors duration-300", 
                    isLiked ? 'text-red-500 fill-red-500' : 'text-black',
                    'animate-heart-pop'
                  )} 
                />
              </button>
              {isAnimating && (
                  <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      onAnimationEnd={() => setIsAnimating(false)}
                  >
                      {Array.from({ length: 6 }).map((_, i) => (
                          <div 
                              key={i}
                              className="absolute"
                              style={{
                                  transform: `rotate(${i * 60}deg) translateY(-25px)`,
                              }}
                          >
                              <div className="animate-sparkle-pulse">
                                  <SparkleIcon className="text-red-500 animate-sparkle-fade-out" />
                              </div>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
          <p className="text-xs md:text-sm text-[#9A7DAB] mt-1 whitespace-nowrap truncate">250g | Assorted | Hard Box</p>
        </div>
        <div className="mt-2 md:mt-4">
          <p className="text-xs text-gray-500 line-through font-bold">₹1000</p>
          <div className="flex items-center">
            <p className="font-bold text-sm md:text-base">₹750</p>
            <p className="text-custom-gold text-xs font-semibold ml-2">25% OFF</p>
            <div className="flex-grow ml-2">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  onClick={handleAddToCartClick}
                  className="w-full rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white h-8 text-xs"
                >
                  Add
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full rounded-full text-white h-8 border-2 border-custom-purple-dark overflow-hidden">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDecrement}
                    className="h-full rounded-none bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white hover:text-white flex-shrink-0 px-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center bg-white text-custom-purple-dark">
                    <span className="font-bold px-1 text-sm">{quantity}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleIncrement}
                    className="h-full rounded-none bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white hover:text-white flex-shrink-0 px-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
