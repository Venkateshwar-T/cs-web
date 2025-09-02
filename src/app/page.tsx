'use client';

import { useState, useEffect, type UIEvent } from 'react';
import Image from 'next/image';
import { Header } from "@/components/header";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { flavourOptions, occasionOptions, productTypeOptions, weightOptions } from '@/lib/filter-options';
import { LoaderBar } from '@/components/loader-bar';
import { SparkleBackground } from '@/components/sparkle-background';
import { X } from 'lucide-react';
import { OrderConfirmedView } from '@/components/order-confirmed-view';
import { Footer } from '@/components/footer';
import { AboutView } from '@/components/about-view';
import { HomeView } from '@/components/views/HomeView';
import { SearchView } from '@/components/views/SearchView';
import { PopupsManager } from '@/components/popups/popups-manager';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { FaqView } from '@/components/faq-view';


export type Product = {
  id: number;
  name: string;
};

export type FilterState = {
  priceRange: [number, number];
  selectedPriceOptions: string[];
  selectedFlavours: string[];
  selectedOccasions: string[];
  selectedProductTypes: string[];
  selectedWeights: string[];
};

export type ProfileInfo = {
  name: string;
  phone: string;
  email: string;
}

export type ActiveView = 'home' | 'search' | 'about' | 'faq' | 'order-confirmed';

