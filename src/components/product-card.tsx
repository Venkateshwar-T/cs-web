'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ProductCard() {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    setQuantity(1);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="bg-white text-black rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[100%]">
        <Image
          src="https://placehold.co/600x600.png"
          alt="Diwali Collection Box"
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
          data-ai-hint="gift box"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base leading-tight">Diwali Collection Box</h3>
            <button onClick={() => setIsLiked(!isLiked)} className="p-1">
              <Heart className={cn("h-6 w-6 stroke-current", isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400')} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">250g | Assorted | Hard Box</p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 line-through">₹1000</p>
          <div className="flex items-center">
            <p className="font-bold text-base">₹750</p>
            <p className="text-custom-gold text-xs font-semibold ml-2">25% OFF</p>
            <div className="flex-grow ml-2">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="w-full rounded-full uppercase border-2 border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white"
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
