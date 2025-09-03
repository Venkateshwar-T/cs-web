// @/components/views/MobileProductDetailView.tsx
'use client';

import type { Product } from '@/app/page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { MobileImageGallery } from '../mobile-image-gallery';
import { ProductDetails } from '../product-details';
import { FlavoursSection } from '../flavours-section';
import { Separator } from '../ui/separator';

interface MobileProductDetailViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productName: string, quantity: number, animate?: boolean) => void;
  cart: Record<string, number>;
  onToggleCartPopup: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
  flavourCart: Record<string, number>;
  onFlavourAddToCart: (flavourId: number, quantity: number) => void;
}

export function MobileProductDetailView({ 
  product, 
  onClose, 
  onAddToCart, 
  cart, 
  onToggleCartPopup, 
  isLiked, 
  onLikeToggle,
  flavourCart,
  onFlavourAddToCart,
}: MobileProductDetailViewProps) {
  return (
    <div className={cn(
      "relative bg-[#9A7DAB] rounded-t-[20px] h-full ring-4 ring-custom-purple-dark"
    )}>
      <div className="bg-white/20 h-full w-full rounded-t-[20px] relative overflow-y-auto no-scrollbar">
        <div className="sticky top-0 z-20 flex justify-end p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 text-white rounded-full hover:bg-custom-gold hover:text-custom-purple-dark"
            >
              <X className="h-6 w-6" />
            </Button>
        </div>
        <div className="-mt-12">
           <MobileImageGallery product={product} onImageExpandChange={() => {}} />
        </div>
        <div className="p-4">
          <ProductDetails product={product} isLiked={isLiked} onLikeToggle={onLikeToggle} isMobile={true} />
        </div>
        <Separator className="my-4 bg-white/30" />
        <div className="px-4 pb-4">
          <FlavoursSection onAddToCart={onFlavourAddToCart} cart={flavourCart} isMobile={true} />
        </div>
      </div>
    </div>
  );
}
