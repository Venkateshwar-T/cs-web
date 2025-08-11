'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  productName: string;
  onAddToCart: (productName: string, quantity: number) => void;
  quantity: number;
}

export function ProductCard({ productName, onAddToCart, quantity }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(productName, 1);
  };

  const handleIncrement = () => {
    onAddToCart(productName, quantity + 1);
  };

  const handleDecrement = () => {
    onAddToCart(productName, quantity - 1);
  };

  return (
    <div className="bg-white text-black rounded-3xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[80%]">
        <Image
          src="https://placehold.co/600x600.png"
          alt={productName}
          layout="fill"
          objectFit="cover"
          className="rounded-t-3xl"
          data-ai-hint="gift box"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg leading-tight">{productName}</h3>
            <button onClick={() => setIsLiked(!isLiked)} className="pl-1 py-1">
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
