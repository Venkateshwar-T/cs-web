
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
import { useCart } from '@/hooks/use-cart';
import { Footer } from '@/components/footer';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';


export type Product = {
  id: number;
  name: string;
};

export type ProfileInfo = {
  name: string;
  phone: string;
  email: string;
}

export type ActiveView = 'home' | 'search' | 'faq' | 'order-confirmed' | 'cart' | 'profile' | 'about';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

export default function Home() {
  const { cart, updateCart, clearCart } = useCart();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCompleteDetailsOpen, setIsCompleteDetailsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
  });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const { toast } = useToast();


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isImageExpanded || isCartVisible || isSignUpOpen || isCompleteDetailsOpen || isProfileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isImageExpanded, isCartVisible, isSignUpOpen, isCompleteDetailsOpen, isProfileOpen]);


  useEffect(() => {
    if (isCartOpen) {
      setIsCartVisible(true);
    } else {
      const timer = setTimeout(() => setIsCartVisible(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

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

  const handleAddToCart = (productName: string, quantity: number) => {
    updateCart(productName, quantity);
  };

  const handleLikeToggle = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = { ...prev };
      if (newLiked[productId]) {
        delete newLiked[productId];
      } else {
        newLiked[productId] = true;
      }
      return newLiked;
    });
  };
  
  const handleClearWishlist = () => {
    setLikedProducts({});
  };

  const handleToggleCartPopup = () => {
    setIsCartOpen(prev => !prev);
  }

  const handleOpenSignUp = () => {
    setIsSignUpOpen(true);
  };

  const handleOpenCompleteDetails = () => {
    setIsCompleteDetailsOpen(true);
  }

  const handleConfirmOrder = (name: string, phone: string) => {
    setProfileInfo(prev => ({...prev, name, phone }));
    router.push('/order-confirmed');
    setIsCartOpen(false);
  };

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({...prev, ...updatedProfile}));
  };

  const isPopupOpen = isImageExpanded || isCartVisible || isSignUpOpen || isCompleteDetailsOpen || isProfileOpen;

  const handleNavigation = (view: ActiveView) => {
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

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
  
  const mainContentClass = cn(
    "flex flex-col items-center justify-start transition-all duration-500 relative flex-grow min-h-0 pb-16 md:pb-0",
    isPageLoading && 'opacity-0'
  );

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn(
        "flex flex-col h-screen",
        (isPopupOpen && !isCartVisible) ? 'opacity-50' : ''
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
          <Footer />
        </main>
      </div>

      <PopupsManager
        isCartVisible={isCartVisible}
        isCartOpen={isCartOpen}
        isProfileOpen={isProfileOpen}
        isSignUpOpen={isSignUpOpen}
        isCompleteDetailsOpen={isCompleteDetailsOpen}
        onImageExpandChange={setIsImageExpanded}
        likedProducts={likedProducts}
        onLikeToggle={handleLikeToggle}
        cart={cart}
        onAddToCart={handleAddToCart}
        onToggleCartPopup={handleToggleCartPopup}
        onClearCart={clearCart}
        onFinalizeOrder={handleOpenCompleteDetails}
        onProfileUpdate={handleProfileUpdate}
        profileInfo={profileInfo}
        allProducts={allProducts}
        onClearWishlist={handleClearWishlist}
        setIsProfileOpen={setIsProfileOpen}
        setIsSignUpOpen={setIsSignUpOpen}
        onLoginClick={handleOpenSignUp}
        setIsCompleteDetailsOpen={setIsCompleteDetailsOpen}
        onConfirmOrder={handleConfirmOrder}
      />
      <BottomNavbar activeView={'home'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
