'use client';

import { X } from 'lucide-react';
import type { Product } from '@/app/page';

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
}

export function ProductPopup({ product, onClose }: ProductPopupProps) {
  return (
    <div 
      className="absolute inset-0 bg-[#9A7DAB] rounded-[40px] p-8 text-white"
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <p className="mt-4">This is the detail view for {product.name}.</p>
      </div>
    </div>
  );
}
