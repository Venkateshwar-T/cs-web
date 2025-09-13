// @/app/cart/cart-client-page.tsx
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
import type { SanityProduct } from '@/types';
import { Loader } from '@/components/loader';

function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CS';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function CartClientPage({ allProducts }: { allProducts: SanityProduct[] }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { cart, updateCart, clearCart, addOrder } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  // Products are now passed as props, so we don't need to fetch them here.
  // We can set loading to false after the component mounts.
  useEffect(() => {
    setIsLoading(false);
  }, []);

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
  }, [isMobile, allProducts]);

  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'profile') {
      router.push('/profile');
    }
    // If view is 'cart', do nothing as we are already on the page.
  };
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
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
    const productsByName = allProducts.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);
    
    const subtotal = Object.values(cart).reduce((acc, item) => {
        const product = productsByName[item.name];
        const price = product?.discountedPrice || 0;
        return acc + (price * item.quantity);
    }, 0);
    
    const discount = 500.00;
    const subtotalAfterDiscount = subtotal - discount;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const total = subtotalAfterDiscount + gstAmount;
    
    const newOrderId = generateOrderId();

    addOrder({
        id: newOrderId,
        date: new Date().toISOString(),
        items: Object.values(cart),
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


  const cartItems = Object.values(cart);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const productsByName = allProducts.reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {} as Record<string, SanityProduct>);

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
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader />
            </div>
          ) : cartItems.length === 0 ? (
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
                        {cartItems.map((item, index) => {
                          const product = productsByName[item.name];
                          if (!product) return null;
                          return (
                           <MobileCartItemCard
                              key={item.name}
                              item={item}
                              product={product}
                              onQuantityChange={handleQuantityChange}
                              onRemove={handleRemove}
                              isLastItem={index === cartItems.length - 1}
                              onProductClick={handleProductClick}
                            />
                          )
                        })}
                      </div>
                    </div>
                    {cartItems.length > 0 && allProducts.length > 0 && (
                      <MobileCartSummary ref={summaryRef} cart={cart} allProducts={allProducts} onCheckout={handleCheckout} />
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
        allProducts={allProducts}
        onProductClick={handleProductClick}
      />
      {isMobile && cartItems.length > 0 && allProducts.length > 0 && (
        <FloatingCartFinalizeButton
          cart={cart}
          allProducts={allProducts}
          onCheckout={handleCheckout}
          isVisible={!isSummaryVisible}
        />
      )}
    </>
  );
}
