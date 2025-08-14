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
    <div className="bg-white/20 p-2 rounded-[20px] w-[calc(22%-0.75rem)] flex-shrink-0">
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
        <p className="text-white text-sm font-semibold h-10 flex items-center justify-center">{flavour.name}</p>
        <div className="mt-2 flex justify-center px-2">
            {quantity === 0 ? (
                <Button
                    size="sm"
                    onClick={handleAddToCartClick}
                    className="h-8 w-full rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark bg-white hover:bg-custom-purple-dark hover:text-white text-xs"
                >
                    Add
                </Button>
            ) : (
                <div className="flex items-center justify-center w-full rounded-full bg-custom-purple-dark text-white h-8">
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
        </div>
      </div>
    </div>
  );
}
