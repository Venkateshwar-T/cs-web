
// @/app/order-confirmed/order-confirmed-client-page.tsx
'use client';

import { Suspense, useState, useEffect, type UIEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import type { SanityProduct } from '@/types';

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

function OrderConfirmedPageComponent({ allProducts }: { allProducts: SanityProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, updateCart, likedProducts, toggleLike, clearWishlist, orders } = useAppContext();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [isContentScrolled, setIsContentScrolled] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.push('/');
      return;
    }

    const foundOrder = orders.find(o => o.id === orderId);
    if (foundOrder) {
      setConfirmedOrder(foundOrder);
      setTimeout(() => setIsLoading(false), 1000);
    } else {
      console.warn(`Order with ID ${orderId} not found.`);
      router.push('/');
    }
  }, [searchParams, orders, router]);
  
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setIsContentScrolled(scrollTop > 0);
  };
  
  const handleSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const handleNavigation = (view: 'home' | 'cart' | 'profile') => {
    if (view === 'cart') router.push('/cart');
    else if (view === 'profile') router.push('/profile');
    else router.push('/');
  };

  const cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

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
              <div className={cn("flex flex-col", isMobile ? "px-4" : "md:px-32")}>
                <OrderConfirmedView order={confirmedOrder} products={allProducts} />
              </div>
              <Footer />
              <div className="h-16 flex-shrink-0 md:hidden" />
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
        onProductClick={handleProductClick}
      />
    </>
  );
}

export default function OrderConfirmedClientPage({ allProducts }: { allProducts: SanityProduct[] }) {
    return (
        <Suspense fallback={<ProcessingView />}>
            <OrderConfirmedPageComponent allProducts={allProducts} />
        </Suspense>
    )
}
