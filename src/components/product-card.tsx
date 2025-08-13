'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productName: string, quantity: number) => void;
  quantity: number;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, quantity, onProductClick }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

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
    setIsLiked(!isLiked);
  }

  return (
    <div
      onClick={() => onProductClick(product)}
      className="bg-white text-black rounded-3xl overflow-hidden flex flex-col h-full shadow-custom-dark cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative w-full pt-[80%]">
        <Image
          src="/choco img.png"
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-3xl"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
            <button onClick={handleLikeClick} className="pl-1 py-1">
              <Heart className={cn("h-6 w-6 stroke-current", isLiked ? 'text-red-500 fill-red-500' : 'text-black')} />
            </button>
          </div>
          <p className="text-xs text-[#9A7DAB] mt-1">250g | Assorted | Hard Box</p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 line-through font-bold">₹1000</p>
          <div className="flex items-center">
            <p className="font-bold text-base">₹750</p>
            <p className="text-custom-gold text-xs font-semibold ml-2">25% OFF</p>
            <div className="flex-grow ml-2">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  onClick={handleAddToCartClick}
                  className="w-full rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white"
                >
                  Add
                </Button>
              ) : (
                <div className="flex items-center justify-center w-full rounded-full bg-custom-purple-dark text-white h-9">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDecrement}
                    className="h-full w-10 rounded-r-none rounded-l-full hover:bg-white/10 hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-bold px-2">{quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleIncrement}
                    className="h-full w-10 rounded-l-none rounded-r-full hover:bg-white/10 hover:text-white"
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
