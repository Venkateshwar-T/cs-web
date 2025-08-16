// @/components/cart-popup.tsx
'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionTitle } from './section-title';

interface CartPopupProps {
  onClose: () => void;
  cart: Record<string, number>;
}

export function CartPopup({ onClose, cart }: CartPopupProps) {
  const cartItems = Object.entries(cart);

  return (
    <div className={cn("bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex flex-col ring-4 ring-custom-gold")}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"
      >
        <X size={24} />
      </button>
      
      <SectionTitle className="mb-6 text-center text-3xl">Your Cart</SectionTitle>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-4">
        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-white/70">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(([productName, quantity]) => (
              <div key={productName} className="flex justify-between items-center bg-white/10 p-4 rounded-lg">
                <div>
                  <h3 className="font-bold text-lg">{productName}</h3>
                  <p className="text-sm text-white/80">Price: ₹750</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-semibold">Quantity: {quantity}</p>
                    <p className="font-bold text-lg">₹{750 * quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
