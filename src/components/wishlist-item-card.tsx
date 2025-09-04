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
}

export function WishlistItemCard({ product, onAddToCart, onUnlike, isInCart, isUnliking, onAnimationEnd, isLastItem }: WishlistItemCardProps) {
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, isInCart ? 0 : 1);
  };

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
          />
        </div>

        <div className="flex flex-col justify-between flex-grow self-stretch">
          <div>
            <h3 className="font-bold text-lg leading-tight pr-8">{product.name}</h3>
            <p className="text-sm text-black/70">250g | Assorted | Hard-Box</p>
          </div>
          <p className="font-bold text-xl text-custom-purple-dark">₹750</p>
        </div>

        <div className="absolute top-2 right-3">
          <button onClick={onUnlike} className="p-1">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          </button>
        </div>

        <div className="absolute bottom-3 right-3">
          <Button
            size="sm"
            onClick={handleAddToCartClick}
            className={cn(
              "rounded-full uppercase border-2 border-b-[3px] h-9 px-6 text-sm transition-colors duration-300 border-custom-purple-dark",
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
  );
}
