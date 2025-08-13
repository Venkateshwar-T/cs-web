'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '@/app/page';

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
}

export function ProductPopup({ product, onClose, onAddToCart, cart }: ProductPopupProps) {
  return (
    <div className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      {/* Content will go here */}

    </div>
  );
}
