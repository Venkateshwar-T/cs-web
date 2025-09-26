
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
import { useAppContext } from '@/context/app-context';
import type { SanityProduct } from '@/types';
import { FlavourSelectionPopup } from '@/components/flavour-selection-popup';
import type { ActiveView } from '@/app/page';

interface HomepageContent {
  exploreCategories: { _key: string; name: string; imageUrl: string }[];
  exploreFlavours: { _key: string; name: string; imageUrl: string }[];
}

interface HomeClientProps extends HomepageContent {
  allProducts: SanityProduct[];
}


export default function HomeClient({ allProducts, exploreCategories, exploreFlavours }: HomeClientProps) {
  const { cart, updateCart, likedProducts, toggleLike, clearWishlist, flavourSelection, setFlavourSelection, setIsGlobalLoading } = useAppContext();
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
    
    setIsGlobalLoading(true);
    router.push(`/search?q=${encodeURIComponent(currentSearchInput.trim())}`);
  };

  const handleResetToHome = () => {
    router.push('/');
  };

  const handleNavigation = (view: ActiveView) => {
    if (view === 'cart') {
      router.push('/cart', { scroll: false });
    } else if (view === 'profile') {
      router.push('/profile', { scroll: false });
    } else if (view === 'home') {
       router.push('/', { scroll: false });
    }
  };
  
  const handleHeaderNavigate = (view: 'about' | 'faq' | 'admin') => {
    router.push(`/${view}`);
  };
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const handleFlavourConfirm = (productName: string, flavours: string[]) => {
    const prevQuantity = cart[productName]?.quantity || 0;
    updateCart(productName, prevQuantity + 1, flavours);
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
        (isProfileOpen || flavourSelection.isOpen) ? 'opacity-50' : ''
      )}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={false}
          onReset={handleResetToHome}
          onNavigate={handleHeaderNavigate}
          activeView={'home'}
          onSearchSubmit={(query) => {
            setIsGlobalLoading(true);
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          isSearchingOnAbout={false}
        />
        <main className={mainContentClass}>
          <div className='w-full mt-20 md:mt-20'>
            <SearchBar
              activeView={'home'}
              isEnquireOpen={false}
              onSubmit={handleSearchSubmit}
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
            />
          </div>
          <div className="mt-8 md:mt-20 w-full flex-grow min-h-0">
            <ExploreCategories exploreCategories={exploreCategories} exploreFlavours={exploreFlavours} />
          </div>
        </main>
        <BottomNavbar activeView={'home'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
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
       <FlavourSelectionPopup
        product={flavourSelection.product}
        open={flavourSelection.isOpen}
        onOpenChange={(isOpen) => setFlavourSelection({ product: null, isOpen })}
        onConfirm={handleFlavourConfirm}
      />
    </>
  );
}
