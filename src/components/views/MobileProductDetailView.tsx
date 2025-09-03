
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
      <div className="bg-white/20 h-full w-full rounded-t-[20px] relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-2 right-2 z-20 h-8 w-8 text-white rounded-full hover:bg-custom-gold hover:text-custom-purple-dark"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="pt-2">
          <MobileImageGallery product={product} onImageExpandChange={onImageExpandChange} />
        </div>
      </div>
    </div>
  );
}
