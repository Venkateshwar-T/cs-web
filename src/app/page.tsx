
'use client';

import { useState, useEffect, type UIEvent, useRef } from 'react';
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
import { OrderConfirmedView } from '@/components/order-confirmed-view';
import { AboutView } from '@/components/about-view';
import { FaqView } from '@/components/faq-view';


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
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const { cart, updateCart, clearCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedProductForMobile, setSelectedProductForMobile] = useState<Product | null>(null);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isSearchingOnAbout, setIsSearchingOnAbout] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedProduct || isImageExpanded || isCartVisible || isSignUpOpen || isCompleteDetailsOpen || isProfileOpen || selectedProductForMobile) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedProduct, isImageExpanded, isCartVisible, isSignUpOpen, isCompleteDetailsOpen, isProfileOpen, selectedProductForMobile]);


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
    setActiveView('home');
    setIsSearchingOnAbout(false);
    router.push('/');
  };

  const handleAddToCart = (productName: string, quantity: number) => {
    updateCart(productName, quantity);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
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
    setSelectedProduct(null); // Close product popup before opening details popup
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

  const isPopupOpen = selectedProduct || isImageExpanded || isCartVisible || isSignUpOpen || isCompleteDetailsOpen || isProfileOpen;

  const handleNavigation = (view: ActiveView) => {
    if (view === 'cart') {
      router.push('/cart');
    } else if (view === 'profile') {
      router.push('/profile');
    } else if (view === 'about') {
      router.push('/about');
    } else if (view === 'faq') {
      router.push('/faq');
    } 
    else {
       router.push('/');
      setActiveView(view);
    }
  };
  
  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  const renderContent = () => {
    const paddedView = (component: React.ReactNode) => (
      <div className="pt-36 flex-grow flex flex-col w-full">{component}</div>
    );

    switch (activeView) {
      case 'order-confirmed':
        return paddedView(<div className="md:px-32 flex-grow flex flex-col gap-8 pb-8"><OrderConfirmedView cart={cart} /></div>);
      case 'home':
      default:
        return (
          <>
            {activeView === 'home' && (
              <div className='w-full pt-32'>
                <SearchBar
                  formRef={formRef}
                  activeView={activeView}
                  isEnquireOpen={false}
                  onSubmit={handleSearchSubmit}
                  searchInput={searchInput}
                  onSearchInputChange={setSearchInput}
                />
              </div>
            )}
            <div className="mt-8 w-full flex-grow min-h-0">
              <ExploreCategories />
            </div>
          </>
        );
    }
  };
  
  const mainContentClass = cn(
    "flex flex-col items-center justify-start transition-all duration-500 relative flex-grow min-h-0 pb-16 md:pb-0",
    isPageLoading && 'opacity-0'
  );

  return (
    <>
      {!isMobile && <SparkleBackground />}
      <div className={cn(
        "flex flex-col",
        activeView === 'order-confirmed' ? "min-h-screen" : "h-screen",
        (isPopupOpen && !isCartVisible) ? 'opacity-50' : ''
      )}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={isContentScrolled}
          onReset={handleResetToHome}
          onNavigate={handleHeaderNavigate}
          activeView={activeView}
          onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          isSearchingOnAbout={isSearchingOnAbout}
        />
        <main className={mainContentClass}>
          {renderContent()}
        </main>
        {activeView === 'order-confirmed' && <Footer />}
      </div>

      <PopupsManager
        selectedProduct={selectedProduct}
        isCartVisible={isCartVisible}
        isCartOpen={isCartOpen}
        isProfileOpen={isProfileOpen}
        isSignUpOpen={isSignUpOpen}
        isCompleteDetailsOpen={isCompleteDetailsOpen}
        onClosePopup={handleClosePopup}
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
      <BottomNavbar activeView={activeView} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
