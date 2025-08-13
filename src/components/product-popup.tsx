'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import type { Product } from '@/app/page';
import { useState } from 'react';

export type Flavour = {
  id: number;
  name: string;
  src: string;
  hint: string;
};

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
}

export function ProductPopup({ product, onClose, onAddToCart, cart }: ProductPopupProps) {
  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      <div className="w-full flex items-start gap-8">
        <div className="flex w-1/3 gap-2">
            {/* Left side with the main, square image */}
            <div className="w-4/5">
              <div className="relative w-full aspect-square">
                  <Image
                      src="https://placehold.co/600x600.png"
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-3xl"
                      data-ai-hint="chocolate box"
                  />
              </div>
            </div>

            {/* Right side with 4 smaller images */}
            <div className="w-1/5 flex flex-col justify-between">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="relative w-full aspect-square">
                        <Image
                            src="https://placehold.co/200x200.png"
                            alt={`Thumbnail ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            data-ai-hint="chocolate"
                        />
                    </div>
                ))}
            </div>
        </div>
        
        {/* Right side content */}
        <div className="w-2/3 h-full">
          {/* Content for the right side will go here later */}
        </div>
      </div>
    </div>
  );
}
