// @/components/flavour-card.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import type { Flavour } from './product-popup';

interface FlavourCardProps {
  flavour: Flavour;
  onAddToCart: (flavourId: number, quantity: number) => void;
  quantity: number;
}

export function FlavourCard({ flavour, onAddToCart, quantity }: FlavourCardProps) {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(flavour.id, 1);
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
    // MODIFIED: Reduced padding from p-2 to a tighter p-1
    <div className="bg-white/20 p-1.5 rounded-2xl flex-shrink-0 w-[calc(25%-0.75rem)]">
      <div className="relative w-full aspect-square">
        <Image
          src={flavour.src}
          alt={flavour.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          data-ai-hint={flavour.hint}
        />
      </div>
      {/* MODIFIED: Reduced margin-top from mt-2 to mt-1 */}
      <div className="mt-1 text-center">
        <p className="text-white text-sm font-semibold truncate">{flavour.name}</p>
        {/* MODIFIED: Reduced margin-top from mt-2 to mt-1.5 */}
        <div className="mt-1.5">
            {quantity === 0 ? (
                <Button
                    size="sm"
                    onClick={handleAddToCartClick}
                    // MODIFIED: Reduced button height from h-8 to h-7
                    className="w-full h-7 rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark bg-white hover:bg-custom-purple-dark hover:text-white text-xs"
                >
                    Add
                </Button>
            ) : (
                // MODIFIED: Reduced quantity selector height from h-8 to h-7
                <div className="flex items-center justify-center w-full rounded-full bg-custom-purple-dark text-white h-7">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleDecrement}
                        // MODIFIED: Adjusted child button height and width
                        className="h-full w-7 rounded-r-none rounded-l-full hover:bg-white/10 hover:text-white"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold px-1 text-sm">{quantity}</span>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleIncrement}
                        // MODIFIED: Adjusted child button height and width
                        className="h-full w-7 rounded-l-none rounded-r-full hover:bg-white/10 hover:text-white"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}