
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

export default function FaqPageClient({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cart, updateCart, likedProducts, toggleLike, clearWishlist } = useAppContext();

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setIsContentScrolled(event.currentTarget.scrollTop > 0);
  };
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn(isProfileOpen && "opacity-50")}>
        <div className="flex flex-col h-screen">
            <Header
            onProfileOpenChange={setIsProfileOpen}
            isContentScrolled={isMobile ? true : isContentScrolled}
            onReset={() => router.push('/')}
            onNavigate={handleHeaderNavigate}
            activeView={'faq'}
            />
            <main 
            onScroll={handleScroll}
            className={cn(
                "flex-grow flex flex-col overflow-y-auto no-scrollbar transition-all duration-300",
                isMobile ? "pt-24" : "pt-36"
            )}
            >
            {children} {/* Renders the FaqContent server component */}
            <Footer />
            </main>
        </div>
      </div>
      <PopupsManager
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        allProducts={[]}
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
