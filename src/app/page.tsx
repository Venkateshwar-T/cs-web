
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


export type Product = {
  id: number;
  name: string;
};

export type ProfileInfo = {
  name: string;
  phone: string;
  email: string;
}

export type ActiveView = 'home' | 'search' | 'about' | 'faq' | 'order-confirmed' | 'cart' | 'profile';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [cart, setCart] = useState<Record<string, number>>({});
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
  };

  const handleAddToCart = (productName: string, quantity: number) => {
    const newCart = { ...cart };
    if (quantity <= 0) {
      delete newCart[productName];
    } else {
      newCart[productName] = quantity;
    }
    setCart(newCart);
  };

  const handleClearCart = () => {
    setCart({});
  };

  const handleProductClick = (product: Product) => {
     if (isMobile) {
      setSelectedProductForMobile(product);
    } else {
      setSelectedProduct(product);
    }
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
    setActiveView('order-confirmed');
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
      setIsProfileOpen(true);
    } else {
       router.push('/');
      setActiveView(view);
    }
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      <SparkleBackground />
      <div className={cn("flex flex-col h-screen", (isPopupOpen && !isCartVisible) ? 'opacity-50' : '')}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={isContentScrolled}
          onReset={handleResetToHome}
          onNavigate={(view) => router.push(view)}
          activeView={activeView}
        />
        <main className={cn(
          "flex flex-col items-center justify-start transition-all duration-500 relative flex-grow min-h-0",
          "pt-28",
          isPageLoading && 'opacity-0'
        )}>
          <div className='w-full'>
            <SearchBar
              formRef={formRef}
              activeView={activeView}
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
        onClearCart={handleClearCart}
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
