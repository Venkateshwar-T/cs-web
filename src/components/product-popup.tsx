'use client';

import { X } from 'lucide-react';
import type { Product } from '@/app/page';
import { ImageGallery } from './image-gallery';
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

  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    // This can be expanded later to handle flavour-specific cart logic
    console.log(`Added flavour ${flavourId}, quantity ${quantity}`);
  };

  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      {/* Main container for image gallery and product details */}
      <div className="w-full flex items-start gap-8">

        {/* Left column for image gallery and flavours */}
        <div className="w-2/5 flex flex-col gap-4">
            <ImageGallery product={product} />
            <FlavoursSection onAddToCart={handleFlavourAddToCart} cart={{}} />
        </div>
        
        {/* Right Side for future content */}
        <div className="w-3/5 h-full">
          {/* Content will go here */}
        </div>
      </div>
    </div>
  );
}
