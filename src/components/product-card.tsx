'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ProductCard() {
  const [isLiked, setIsLiked] = useState(false);

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
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center">
              <p className="font-bold text-base mr-1">₹750</p>
              <p className="text-custom-gold text-xs font-semibold">25% OFF</p>
            </div>
            <Button
              size="sm"
              className="rounded-full uppercase bg-transparent border border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white flex-grow ml-auto"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
