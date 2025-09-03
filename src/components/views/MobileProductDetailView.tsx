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
      "relative bg-[#5D2B79] rounded-t-[20px] animate-slide-up-in h-full"
    )}>
      <div className="bg-white/20 h-full w-full rounded-t-[20px] relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
        {/* Content will go here */}
      </div>
    </div>
  );
}
