// @/components/cart-popup.tsx
'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItemCard } from './cart-item-card';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';
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

interface CartPopupProps {
  onClose: () => void;
  cart: Record<string, number>;
  onClearCart: () => void;
}

export function CartPopup({ onClose, cart, onClearCart }: CartPopupProps) {
  const cartItems = Object.entries(cart);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide scrollbar after 1.5s of no scrolling
    };

    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("bg-[#9A7DAB] rounded-t-[40px] pt-4 text-white h-full overflow-hidden relative flex flex-col ring-4 ring-custom-gold animate-slide-up-fade-in")}>
      <div className="flex justify-between items-center mb-5 px-6">
        <div className="flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-4 py-2">
            <Image src="/icons/cart.png" alt="Cart" width={24} height={24} />
            <h2 className="text-3xl font-bold ml-2">My Cart</h2>
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
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove all items from your cart.
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
            ref={scrollContainerRef}
            className={cn(
              "flex-grow overflow-y-auto pr-4 min-h-0",
              isScrolling ? "custom-scrollbar" : "no-scrollbar"
            )}
          >
            {cartItems.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-white/70">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
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

        {/* Right Section (40%) */}
        <div className="w-[40%] rounded-l-2xl flex flex-col">
            <div className="p-4 flex-grow min-h-0 pr-6">
                <OrderSummary cart={cart} />
            </div>
            <CartPopupFooter cart={cart} />
        </div>
      </div>
    </div>
  );
}