
// @/components/cart-popup.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import type { SanityProduct } from '@/types';
import { EmptyState } from './empty-state';

interface CartPopupProps {
  onClose: () => void;
  cart: Record<string, OrderItem>;
  allProducts: SanityProduct[];
  onClearCart: () => void;
  onFinalizeOrder: () => void;
  onQuantityChange: (productName: string, quantity: number, flavours?: string[]) => void;
}

export function CartPopup({ onClose, cart, allProducts, onClearCart, onFinalizeOrder, onQuantityChange }: CartPopupProps) {
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const router = useRouter();
  const cartItems = Object.values(cart);
  const productsByName = allProducts.reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {} as Record<string, SanityProduct>);


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
        {cartItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-custom-purple-dark text-white rounded-full hover:bg-custom-purple-dark/90 text-sm h-9 px-4"
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
        )}
      </div>

      {cartItems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center h-full">
              <EmptyState
                  imageUrl="/icons/empty.png"
                  title="Your Cart is Empty"
                  description="Looks like you haven't added anything to your cart yet. Start exploring to find the perfect gift!"
                  onButtonClick={() => {
                      onClose();
                      router.push('/');
                  }}
                  containerClassName="text-black"
                  showButton={false}
              />
          </div>
      ) : (
        <div className="flex h-full gap-4 flex-grow min-h-0 pl-6">
          {/* Left Section (60%) */}
          <div className="w-[60%] flex flex-col">
            <div 
              className="flex-grow overflow-y-auto pr-4 min-h-0 custom-scrollbar"
            >
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => {
                  const product = productsByName[item.name];
                  if (!product) return null;
                  return (
                    <CartItemCard
                      key={item.name}
                      item={item}
                      product={product}
                      onQuantityChange={onQuantityChange}
                      onRemove={() => handleRemove(item.name)}
                      isRemoving={removingItems.includes(item.name)}
                      onAnimationEnd={() => handleAnimationEnd(item.name)}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Section (40%) */}
          <div className="w-[40%] rounded-l-2xl flex flex-col pr-6">
              <div className="flex-grow min-h-0">
                  <OrderSummary cart={cart} allProducts={allProducts} />
              </div>
              <CartPopupFooter cart={cart} onFinalizeOrder={onFinalizeOrder} />
          </div>
        </div>
      )}
    </div>
  );
}
