// @/components/cart-popup.tsx
'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItemCard } from './cart-item-card';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { OrderSummary } from './order-summary';

interface CartPopupProps {
  onClose: () => void;
  cart: Record<string, number>;
}

export function CartPopup({ onClose, cart }: CartPopupProps) {
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
    <div className={cn("bg-[#9A7DAB] rounded-t-[40px] pt-8 pl-8 text-white h-full overflow-hidden relative flex flex-col ring-4 ring-custom-gold animate-slide-up-fade-in")}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"
      >
        <X size={24} />
      </button>
      
      <div className="flex h-full gap-8">
        {/* Left Section (60%) */}
        <div className="w-[60%] flex flex-col">
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

          <div 
            ref={scrollContainerRef}
            className={cn(
              "flex-grow overflow-y-auto pr-4 -mr-4",
              isScrolling ? "custom-scrollbar" : "no-scrollbar"
            )}
          >
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

        {/* Right Section (40%) */}
        <div className="w-[40%] bg-white/10 rounded-l-2xl flex flex-col">
            <div className="flex justify-end">
                <div className="bg-custom-gold rounded-bl-full flex items-center px-4 py-2">
                    <Image src="/icons/cart.png" alt="Cart" width={24} height={24} />
                    <span className="text-custom-purple-dark font-bold ml-2">My Cart</span>
                </div>
            </div>
            <div className="p-4">
                <OrderSummary cart={cart} />
            </div>
        </div>
      </div>
    </div>
  );
}
