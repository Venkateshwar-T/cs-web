'use client';

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
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
}

export function ProductPopup({ product, onClose, onAddToCart, cart }: ProductPopupProps) {
  
  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    onAddToCart(flavourId.toString(), quantity);
  };
  
  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] pt-8 px-8 text-white h-full overflow-hidden relative flex flex-col">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"
      >
        <X size={24} />
      </button>
      
      <div className="flex flex-row flex-grow h-full gap-8 pb-28">
        <div className="w-[48%] flex flex-col gap-4 h-full items-center">
          <div className="flex h-[45%] rounded-lg w-full justify-center">
            <ImageGallery product={product} />
          </div>
          <div className="rounded-lg w-full h-[55%]">
            <FlavoursSection onAddToCart={handleFlavourAddToCart} cart={cart} />
          </div>
        </div>
        
        <Separator orientation="vertical" className="bg-white/50 h-auto w-0.5" />

        <div className="flex-grow h-full py-0 pr-6 overflow-y-auto custom-scrollbar">
            <ProductDetails product={product} />
        </div>
      </div>
      <ProductPopupFooter />
    </div>
  );
}
