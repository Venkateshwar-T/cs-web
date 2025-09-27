// src/components/views/SearchClientPage.tsx
'use client';

import { useState, useEffect, type UIEvent, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ActiveView } from '@/app/page';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';
import { SearchView } from '@/components/views/SearchView';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SanityProduct, StructuredFilter } from '@/types';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { MobileSearchHeader } from '@/components/header/mobile-search-header';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';
import { FlavourSelectionPopup } from '../flavour-selection-popup';

interface SearchClientPageProps {
  initialProducts: SanityProduct[];
  initialFilters: StructuredFilter[];
}

function formatCategoryTitleToKey(title: string) {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

export default function SearchClientPage({ initialProducts, initialFilters }: SearchClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const sortQuery = searchParams.get('sort') || 'featured';
  
  const { 
    cart, 
    updateCart, 
    clearCart, 
    likedProducts, 
    toggleLike,
    clearWishlist,
    flavourSelection,
    setFlavourSelection,
  } = useAppContext();
  const [isSearching, setIsSearching] = useState(true);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [sortOption, setSortOption] = useState(sortQuery);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState(query);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (isNewSearch) {
      const timer = setTimeout(() => setIsNewSearch(false), 50);
      return () => clearTimeout(timer);
    }
  }, [isNewSearch]);

  const handleAddToCart = (productName: string, quantity: number) => {
    const prevQuantity = cart[productName]?.quantity || 0;

    if (quantity < prevQuantity) {
      updateCart(productName, quantity);
      return;
    }

    if (quantity > 0 && prevQuantity === 0) {
      const productToSelect = initialProducts.find(p => p.name === productName);
      if (productToSelect) {
        setFlavourSelection({ product: productToSelect, isOpen: true });
        return;
      }
    }

    updateCart(productName, quantity);
  };

  const handleFlavourConfirm = (productName: string, flavours: string[]) => {
    const prevQuantity = cart[productName]?.quantity || 0;
    updateCart(productName, prevQuantity + 1, flavours);

    // Show notification only after flavours are confirmed
    setCartMessage(`${productName} added`);
    setIsCartButtonExpanded(true);
    setTimeout(() => setIsCartButtonExpanded(false), 2000);
  };

  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const handleSearchSubmit = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', value);
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const getActiveFilters = () => {
    const active: { type: string; value: string; label: string }[] = [];
    const filterKeys = initialFilters.map(f => formatCategoryTitleToKey(f.title));
    
    for (const [key, value] of searchParams.entries()) {
      if (filterKeys.includes(key)) {
        active.push({ type: key, value: value, label: value });
      }
    }
    return active;
  };

  const activeFilters = getActiveFilters();

  const handleRemoveFilter = useCallback((categoryKey: string, optionTitle: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const existingValues = params.getAll(categoryKey);
    const newValues = existingValues.filter(v => v !== optionTitle);
    
    params.delete(categoryKey);
    newValues.forEach(v => params.append(categoryKey, v));
    
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const handleToggleCartPopup = () => setIsCartOpen(p => !p);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`);
    if (isMobile) {
      setIsSortSheetOpen(false);
    }
  };
  
  const handleNavigation = (view: ActiveView) => {
    router.push(view === 'home' ? '/' : `/${view}`);
  };

  const cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const currentScrollTop = event.currentTarget.scrollTop;
    if (Math.abs(currentScrollTop - lastScrollTop) <= 10) return;
    setIsMobileHeaderVisible(currentScrollTop <= lastScrollTop || currentScrollTop <= 56);
    setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
  };
  
  const onProductCardAddToCart = (product: SanityProduct) => {
    const prevQuantity = cart[product.name]?.quantity || 0;
    if (prevQuantity === 0) {
      setFlavourSelection({ product, isOpen: true });
    } else {
      updateCart(product.name, prevQuantity + 1);
    }
  };

  const onProductCardRemoveFromCart = (product: SanityProduct) => {
    const prevQuantity = cart[product.name]?.quantity || 0;
    if (prevQuantity > 0) {
      updateCart(product.name, prevQuantity - 1);
    }
  };

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen", (isProfileOpen || isCartOpen) ? 'opacity-50' : '')}>
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
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0 md:pb-0",
          isMobile ? (isMobileHeaderVisible ? "pt-16" : "pt-0") : "pt-32"
        )}>
           <SearchView
             filters={initialFilters}
             isSearching={isSearching}
             isNewSearch={isNewSearch}
             products={initialProducts}
             query={query}
             onAddToCart={handleAddToCart}
             onProductCardAddToCart={onProductCardAddToCart}
             onProductCardRemoveFromCart={onProductCardRemoveFromCart}
             cart={cart}
             onProductClick={handleProductClick}
             activeFilters={activeFilters}
             onRemoveFilter={handleRemoveFilter}
             likedProducts={likedProducts}
             onLikeToggle={toggleLike}
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
        likedProducts={likedProducts}
        onLikeToggle={toggleLike}
        cart={cart}
        onAddToCart={updateCart}
        onClearCart={clearCart}
        onToggleCartPopup={handleToggleCartPopup}
        allProducts={initialProducts} // Pass real products to popups
        onClearWishlist={clearWishlist}
        isCartOpen={isCartOpen}
        onProductClick={handleProductClick}
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
       <FlavourSelectionPopup
        product={flavourSelection.product}
        open={flavourSelection.isOpen}
        onOpenChange={(isOpen) => setFlavourSelection({ product: null, isOpen })}
        onConfirm={handleFlavourConfirm}
      />
    </>
  );
}