const initialFilterState: FilterState = {
  priceRange: [0, 3000],
  selectedPriceOptions: [],
  selectedFlavours: [],
  selectedOccasions: [],
  selectedProductTypes: [],
  selectedWeights: [],
};

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({
    'Diwali Collection Box 1': 1,
    'Diwali Collection Box 2': 2,
  });
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({ 0: true, 2: true, 5: true });
  const [sortOption, setSortOption] = useState("featured");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCompleteDetailsOpen, setIsCompleteDetailsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
  });
  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const [isSearchingOnAbout, setIsSearchingOnAbout] = useState(false);
  const [isUsingAnimatedSearch, setIsUsingAnimatedSearch] = useState(false);

  useEffect(() => {
    if (selectedProduct || isImageExpanded || isCartVisible || isSignUpOpen || isCompleteDetailsOpen || isProfileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedProduct, isImageExpanded, isCartVisible, isSignUpOpen, isCompleteDetailsOpen, isProfileOpen]);


  useEffect(() => {
    if (isCartOpen) {
      setIsCartVisible(true);
    } else {
      const timer = setTimeout(() => setIsCartVisible(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const handleSearchSubmit = (query: string, fromAnimated: boolean = false) => {
    setSearchQuery(query);
    if (activeView === 'about' || activeView === 'faq') {
      setIsSearchingOnAbout(true);
    } else {
      setActiveView('search');
    }
    setIsSearching(true);
    setSelectedProduct(null);
    setFilters(initialFilterState);
    setSortOption("featured");
    if (fromAnimated) {
      setIsUsingAnimatedSearch(true);
    }
  };
  
  const handleResetToHome = () => {
    setActiveView('home');
    setSearchQuery('');
    setIsSearchingOnAbout(false);
    setIsUsingAnimatedSearch(false);
  };

  const handleAddToCart = (productName: string, quantity: number, animate: boolean = true) => {
    const newCart = { ...cart };
    if (quantity <= 0) {
      delete newCart[productName];
    } else {
      newCart[productName] = quantity;
    }
    setCart(newCart);

    const prevQuantity = cart[productName] || 0;
    if (animate && quantity > prevQuantity) {
      setCartMessage(`${quantity - prevQuantity} ${productName} added`);
      setIsCartButtonExpanded(true);
  
      setTimeout(() => {
        setIsCartButtonExpanded(false);
      }, 1500);
    }
  };

  const handleClearCart = () => {
    setCart({});
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRemoveFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      if (Array.isArray(currentValues)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      }
      return prev;
    });
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

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    if (activeView === 'order-confirmed' || activeView === 'about' || activeView === 'faq') {
      setIsContentScrolled(scrollTop > 10);
    } else {
      setIsContentScrolled(false);
    }
  };

  const getLabelById = (id: string, options: { id: string, label: string }[]) => {
    return options.find(option => option.id === id)?.label || id;
  };
  
  const activeFilters = [
    ...filters.selectedFlavours.map(id => ({ type: 'selectedFlavours', value: id, label: getLabelById(id, flavourOptions) })),
    ...filters.selectedOccasions.map(id => ({ type: 'selectedOccasions', value: id, label: getLabelById(id, occasionOptions) })),
    ...filters.selectedProductTypes.map(id => ({ type: 'selectedProductTypes', value: id, label: getLabelById(id, productTypeOptions) })),
    ...filters.selectedWeights.map(id => ({ type: 'selectedWeights', value: id, label: getLabelById(id, weightOptions) })),
  ] as { type: keyof FilterState; value: string; label: string }[];

  const isPopupOpen = selectedProduct || isImageExpanded || isCartVisible || isSignUpOpen || isCompleteDetailsOpen || isProfileOpen;

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'search':
      case 'about':
      case 'faq':
        if (isSearchingOnAbout) {
          return (
            <SearchView
              filters={filters}
              onFilterChange={handleFilterChange}
              isSearching={isSearching}
              products={allProducts}
              query={searchQuery}
              onAddToCart={handleAddToCart}
              cart={cart}
              onProductClick={handleProductClick}
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              likedProducts={likedProducts}
              onLikeToggle={handleLikeToggle}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
          );
        }
        if (activeView === 'about') {
          return (
            <div className="flex flex-col flex-grow">
              <div className="flex-grow">
                <AboutView />
              </div>
              <Footer />
            </div>
          );
        }
         if (activeView === 'faq') {
          return (
            <div className="flex flex-col flex-grow">
              <div className="flex-grow">
                <FaqView />
              </div>
              <Footer />
            </div>
          );
        }
        // This case handles 'search' view itself
        return (
          <SearchView
            filters={filters}
            onFilterChange={handleFilterChange}
            isSearching={isSearching}
            products={allProducts}
            query={searchQuery}
            onAddToCart={handleAddToCart}
            cart={cart}
            onProductClick={handleProductClick}
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            likedProducts={likedProducts}
            onLikeToggle={handleLikeToggle}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        );
      case 'order-confirmed':
        return (
          <>
            <div className="pb-8 mx-8 md:mx-32">
              <OrderConfirmedView cart={cart} />
            </div>
            <Footer />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SparkleBackground />
      <LoaderBar isLoading={isSearching} onAnimationComplete={() => setIsSearching(false)} />
      <div className={cn("flex flex-col h-screen", isPopupOpen ? 'opacity-50' : '')}>
        <Header 
          onSearchSubmit={handleSearchSubmit} 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={isContentScrolled}
          onReset={handleResetToHome}
          onNavigate={(view) => setActiveView(view as ActiveView)}
          activeView={activeView}
          isSearchingOnAbout={isSearchingOnAbout}
          isUsingAnimatedSearch={isUsingAnimatedSearch}
        />
        <main onScroll={handleScroll} className={cn(
          "flex-grow flex flex-col transition-all duration-500 relative",
          activeView === 'home' ? 'pt-72 overflow-hidden' : 'pt-36 overflow-y-auto',
          (activeView === 'order-confirmed' || (activeView === 'about' && !isSearchingOnAbout) || (activeView === 'faq' && !isSearchingOnAbout)) && 'no-scrollbar'
        )}>
           {renderActiveView()}
        </main>
      </div>

      <FloatingCartButton
        activeView={activeView}
        isSearchingOnAbout={isSearchingOnAbout}
        isCartOpen={isCartOpen}
        onToggleCart={handleToggleCartPopup}
        isCartButtonExpanded={isCartButtonExpanded}
        cartMessage={cartMessage}
        cart={cart}
      />

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
    </>
  );
}
