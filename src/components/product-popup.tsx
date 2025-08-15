'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '@/app/page';
import { FlavoursSection } from './flavours-section';
import { ImageGallery } from './image-gallery';
import { ProductDetails } from './product-details';
import { Separator } from './ui/separator';
import { ProductPopupFooter } from './product-popup-footer';

export type Flavour = {
  id: number;
  name: string;
  src: string;
  hint: string;
};

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
  onImageExpandChange: (isExpanded: boolean) => void;
  isLiked: boolean;
  onLikeToggle: () => void;
}

export function ProductPopup({ product, onClose, onImageExpandChange, isLiked, onLikeToggle }: ProductPopupProps) {
  const [flavourCart, setFlavourCart] = useState<Record<string, number>>({});
  
  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    const newFlavourCart = { ...flavourCart, [flavourId.toString()]: quantity };
    if (quantity <= 0) {
      delete newFlavourCart[flavourId.toString()];
    }
    setFlavourCart(newFlavourCart);
  };
  
  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] pt-6 px-8 text-white h-full overflow-hidden relative flex flex-col">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"
      >
        <X size={24} />
      </button>
      
      <div className="flex flex-row flex-grow h-full gap-8">
        {/* Left Section */}
        <div className="w-[48%] flex flex-col gap-4 h-full items-center">
          <div className="flex h-[45%] rounded-lg w-full justify-center">
            <ImageGallery product={product} onImageExpandChange={onImageExpandChange} />
          </div>
          <div className="pb-6 rounded-lg w-full h-[55%]">
            <FlavoursSection onAddToCart={handleFlavourAddToCart} cart={flavourCart} />
          </div>
        </div>
        
        <Separator orientation="vertical" className="bg-white/50 h-auto w-0.5" />

        {/* Right Section */}
        <div className="flex-grow h-full relative">
            <div className="h-full py-0 pr-6 overflow-y-auto custom-scrollbar pb-28">
                <ProductDetails product={product} isLiked={isLiked} onLikeToggle={onLikeToggle} />
            </div>
            <ProductPopupFooter />
        </div>
      </div>
    </div>
  );
}
