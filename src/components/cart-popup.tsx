// @/components/cart-popup.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItemCard } from './cart-item-card';
import { Button } from './ui/button';
import Image from 'next/image';
import { OrderSummary } from './order-summary';
import { CartPopupFooter } from './cart-popup-footer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { OrderItem } from '@/context/app-context';

interface CartPopupProps {
  onClose: () => void;
  cart: Record<string, OrderItem>;
  onClearCart: () => void;
  onFinalizeOrder: () => void;
  onQuantityChange: (productName: string, newQuantity: number) => void;
}

export function CartPopup({ onClose, cart, onClearCart, onFinalizeOrder, onQuantityChange }: CartPopupProps) {
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const cartItems = Object.values(cart);

  const handleRemove = (productName: string) => {
    setRemovingItems(prev => [...prev, productName]);
  };

  const handleAnimationEnd = (productName: string) => {
    onQuantityChange(productName, 0);
    setRemovingItems(prev => prev.filter(item => item !== productName));
  };


  return (
    <div className={cn("bg-[#9A7DAB] rounded-t-[40px] pt-4 text-white h-full overflow-hidden relative flex flex-col ring-4 ring-custom-gold animate-slide-up-fade-in")}>
      <div className="flex justify-between items-center mb-5 px-6">
        <div className="flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-4 h-9">
            <Image src="/icons/cart.png" alt="Cart" width={16} height={16} />
            <h2 className="text-sm font-bold ml-2">My Cart</h2>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-custom-purple-dark text-white rounded-full hover:bg-custom-purple-dark/90 text-sm h-9 px-4 disabled:opacity-50"
              disabled={cartItems.length === 0}
            >
              <X className="h-4 w-0" />
              Clear Cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove all items from your cart. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearCart}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex h-full gap-4 flex-grow min-h-0 pl-6">
        {/* Left Section (60%) */}
        <div className="w-[60%] flex flex-col">
          <div 
            className="flex-grow overflow-y-auto pr-4 min-h-0 custom-scrollbar"
          >
            {cartItems.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-black">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <CartItemCard 
                    key={item.name}
                    item={item}
                    quantity={item.quantity}
                    onQuantityChange={onQuantityChange}
                    onRemove={() => handleRemove(item.name)}
                    isRemoving={removingItems.includes(item.name)}
                    onAnimationEnd={() => handleAnimationEnd(item.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section (40%) */}
        <div className="w-[40%] rounded-l-2xl flex flex-col pr-6">
            <div className="flex-grow min-h-0">
                <OrderSummary cart={cart} />
            </div>
            <CartPopupFooter cart={cart} onFinalizeOrder={onFinalizeOrder} />
        </div>
      </div>
    </div>
  );
}
