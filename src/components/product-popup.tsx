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
    <div className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      {/* The content area of the popup is now empty. */}
      
    </div>
  );
}
