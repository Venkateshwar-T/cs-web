
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
  onImageExpandChange: (isExpanded: boolean) => void;
}

export function MobileProductDetailView({ product, onClose, onImageExpandChange }: MobileProductDetailViewProps) {
  return (
    <div className={cn(
      "relative bg-[#5D2B79] rounded-t-[20px] h-full"
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
          <MobileImageGallery product={product} onImageExpandChange={onImageExpandChange} />
        </div>
        {/* Other content like description, etc. will go here */}
      </div>
    </div>
  );
}
