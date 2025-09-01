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
}

export function WishlistItemCard({ product, onAddToCart, onUnlike }: WishlistItemCardProps) {
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, 1);
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
          className="w-full rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white h-9 px-6 text-xs"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
