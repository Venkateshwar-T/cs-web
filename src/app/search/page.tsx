
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
import { flavourOptions, occasionOptions, productTypeOptions, weightOptions } from '@/lib/filter-options';
import type { Product } from '@/app/page';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { MobileSearchHeader } from '@/components/header/mobile-search-header';
import { useCart } from '@/hooks/use-cart';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';

type FilterState = {
  priceRange: [number, number];
  selectedPriceOptions: string[];
  selectedFlavours: string[];
  selectedOccasions: string[];
  selectedProductTypes: string[];
  selectedWeights: string[];
};

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
  const { cart, updateCart, clearCart } = useCart();
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
  const [sortOption, setSortOption] = useState("featured");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState(query);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const isCartVisible = isCartOpen;

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

  const handleAddToCart = (productName: string, quantity: number, animate: boolean = true) => {
    const prevQuantity = cart[productName] || 0;
    updateCart(productName, quantity);

    if (animate && quantity > prevQuantity) {
      setCartMessage(`${quantity - prevQuantity} added`);
      setIsCartButtonExpanded(true);
      setTimeout(() => setIsCartButtonExpanded(false), 1500);
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleSearchSubmit = (value: string) => {
    setSearchInput(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

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

  const handleToggleCartPopup = () => setIsCartOpen(p => !p);

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
    ...filters.selectedFlavours.map(id => ({ type: 'selectedFlavours' as const, value: id, label: getLabelById(id, flavourOptions) })),
    ...filters.selectedOccasions.map(id => ({ type: 'selectedOccasions' as const, value: id, label: getLabelById(id, occasionOptions) })),
    ...filters.selectedProductTypes.map(id => ({ type: 'selectedProductTypes' as const, value: id, label: getLabelById(id, productTypeOptions) })),
    ...filters.selectedWeights.map(id => ({ type: 'selectedWeights' as const, value: id, label: getLabelById(id, weightOptions) })),
  ];
  
  const handleNavigation = (view: 'home' | 'cart' | 'profile') => {
    if (view === 'cart') {
      router.push('/cart');
    } else if (view === 'home') {
      router.push('/');
    } else if (view === 'profile') {
      router.push('/profile');
    }
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen", isProfileOpen || isCartVisible ? 'opacity-50' : '')}>
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
            isContentScrolled={false}
            onReset={() => router.push('/')}
            onNavigate={(view) => router.push(`/${view}`)}
            activeView={'search'}
            isSearchingOnAbout={false}
            isUsingAnimatedSearch={true}
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
          />
        )}
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0",
          "pb-16 md:pb-0",
          isMobile ? (isMobileHeaderVisible ? 'pt-16' : 'pt-0') : "pt-36"
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
              onScroll={handleScroll}
              isMobile={isMobile}
            />
        </main>
        <BottomNavbar activeView={'search'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </div>

      <PopupsManager
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          profileInfo={{
            name: 'John Doe',
            phone: '+1 234 567 890',
            email: 'john.doe@example.com',
          }}
          onProfileUpdate={(updatedProfile: Partial<any>) => console.log("Profile updated", updatedProfile)}
          likedProducts={likedProducts}
          onLikeToggle={handleLikeToggle}
          cart={cart}
          onAddToCart={updateCart}
          onClearCart={clearCart}
          onToggleCartPopup={handleToggleCartPopup}
          allProducts={allProducts}
          onClearWishlist={handleClearWishlist}
          isCartOpen={isCartOpen}
          onFinalizeOrder={() => {
            setIsCartOpen(false);
            router.push('/order-confirmed');
          }}
        />

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

    
