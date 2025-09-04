
'use client';

import { Suspense, useState, useEffect, type UIEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';
import { SearchView } from '@/components/views/SearchView';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileProductDetailView } from '@/components/views/MobileProductDetailView';
import { flavourOptions, occasionOptions, productTypeOptions, weightOptions } from '@/lib/filter-options';
import type { Product, FilterState, ProfileInfo, ActiveView } from '@/app/page';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { MobileSearchHeader } from '@/components/header/mobile-search-header';

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

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [isSearching, setIsSearching] = useState(true);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [selectedProductForMobile, setSelectedProductForMobile] = useState<Product | null>(null);
  const [mobileFlavourCart, setMobileFlavourCart] = useState<Record<string, number>>({});
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState(query);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);


  useEffect(() => {
    setIsSearching(true);
    setIsNewSearch(true);
    const timer = setTimeout(() => setIsSearching(false), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isNewSearch) {
      const timer = setTimeout(() => setIsNewSearch(false), 50);
      return () => clearTimeout(timer);
    }
  }, [isNewSearch]);

  useEffect(() => {
    if (isCartOpen) {
      setIsCartVisible(true);
    } else {
      const timer = setTimeout(() => setIsCartVisible(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

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
      setCartMessage(`${quantity - prevQuantity} added`);
      setIsCartButtonExpanded(true);
      setTimeout(() => setIsCartButtonExpanded(false), 1500);
    }
  };
  
    const handleMobileFlavourAddToCart = (flavourId: number, quantity: number) => {
    const newFlavourCart = { ...mobileFlavourCart, [flavourId.toString()]: quantity };
    if (quantity <= 0) {
      delete newFlavourCart[flavourId.toString()];
    }
    setMobileFlavourCart(newFlavourCart);
  };

  const handleClearCart = () => setCart({});

  const handleProductClick = (product: Product) => {
    if (isMobile) {
      setSelectedProductForMobile(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleSearchSubmit = (value: string) => {
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleClosePopup = () => setSelectedProduct(null);
  
  const handleCloseMobileProductDetail = () => setSelectedProductForMobile(null);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setIsSearching(true);
    setFilters(prev => ({ ...prev, ...newFilters }));
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleRemoveFilter = (filterType: keyof FilterState, value: string) => {
    setIsSearching(true);
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
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleLikeToggle = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = { ...prev };
      if (newLiked[productId]) delete newLiked[productId];
      else newLiked[productId] = true;
      return newLiked;
    });
  };

  const handleClearWishlist = () => setLikedProducts({});

  const handleToggleCartPopup = () => setIsCartOpen(prev => !prev);
  
  const handleOpenSignUp = () => setIsSignUpOpen(true);
  
  const handleOpenCompleteDetails = () => {
    setSelectedProduct(null);
    setIsCompleteDetailsOpen(true);
  };
  
  const handleConfirmOrder = (name: string, phone: string) => {
    setProfileInfo(prev => ({ ...prev, name, phone }));
    // Navigate to order confirmed page or show a confirmation view
    router.push('/order-confirmed'); 
    setIsCartOpen(false);
  };
  
  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...updatedProfile }));
  };

  const handleSortChange = (value: string) => {
    setIsSearching(true);
    setSortOption(value);
    setIsSortSheetOpen(false);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    const currentScrollTop = event.currentTarget.scrollTop;
    // A small threshold to prevent hiding the header on minor scrolls
    if (Math.abs(currentScrollTop - lastScrollTop) <= 10) {
      return;
    }

    if (currentScrollTop > lastScrollTop && currentScrollTop > 56) { // 56px is header height
      setIsMobileHeaderVisible(false);
    } else {
      setIsMobileHeaderVisible(true);
    }
    setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
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

  return (
    <>
      <SparkleBackground />
      <div className={cn("flex flex-col h-screen", isPopupOpen ? 'opacity-50' : '')}>
        {isMobile ? (
          <MobileSearchHeader 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(searchInput);
            }}
            isVisible={isMobileHeaderVisible}
          />
        ) : (
          <Header 
            onSearchSubmit={handleSearchSubmit}
            onProfileOpenChange={setIsProfileOpen}
            isContentScrolled={isContentScrolled}
            onReset={() => router.push('/')}
            onNavigate={(view) => router.push(`/${view}`)}
            activeView={'search'}
            isSearchingOnAbout={false}
            isUsingAnimatedSearch={false}
          />
        )}
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-500 relative min-h-0",
          "pb-16 md:pb-0",
          isMobile ? "pt-16" : "pt-24 md:pt-36"
        )}>
           <SearchView
              filters={filters}
              onFilterChange={handleFilterChange}
              isSearching={isSearching}
              isNewSearch={isNewSearch}
              products={allProducts}
              query={query}
              onAddToCart={handleAddToCart}
              cart={cart}
              onProductClick={handleProductClick}
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              likedProducts={likedProducts}
              onLikeToggle={handleLikeToggle}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              isFilterSheetOpen={isFilterSheetOpen}
              onFilterSheetOpenChange={setIsFilterSheetOpen}
              isSortSheetOpen={isSortSheetOpen}
              onSortSheetOpenChange={setIsSortSheetOpen}
              selectedProductForMobile={selectedProductForMobile}
              onCloseMobileProductDetail={handleCloseMobileProductDetail}
              onScroll={handleScroll}
            />
        </main>
      </div>

      {!isMobile && (
        <FloatingCartButton
          activeView={'search'}
          isSearchingOnAbout={true}
          isCartOpen={isCartOpen}
          onToggleCart={handleToggleCartPopup}
          isCartButtonExpanded={isCartButtonExpanded}
          cartMessage={cartMessage}
          cart={cart}
        />
      )}
      
      {selectedProductForMobile && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" />
          <div className="fixed inset-x-4 bottom-16 top-24 z-[60] md:hidden">
            <MobileProductDetailView 
              product={selectedProductForMobile} 
              onClose={handleCloseMobileProductDetail} 
              onAddToCart={handleAddToCart}
              cart={cart}
              onToggleCartPopup={handleToggleCartPopup}
              isLiked={!!likedProducts[selectedProductForMobile.id]}
              onLikeToggle={() => handleLikeToggle(selectedProductForMobile.id)}
              onFlavourAddToCart={handleMobileFlavourAddToCart}
              flavourCart={mobileFlavourCart}
            />
          </div>
        </>
      )}

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
      <BottomNavbar activeView={'search'} onNavigate={(view) => router.push(view === 'home' ? '/' : `/${view}`)} />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageComponent />
    </Suspense>
  )
}
