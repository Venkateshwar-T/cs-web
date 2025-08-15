
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Flavour } from './product-popup';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FlavourCardProps {
  flavour: Flavour;
  onAddToCart: (flavourId: number, quantity: number) => void;
  quantity: number;
}

export function FlavourCard({ flavour, onAddToCart, quantity }: FlavourCardProps) {
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity === 0) {
      onAddToCart(flavour.id, 1);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 1000);
    }
  };

  const handleRemoveFromCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(flavour.id, 0);
  };

  const isInCart = quantity > 0;

  return (
    <div className="flex flex-col justify-center bg-white/30 p-3 rounded-[20px] w-[calc(25%-0.75rem)] h-[100%] flex-shrink-0">
      <div className="relative w-full aspect-square">
        <Image
          src={flavour.src}
          alt={flavour.name}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
          data-ai-hint={flavour.hint}
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-white text-sm font-normal h-10 flex items-center justify-center">{flavour.name}</p>
        <div className="mt-2 flex justify-center px-2 h-7 relative">
          <Button
            size="sm"
            onClick={isInCart ? handleRemoveFromCartClick : handleAddToCartClick}
            className={cn(
              "h-7 w-full rounded-full uppercase border-2 border-b-[3px] text-xs transition-colors duration-300",
              isInCart 
                ? 'bg-custom-purple-dark border-custom-purple-dark text-white hover:bg-transparent hover:text-custom-purple-dark'
                : 'bg-white border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white'
            )}
          >
            {isInCart ? 'Remove' : 'Add'}
          </Button>
          {showAdded && (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center text-custom-purple-dark font-bold text-xs animate-slide-up-and-out">
              Added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
