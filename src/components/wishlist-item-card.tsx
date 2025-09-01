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
}

export function WishlistItemCard({ product, onAddToCart, onUnlike, isInCart }: WishlistItemCardProps) {
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, isInCart ? 0 : 1);
  };

  return (
    <div className="bg-white/90 text-black rounded-2xl p-4 flex gap-4 w-full relative border border-white/30">
      <div className="w-24 h-24 flex-shrink-0">
        <Image
          src="/choco img.png"
          alt={product.name}
          width={100}
          height={100}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-bold text-lg leading-tight pr-8">{product.name}</h3>
          <p className="text-sm text-black/70">250g | Assorted | Hard-Box</p>
        </div>
        <p className="font-bold text-2xl text-custom-purple-dark mt-2">₹750</p>
      </div>

      <div className="absolute top-4 right-4">
        <button onClick={onUnlike} className="p-1">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        </button>
      </div>

      <div className="absolute bottom-4 right-4">
        <Button
          size="sm"
          onClick={handleAddToCartClick}
          className={cn(
            "w-full rounded-full uppercase border-2 border-b-[3px] h-9 px-6 text-xs transition-colors duration-300",
            isInCart
              ? 'bg-custom-gold border-custom-gold text-custom-purple-dark hover:bg-custom-gold/90'
              : 'bg-transparent border-custom-gold text-custom-purple-dark hover:bg-custom-gold hover:text-custom-purple-dark'
          )}
        >
          {isInCart ? 'ADDED' : 'ADD'}
        </Button>
      </div>
    </div>
  );
}
