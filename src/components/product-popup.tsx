'use client';

import { X } from 'lucide-react';
import type { Product } from '@/app/page';
import { FlavoursSection } from './flavours-section';

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
  
  // This internal handler will adapt the flavour's numeric ID to the cart's string-based key
  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    // For now, we'll use the flavourId as the key. This can be changed later.
    onAddToCart(flavourId.toString(), quantity);
  };
  
  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex flex-col">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      <div className="flex flex-row flex-grow h-full gap-4">
        <div className="w-[48%] flex flex-col gap-4 h-full items-center">
          <div className="bg-blue-500 h-1/2 rounded-lg w-2/3"></div>
          <div className="bg-red-500 rounded-lg w-full h-1/2">
            <FlavoursSection onAddToCart={handleFlavourAddToCart} cart={cart} />
          </div>
        </div>
        
        <div className="flex-grow bg-green-500 h-full rounded-lg"></div>
      </div>
    </div>
  );
}
