
'use client';

import { useState } from 'react';
import type { Product } from '@/app/page';
import { FlavoursSection } from './flavours-section';
import { ImageGallery } from './image-gallery';
import { ProductDetails } from './product-details';
import { Separator } from './ui/separator';
import { ProductPopupFooter } from './product-popup-footer';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

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
  onAddToCart: (productName: string, quantity: number, animate?: boolean) => void;
  cart: Record<string, number>;
  onToggleCartPopup: () => void;
}

export function ProductPopup({ product, onClose, onImageExpandChange, isLiked, onLikeToggle, onAddToCart, cart, onToggleCartPopup }: ProductPopupProps) {
  const [flavourCart, setFlavourCart] = useState<Record<string, number>>({});
  
  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    const newFlavourCart = { ...flavourCart, [flavourId.toString()]: quantity };
    if (quantity <= 0) {
      delete newFlavourCart[flavourId.toString()];
    }
    setFlavourCart(newFlavourCart);
  };

  const productQuantity = cart[product.name] || 0;
  
  return (
    <div className="relative h-full w-full">
      <div className={cn("bg-[#9A7DAB] rounded-t-[40px] pt-6 md:px-4 lg:px-5 xl:px-8 text-white h-full overflow-hidden relative flex flex-col ring-4 ring-custom-purple-dark")}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-black/30 p-1.5 rounded-full hover:bg-black/50 transition-colors z-20"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-row flex-grow h-full md:gap-4 lg:gap-4 xl:gap-8">
          {/* Left Section */}
          <div className="w-[48%] flex flex-col gap-4 h-full items-center">
            <div className="flex md:h-full xl:h-[45%] rounded-lg w-full justify-center">
              <ImageGallery product={product} onImageExpandChange={onImageExpandChange} />
            </div>
            <div className="pb-6 rounded-lg w-full h-[55%]">
              <FlavoursSection onAddToCart={handleFlavourAddToCart} cart={flavourCart} />
            </div>
          </div>
          
          <Separator orientation="vertical" className="bg-white/50 h-[95%] w-0.5" />

          {/* Right Section */}
          <div className="flex-grow h-full xl:relative lg:relative">
              <div className="h-full py-0 pr-6 overflow-y-auto custom-scrollbar pb-28">
                  <ProductDetails product={product} isLiked={isLiked} onLikeToggle={onLikeToggle} />
              </div>
              <ProductPopupFooter product={product} onAddToCart={onAddToCart} quantity={productQuantity} onToggleCartPopup={onToggleCartPopup} />
          </div>
        </div>
      </div>
    </div>
  );
}
