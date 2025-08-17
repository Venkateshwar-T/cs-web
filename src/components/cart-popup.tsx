// @/components/cart-popup.tsx
'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItemCard } from './cart-item-card';
import { Button } from './ui/button';

interface CartPopupProps {
  onClose: () => void;
  cart: Record<string, number>;
}

export function CartPopup({ onClose, cart }: CartPopupProps) {
  const cartItems = Object.entries(cart);

  return (
    <div className={cn("bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden relative flex flex-col ring-4 ring-custom-gold animate-slide-up-fade-in")}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"
      >
        <X size={24} />
      </button>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-custom-purple-dark">Cart items</h2>
        <Button
          variant="destructive"
          className="bg-custom-purple-dark text-white rounded-full hover:bg-custom-purple-dark/90 text-sm h-9 px-4"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-4">
        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-white/70">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(([productName, quantity]) => (
              <CartItemCard 
                key={productName}
                productName={productName}
                quantity={quantity}
              />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
