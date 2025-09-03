// @/components/views/MobileProductDetailView.tsx
'use client';

import type { Product } from '@/app/page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { MobileImageGallery } from '../mobile-image-gallery';

interface MobileProductDetailViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productName: string, quantity: number, animate?: boolean) => void;
  cart: Record<string, number>;
  onToggleCartPopup: () => void;
}

export function MobileProductDetailView({ product, onClose, onAddToCart, cart, onToggleCartPopup }: MobileProductDetailViewProps) {
  return (
    <div className={cn(
      "relative bg-[#9A7DAB] rounded-t-[20px] h-full ring-4 ring-custom-purple-dark"
    )}>
      <div className="bg-white/20 h-full w-full rounded-t-[20px] relative overflow-y-auto custom-scrollbar">
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
        {/* Other content like description, etc. will go here */}
      </div>
    </div>
  );
}
