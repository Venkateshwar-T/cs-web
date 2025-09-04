
'use client';

import { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BottomNavbar } from '@/components/bottom-navbar';
import type { ActiveView, Product } from '@/app/page';
import { SparkleBackground } from '@/components/sparkle-background';
import { Button } from '@/components/ui/button';
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
} from "@/components/ui/alert-dialog";
import { CartItemCard } from '@/components/cart-item-card';
import { OrderSummary } from '@/components/order-summary';
import { CartPopupFooter } from '@/components/cart-popup-footer';


// Mock data - in a real app this would come from a shared state management solution
const mockCart: Record<string, number> = {
  'Diwali Collection Box 1': 2,
  'Diwali Collection Box 3': 1,
};


export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(mockCart);
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const cartItems = Object.entries(cart);

  const handleQuantityChange = (productName: string, newQuantity: number) => {
    const newCart = { ...cart };
    if (newQuantity <= 0) {
      delete newCart[productName];
    } else {
      newCart[productName] = newQuantity;
    }
    setCart(newCart);
  };
  
  const handleClearCart = () => {
    setCart({});
  };

  const handleRemove = (productName: string) => {
    setRemovingItems(prev => [...prev, productName]);
  };

  const handleAnimationEnd = (productName: string) => {
    handleQuantityChange(productName, 0);
    setRemovingItems(prev => prev.filter(item => item !== productName));
  };
  
  const handleFinalizeOrder = () => {
    // In a real app, this would likely navigate to a checkout page
    // or open a complete details modal.
    console.log("Finalizing order...");
  }
  
  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'search') {
      router.push('/search');
    } else {
      // Handle profile view if needed, maybe open a modal
    }
  };

  return (
    <>
      <SparkleBackground />
      <div className="flex flex-col h-screen bg-background text-white pb-16 md:pb-0">
        <header className="flex-shrink-0 flex justify-between items-center p-4">
          <div className="flex items-center bg-custom-gold text-custom-purple-dark rounded-full px-4 h-9">
              <Image src="/icons/cart.png" alt="Cart" width={16} height={16} />
              <h2 className="text-sm font-bold ml-2">My Cart</h2>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-custom-purple-dark text-white rounded-full hover:bg-custom-purple-dark/90 text-sm h-9 px-4 disabled:opacity-50 border border-white/50"
                disabled={cartItems.length === 0}
              >
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
                <AlertDialogAction onClick={handleClearCart}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        <main className="flex-grow flex flex-col min-h-0">
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-white/70">Your cart is empty.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto px-4 custom-scrollbar space-y-4">
              {cartItems.map(([productName, quantity]) => (
                <CartItemCard 
                  key={productName}
                  productName={productName}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  onRemove={() => handleRemove(productName)}
                  isRemoving={removingItems.includes(productName)}
                  onAnimationEnd={() => handleAnimationEnd(productName)}
                />
              ))}
            </div>
          )}
          
          {cartItems.length > 0 && (
            <div className="flex-shrink-0 p-4">
                <div className="bg-transparent text-black rounded-2xl p-4 flex flex-col border border-custom-purple-dark max-h-full">
                   <OrderSummary cart={cart} />
                </div>
            </div>
          )}

        </main>
      </div>
      <BottomNavbar activeView={'cart'} onNavigate={handleNavigation} />
    </>
  );
}
