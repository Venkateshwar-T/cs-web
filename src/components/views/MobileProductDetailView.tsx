
// @/components/views/MobileProductDetailView.tsx
'use client';

import type { Product } from '@/app/page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MobileProductDetailViewProps {
  product: Product;
  onClose: () => void;
}

export function MobileProductDetailView({ product, onClose }: MobileProductDetailViewProps) {
  return (
    <div className={cn(
      "relative bg-[#5D2B79] rounded-t-[20px] h-full"
    )}>
      <div className="bg-white/20 h-full w-full rounded-t-[20px] relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-2 right-2 z-20 h-8 w-8 text-white hover:text-white/80"
        >
          <X className="h-6 w-6" />
        </Button>
        {/* Content will go here */}
      </div>
    </div>
  );
}
