'use client';

import { X } from 'lucide-react';
import type { Product } from '@/app/page';

// The Flavour type is no longer needed as FlavoursSection is removed.
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
  // All internal components and logic have been removed as requested.
  // The popup now provides a clean container.
  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex flex-col">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      {/* The content area of the popup is now a flex container for the three boxes */}
      <div className="flex flex-row flex-grow h-full gap-4">
        {/* Left Column (1/3 width), which contains the top and bottom boxes */}
        <div className="w-1/3 flex flex-col gap-4 h-full">
          {/* 1. Top Left Box (Blue) */}
          <div className="bg-blue-500 h-1/2 rounded-lg"></div>
          {/* 2. Bottom Left Box (Red) */}
          <div className="bg-red-500 h-1/2 rounded-lg"></div>
        </div>
        
        {/* Right Column (2/3 width) */}
        {/* 3. Right Box (Green) */}
        <div className="w-2/3 bg-green-500 h-full rounded-lg"></div>
      </div>
    </div>
  );
}
