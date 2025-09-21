'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { PopupsManager } from '@/components/popups/popups-manager';
import { BottomNavbar } from '@/components/bottom-navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExploreCategories } from '@/components/explore-categories';
import { SearchBar } from '@/components/header/search-bar';
import { useToast } from "@/hooks/use-toast";
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { Footer } from '@/components/footer';
import { useAppContext, type ProfileInfo } from '@/context/app-context';
import type { SanityProduct } from '@/types';


export type Product = {
  id: number;
  name: string;
};

export default function Home() {
  const { cart, updateCart, likedProducts, toggleLike, clearWishlist } = useAppContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (isProfileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isProfileOpen]);


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>, currentSearchInput: string) => {
    e.preventDefault();
    
    if (!currentSearchInput.trim()) {
      toast({
        title: "Empty Field",
        description: "Search field cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    router.push(`/search?q=${encodeURIComponent(currentSearchInput.trim())}`);
  };

  const handleResetToHome = () => {
    router.push('/');
  };

  const handleNavigation = (view: 'home' | 'cart' | 'profile') => {
    if (view === 'cart') {
      router.push('/cart');
    } else if (view === 'profile') {
      router.push('/profile');
    } else {
       router.push('/');
    }
  };
  
  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  };

  const cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  
  const mainContentClass = cn(
    "flex flex-col items-center justify-start transition-all duration-500 relative flex-grow min-h-0 pb-16 md:pb-0"
  );

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn(
        "flex flex-col h-screen",
        isProfileOpen ? 'opacity-50' : ''
      )}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={false}
          onReset={handleResetToHome}
          onNavigate={handleHeaderNavigate}
          activeView={'home'}
          onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          isSearchingOnAbout={false}
        />
        <main className={mainContentClass}>
          <div className='w-full pt-32'>
            <SearchBar
              activeView={'home'}
              isEnquireOpen={false}
              onSubmit={handleSearchSubmit}
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
            />
          </div>
          <div className="mt-8 w-full flex-grow min-h-0">
            <ExploreCategories />
          </div>
        </main>
        <BottomNavbar activeView={'home'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
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
      />
    </>
  );
}
