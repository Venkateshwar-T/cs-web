
'use client';

import { useState, useEffect, type UIEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView } from '@/app/page';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { PopupsManager } from '@/components/popups/popups-manager';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileCartItemCard } from '@/components/mobile-cart-item-card';
import { MobileCartSummary } from '@/components/mobile-cart-summary';
import { useCart } from '@/hooks/use-cart';
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
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { FloatingCartFinalizeButton } from '@/components/floating-cart-finalize-button';
import { EmptyState } from '@/components/empty-state';
import { useAppContext } from '@/context/app-context';

const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
  'Diwali Collection Box 2': 1199,
  'Diwali Collection Box 3': 999,
  'Diwali Collection Box 4': 899,
  'Diwali Collection Box 5': 750,
  'Diwali Collection Box 6': 1250,
  'Diwali Collection Box 7': 600,
  'Diwali Collection Box 8': 1500,
  'Diwali Collection Box 9': 850,
  'Diwali Collection Box 10': 950,
  'Diwali Collection Box 11': 1100,
  'Diwali Collection Box 12': 1300,
};

function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CS';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function CartPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { cart, updateCart, clearCart } = useCart();
  const { addOrder } = useAppContext();
  const isMobile = useIsMobile();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSummaryVisible(entry.isIntersecting);
      },
      { 
        rootMargin: "0px 0px -150px 0px",
        threshold: 0.01 
      } 
    );

    const currentRef = summaryRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMobile]);

  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'profile') {
      router.push('/profile');
    }
    // If view is 'cart', do nothing as we are already on the page.
  };

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  }

  const handleQuantityChange = (productName: string, newQuantity: number) => {
    updateCart(productName, newQuantity);
  };

  const handleRemove = (productName: string) => {
    handleQuantityChange(productName, 0);
  };

  const handleCheckout = () => {
    const newOrderId = generateOrderId();
    const subtotal = Object.entries(cart).reduce((acc, [name, quantity]) => {
        const price = productPrices[name] || 0;
        return acc + (price * quantity);
    }, 0);
    
    const discount = 500.00;
    const subtotalAfterDiscount = subtotal - discount;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const total = subtotalAfterDiscount + gstAmount;

    addOrder({
        id: newOrderId,
        date: new Date().toISOString(),
        items: Object.entries(cart).map(([name, quantity]) => ({ name, quantity })),
        status: 'Order Requested',
        total: total > 0 ? total : 0,
    });

    clearCart();
    router.push(`/order-confirmed?orderId=${newOrderId}`);
  };
  
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    const currentScrollTop = event.currentTarget.scrollTop;
    if (Math.abs(currentScrollTop - lastScrollTop) <= 10) {
      return;
    }

    if (currentScrollTop > lastScrollTop && currentScrollTop > 56) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
    setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
  };


  const cartItems = Object.entries(cart);
  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className="flex flex-col h-screen">
        <Header
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={false}
          onReset={() => router.push('/')}
          onNavigate={handleHeaderNavigate}
          activeView={'cart'}
          isUsingAnimatedSearch={false}
        />
        <main onScroll={handleScroll} className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0 md:pb-0",
          isMobile ? (isHeaderVisible ? 'pt-24' : 'pt-0') : "pt-36" 
        )}>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <EmptyState
                imageUrl="/icons/empty.png"
                title="Your Cart is Empty"
                description="Looks like you haven't added anything to your cart yet. Start exploring to find the perfect gift!"
                buttonText="Continue Shopping"
                onButtonClick={() => router.push('/')}
              />
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="flex-grow overflow-y-auto no-scrollbar">
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="bg-white/80 rounded-2xl flex flex-col max-h-[70vh]">
                      <div className="flex justify-between items-center p-4 border-b border-black/10 flex-shrink-0">
                        <p className="text-base font-bold text-black">Total Products: {cartItems.length}</p>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 text-white rounded-full hover:bg-red-600/90 text-xs h-8 px-3 disabled:opacity-50"
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
                              <AlertDialogAction onClick={clearCart}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="overflow-y-auto no-scrollbar">
                        {cartItems.map(([productName, quantity], index) => (
                           <MobileCartItemCard
                              key={productName}
                              productName={productName}
                              quantity={quantity}
                              onQuantityChange={handleQuantityChange}
                              onRemove={handleRemove}
                              isLastItem={index === cartItems.length - 1}
                            />
                        ))}
                      </div>
                    </div>
                    {cartItems.length > 0 && (
                      <MobileCartSummary ref={summaryRef} cart={cart} onCheckout={handleCheckout} />
                    )}
                  </div>
                  <div className="h-16" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                  <h2 className="text-2xl font-bold text-white">Desktop Cart View</h2>
                  <p className="text-white/70 max-w-xs">
                    This is a placeholder for the desktop cart view.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
        <BottomNavbar activeView={'cart'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </div>

      <PopupsManager
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
      {isMobile && cartItems.length > 0 && (
        <FloatingCartFinalizeButton
          cart={cart}
          onCheckout={handleCheckout}
          isVisible={!isSummaryVisible}
        />
      )}
    </>
  );
}
