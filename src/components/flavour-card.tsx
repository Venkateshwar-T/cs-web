
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
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
    onAddToCart(flavour.id, 1);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1000); // Duration of the animation
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(flavour.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(flavour.id, quantity - 1);
  };

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
        <div className="mt-2 flex justify-center px-2 h-7 relative overflow-hidden">
            {quantity === 0 ? (
                <Button
                    size="sm"
                    onClick={handleAddToCartClick}
                    className={cn(
                        "h-7 w-full rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark bg-white hover:bg-custom-purple-dark hover:text-white text-xs transition-transform duration-300",
                        showAdded ? '-translate-y-full' : 'translate-y-0'
                    )}
                >
                    Add
                </Button>
            ) : (
                <div className="flex items-center justify-center w-full rounded-full bg-custom-purple-dark text-white h-7">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleDecrement}
                        className="h-full w-8 rounded-r-none rounded-l-full hover:bg-white/10 hover:text-white"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold px-1 text-sm">{quantity}</span>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleIncrement}
                        className="h-full w-8 rounded-l-none rounded-r-full hover:bg-white/10 hover:text-white"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {showAdded && (
                 <div className="absolute inset-0 flex items-center justify-center text-custom-purple-dark font-bold text-xs animate-slide-up-and-fade-in-out">
                    Added
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
