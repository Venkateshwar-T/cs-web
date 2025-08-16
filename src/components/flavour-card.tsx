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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isInCart = quantity > 0;
    onAddToCart(flavour.id, isInCart ? 0 : 1);
    if (!isInCart) {
      setIsAnimating(true);
    }
  };

  const isInCart = quantity > 0;

  return (
    <div 
      className={cn(
        "flex flex-col justify-center bg-white/30 md:py-7 md:px-2 lg:p-3 md:rounded-[5px] lg:rounded-[20px] md:w-[calc(40%-0.75rem)] lg:w-[calc(35%-0.75rem)] xl:w-[calc(25%-0.75rem)] h-[100%] flex-shrink-0 transition-transform duration-200",
        isAnimating && 'animate-pop'
      )}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      <div className="relative lg:w-full aspect-square">
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
            onClick={handleToggleCart}
            className={cn(
              "h-7 w-full rounded-full uppercase border-2 border-b-[3px] text-xs transition-colors duration-300",
              isInCart 
                ? 'bg-custom-purple-dark border-custom-purple-dark text-white hover:bg-transparent hover:text-white'
                : 'bg-white border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white'
            )}
          >
            {isInCart ? 'Added' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
