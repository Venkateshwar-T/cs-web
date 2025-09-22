
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { SanityFlavour } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlavourCardProps {
  flavour: SanityFlavour;
  onAddToCart: () => void;
  quantity: number;
}

export function FlavourCard({ flavour, onAddToCart, quantity }: FlavourCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();

  const handleToggleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isInCart = quantity > 0;
    onAddToCart();
    if (!isInCart) {
      setIsAnimating(true);
    }
  };

  const isInCart = quantity > 0;

  return (
    <div 
      className={cn(
        "flex flex-col justify-center bg-white/30 p-2 rounded-[10px] w-28 md:py-7 md:px-2 lg:p-3 md:rounded-[5px] lg:rounded-[20px] w-[calc(38%-0.75rem)] md:w-[calc(40%-0.75rem)] lg:w-[calc(35%-0.75rem)] xl:w-[calc(25%-0.75rem)] flex-shrink-0 transition-transform duration-200",
        isAnimating && 'animate-pop'
      )}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      <div className="relative w-full aspect-square">
        <Image
          src={flavour.imageUrl}
          alt={flavour.name}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
          data-ai-hint={flavour.name}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-white text-xs md:text-sm font-normal h-10 flex items-center justify-center">{flavour.name}</p>
        <div className="mt-2 flex justify-center px-2 h-7 relative">
          <Button
            size="sm"
            onClick={handleToggleCart}
            className={cn(
              "h-7 w-full rounded-[10px] md:rounded-full uppercase border-2 border-b-[3px] text-xs transition-colors duration-300",
              isInCart 
                ? 'bg-custom-purple-dark border-custom-purple-dark text-white'
                : 'bg-white border-custom-purple-dark text-custom-purple-dark',
              !isMobile && (isInCart ? 'hover:bg-custom-purple-dark/90' : 'hover:bg-custom-purple-dark hover:text-white')
            )}
          >
            {isInCart ? 'Added' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
