
// @/app/faq/faq-client-page.tsx
'use client'; 

import { useState, type UIEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { Footer } from '@/components/footer';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { PopupsManager } from '@/components/popups/popups-manager';
import { useAppContext } from '@/context/app-context';
import type { SanityProduct } from '@/types';
import { BottomNavbar } from '@/components/bottom-navbar';

export default function FaqPageClient({ children, allProducts }: { children: React.ReactNode, allProducts: SanityProduct[] }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cart, updateCart, likedProducts, toggleLike, clearWishlist } = useAppContext();

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      if (!isMobile) {
        return;
      }

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
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const handleNavigation = (view: 'home' | 'cart' | 'profile' | 'faq') => {
      if (view === 'home') router.push('/');
      else if (view === 'cart') router.push('/cart');
      else if (view === 'profile') router.push('/profile');
      else if (view === 'faq') router.push('/faq');
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity.quantity, 0);

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn(isProfileOpen && "opacity-50")}>
        <div className="flex flex-col h-screen">
            <Header
            onProfileOpenChange={setIsProfileOpen}
            isContentScrolled={isMobile ? true : !isHeaderVisible}
            onReset={() => router.push('/')}
            onNavigate={handleHeaderNavigate}
            activeView={'faq'}
            />
            <main 
            onScroll={handleScroll}
            className={cn(
                "flex-grow flex flex-col overflow-y-auto no-scrollbar transition-all duration-300",
                isMobile ? (isHeaderVisible ? "pt-24" : "pt-0") : "pt-36"
            )}
            >
              {children}
              <Footer />
              <div className="h-16 flex-shrink-0 md:hidden" />
            </main>
        </div>
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
      <BottomNavbar activeView={'faq'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
