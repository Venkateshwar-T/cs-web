
'use client';

import { Suspense, useState, useEffect, type UIEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/app/page';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';
import { OrderConfirmedView } from '@/components/order-confirmed-view';
import { Footer } from '@/components/footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { Loader } from '@/components/loader';
import { motion } from 'framer-motion';
import { useAppContext, type Order } from '@/context/app-context';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

const ProcessingView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
        <Loader className="w-24 h-24 text-custom-gold" />
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2"
        >
          <h1 className="font-base font-poppins text-lg md:text-3xl text-white">Processing your order</h1>
          <p className="text-sm md:text-base text-white/80">Please do not refresh the page</p>
        </motion.div>
    </div>
);

function OrderConfirmedPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, updateCart } = useCart();
  const { likedProducts, toggleLike, clearWishlist, orders } = useAppContext();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [isContentScrolled, setIsContentScrolled] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.push('/');
      return;
    }

    const foundOrder = orders.find(o => o.id === orderId);
    if (!foundOrder) {
      // It might take a moment for the context to update after redirect.
      // If not found, we'll wait and check again. A simple timeout can work here.
      setTimeout(() => {
        const foundOrderAgain = orders.find(o => o.id === orderId);
        if (foundOrderAgain) {
          setConfirmedOrder(foundOrderAgain);
        } else {
          // If still not found, something is wrong, redirect home.
          router.push('/');
        }
        setIsLoading(false);
      }, 500); // Wait 500ms for context to be available
    } else {
      setConfirmedOrder(foundOrder);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Simulate processing time even if order found immediately
    }
  }, [searchParams, orders, router]);
  
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setIsContentScrolled(scrollTop > 0);
  };
  
  const handleSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleNavigation = (view: 'home' | 'cart' | 'profile') => {
    if (view === 'cart') router.push('/cart');
    else if (view === 'profile') router.push('/profile');
    else router.push('/');
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen", isProfileOpen && 'opacity-50')}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={isContentScrolled}
          onReset={() => router.push('/')}
          onNavigate={(view) => router.push(`/${view}`)}
          activeView={'order-confirmed'}
          isUsingAnimatedSearch={!isMobile}
          onSearchSubmit={handleSearchSubmit}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
        />
        <main onScroll={handleScroll} className={cn(
          "flex-grow flex flex-col gap-8 overflow-y-auto no-scrollbar",
          "pt-24 md:pt-32"
        )}>
          {isLoading || !confirmedOrder ? (
            <ProcessingView />
          ) : (
            <>
              <div className={cn("flex-grow flex flex-col", isMobile ? "px-4" : "md:px-32")}>
                <OrderConfirmedView order={confirmedOrder} />
              </div>
              <Footer />
            </>
          )}
        </main>
        <BottomNavbar activeView={'order-confirmed'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </div>
      
      <PopupsManager
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        allProducts={allProducts}
        likedProducts={likedProducts}
        onLikeToggle={toggleLike}
        cart={cart}
        onAddToCart={updateCart}
        onClearWishlist={clearWishlist}
      />
    </>
  );
}

export default function OrderConfirmedPage() {
    return (
        <Suspense fallback={<ProcessingView />}>
            <OrderConfirmedPageComponent />
        </Suspense>
    )
}
