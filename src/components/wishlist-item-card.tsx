// @/components/wishlist-item-card.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';

interface WishlistItemCardProps {
  product: Product;
  onAddToCart: (productName: string, quantity: number) => void;
  onUnlike: () => void;
  isInCart: boolean;
  isUnliking: boolean;
  onAnimationEnd: () => void;
  isLastItem: boolean;
  isMobile?: boolean;
}

export function WishlistItemCard({ product, onAddToCart, onUnlike, isInCart, isUnliking, onAnimationEnd, isLastItem, isMobile = false }: WishlistItemCardProps) {
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, isInCart ? 0 : 1);
  };

  if (isMobile) {
    return (
       <div 
        onAnimationEnd={onAnimationEnd}
        className={cn(
          "w-full bg-transparent p-3 text-black relative transition-all duration-300 overflow-hidden",
          !isLastItem && "border-b border-black/10",
          isUnliking && 'animate-fade-out-slide-up',
        )}
      >
        <div className="flex gap-3 items-center">
          <div className="w-1/4 h-20 flex-shrink-0 relative">
            <Image
              src="/choco img.png"
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              onDragStart={(e) => e.preventDefault()}
              data-ai-hint="chocolate box"
            />
          </div>

          <div className="flex flex-col justify-between flex-grow self-stretch min-w-0">
            <div>
              <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm leading-tight flex-1 truncate">{product.name}</h3>
                  <button onClick={onUnlike} className="p-1 flex-shrink-0">
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </button>
              </div>
              <p className="text-xs text-black/70 truncate mt-0">250g | Assorted | Hard-Box</p>
            </div>
            
            <div className="flex justify-between items-end gap-2">
                <p className="font-bold text-base text-custom-purple-dark mt-1 truncate">₹750</p>
                <Button
                  size="sm"
                  onClick={handleAddToCartClick}
                  className={cn(
                    "rounded-full uppercase border-2 border-b-[3px] h-8 px-5 text-xs transition-colors duration-300 border-custom-purple-dark flex-shrink-0",
                    isInCart
                      ? 'bg-custom-purple-dark text-white hover:bg-custom-purple-dark/90'
                      : 'bg-transparent text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white'
                  )}
                >
                  {isInCart ? 'ADDED' : 'ADD'}
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onAnimationEnd={onAnimationEnd}
      className={cn(
        "bg-white/90 p-3 text-black w-full relative transition-all duration-300 overflow-hidden rounded-2xl",
        isUnliking && 'animate-fade-out-slide-up',
      )}
    >
      <div className="flex gap-3 items-center">
        <div className="w-1/4 h-24 flex-shrink-0">
          <Image
            src="/choco img.png"
            alt={product.name}
            width={100}
            height={100}
            className="rounded-lg object-cover w-full h-full"
            onDragStart={(e) => e.preventDefault()}
            data-ai-hint="chocolate box"
          />
        </div>

        <div className="flex flex-col justify-between flex-grow self-stretch min-w-0">
          <div>
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-lg leading-tight flex-1 truncate">{product.name}</h3>
                <button onClick={onUnlike} className="p-1 flex-shrink-0">
                  <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                </button>
            </div>
            <p className="text-sm text-black/70 truncate mt-1">250g | Assorted | Hard-Box</p>
          </div>
          <div className="flex justify-between items-end gap-2">
            <p className="font-bold text-xl text-custom-purple-dark truncate">₹750</p>
            <Button
              size="sm"
              onClick={handleAddToCartClick}
              className={cn(
                "rounded-full uppercase border-2 border-b-[3px] h-9 px-6 text-sm transition-colors duration-300 border-custom-purple-dark flex-shrink-0",
                isInCart
                  ? 'bg-custom-purple-dark text-white hover:bg-custom-purple-dark/90'
                  : 'bg-transparent text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white'
              )}
            >
              {isInCart ? 'ADDED' : 'ADD'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
