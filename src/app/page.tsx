'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from "@/components/header";
import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';
import { FilterContainer } from '@/components/filter-container';
import { SearchResultsDetails } from '@/components/search-results-details';
import { Button } from '@/components/ui/button';
import { ProductPopup } from '@/components/product-popup';
import { flavourOptions, occasionOptions, productTypeOptions, weightOptions } from '@/lib/filter-options';
import { LoaderBar } from '@/components/loader-bar';
import { SparkleBackground } from '@/components/sparkle-background';
import { CartPopup } from '@/components/cart-popup';
import { X } from 'lucide-react';
import { LoginPopup } from '@/components/login-popup';
import { SignUpPopup } from '@/components/signup-popup';
import { CompleteDetailsPopup } from '@/components/complete-details-popup';


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

const initialFilterState: FilterState = {
  priceRange: [0, 3000],
  selectedPriceOptions: [],
  selectedFlavours: [],
  selectedOccasions: [],
  selectedProductTypes: [],
  selectedWeights: [],
};


export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCompleteDetailsOpen, setIsCompleteDetailsOpen] = useState(false);

  useEffect(() => {
    if (selectedProduct || isImageExpanded || isCartVisible || isLoginOpen || isSignUpOpen || isCompleteDetailsOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedProduct, isImageExpanded, isCartVisible, isLoginOpen, isSignUpOpen, isCompleteDetailsOpen]);

  useEffect(() => {
    if (isCartOpen) {
      setIsCartVisible(true);
    } else {
      const timer = setTimeout(() => setIsCartVisible(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(true);
    setIsSearching(true);
    setSelectedProduct(null);
    setFilters(initialFilterState);
    setSortOption("featured");
  };
  
  const handleAddToCart = (productName: string, quantity: number, animate: boolean = true) => {
    const newCart = { ...cart, [productName]: quantity };
    if (quantity <= 0) {
      delete newCart[productName];
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
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleToggleCartPopup = () => {
    setIsCartOpen(prev => !prev);
  }

  const handleOpenSignUp = () => {
    setIsSignUpOpen(true);
  };

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleOpenCompleteDetails = () => {
    setIsCompleteDetailsOpen(true);
  }

  const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur, 0);

  const getLabelById = (id: string, options: { id: string, label: string }[]) => {
    return options.find(option => option.id === id)?.label || id;
  };
  
  const activeFilters = [
    ...filters.selectedFlavours.map(id => ({ type: 'selectedFlavours', value: id, label: getLabelById(id, flavourOptions) })),
    ...filters.selectedOccasions.map(id => ({ type: 'selectedOccasions', value: id, label: getLabelById(id, occasionOptions) })),
    ...filters.selectedProductTypes.map(id => ({ type: 'selectedProductTypes', value: id, label: getLabelById(id, productTypeOptions) })),
    ...filters.selectedWeights.map(id => ({ type: 'selectedWeights', value: id, label: getLabelById(id, weightOptions) })),
  ] as { type: keyof FilterState; value: string; label: string }[];

  const isPopupOpen = selectedProduct || isImageExpanded || isCartVisible || isLoginOpen || isSignUpOpen || isCompleteDetailsOpen;

  return (
    <>
      <SparkleBackground />
      <LoaderBar isLoading={isSearching} onAnimationComplete={() => setIsSearching(false)} />
      <div className={cn("flex flex-col h-screen", isPopupOpen ? 'opacity-50' : '')}>
        <Header 
          onSearchSubmit={handleSearchSubmit} 
          onSearchActiveChange={setIsSearchActive} 
          isCartVisible={isCartVisible}
          onLoginOpenChange={setIsLoginOpen}
        />
        <main className={cn(
          "flex-grow overflow-hidden flex transition-all duration-500 relative items-start",
          isSearchActive ? 'pt-36' : 'pt-72'
        )}>
          {!isSearchActive && (
            <div className={cn("transition-opacity duration-500 w-full", isSearchActive ? 'opacity-0' : 'opacity-100 h-full')}>
              <ExploreCategories />
            </div>
          )}
          {isSearchActive && (
            <div className="flex w-full h-full">
              <FilterContainer 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                isSearching={isSearching}
              />
              <div className="h-full flex-grow ml-8 mr-8 relative">
                  <SearchResultsDetails 
                    query={searchQuery} 
                    onAddToCart={handleAddToCart} 
                    cart={cart}
                    onProductClick={handleProductClick}
                    activeFilters={activeFilters}
                    onRemoveFilter={handleRemoveFilter}
                    likedProducts={likedProducts}
                    onLikeToggle={handleLikeToggle}
                    isSearching={isSearching}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                  />
              </div>
            </div>
          )}
        </main>
      </div>

       <div className={cn("fixed bottom-8 right-4 z-[60] transition-all duration-300")}>
          {isSearchActive && (
            <Button
              onClick={handleToggleCartPopup}
              className={cn(
                "shadow-lg bg-custom-gold hover:bg-custom-gold/90 transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden w-14 h-14",
                isCartButtonExpanded && !isCartOpen ? 'w-64 h-14 rounded-full' : 'w-14 h-14 rounded-full'
              )}
              size="icon"
            >
              <div className={cn(
                  "transition-transform duration-500 ease-in-out transform-gpu",
                  isCartOpen && "rotate-180"
              )}>
                {isCartButtonExpanded && !isCartOpen ? (
                  <span className="text-custom-purple-dark font-semibold whitespace-nowrap">{cartMessage}</span>
                ) : isCartOpen ? (
                  <X className="h-8 w-8 text-custom-purple-dark" />
                ) : (
                  <>
                    <Image src="/icons/cart.png" alt="Cart" width={24} height={24} />
                    {totalQuantity > 0 && (
                      <div className="absolute -top-1 -right-1 bg-custom-purple-dark text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {totalQuantity}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Button>
          )}
       </div>

      {selectedProduct && !isCartOpen && (
         <>
          <div className="fixed inset-0 z-40 bg-black/50" />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-36">
              <div className="h-full flex-grow ml-[calc(17%+2rem)] mr-8 relative w-[calc(83%-4rem)]">
                  <ProductPopup 
                    product={selectedProduct} 
                    onClose={handleClosePopup}
                    onImageExpandChange={setIsImageExpanded}
                    isLiked={!!likedProducts[selectedProduct.id]}
                    onLikeToggle={() => handleLikeToggle(selectedProduct.id)}
                    cart={cart}
                    onAddToCart={handleAddToCart}
                  />
              </div>
          </div>
        </>
      )}

      {isCartVisible && (
         <>
          <div className="fixed inset-0 z-40 bg-black/50" />
          <div className={cn("fixed inset-0 z-50 flex items-start justify-center pt-36", isCartOpen ? 'animate-slide-up-in' : 'animate-slide-down-out' )}>
              <div className="h-full flex-grow ml-[calc(17%+2rem)] mr-8 relative w-[calc(83%-4rem)]">
                  <CartPopup
                    onClose={handleToggleCartPopup}
                    cart={cart}
                    onClearCart={handleClearCart}
                    onFinalizeOrder={handleOpenCompleteDetails}
                  />
              </div>
          </div>
        </>
      )}

      <LoginPopup 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen}
        onSignUpClick={handleOpenSignUp}
      />
      <SignUpPopup 
        open={isSignUpOpen}
        onOpenChange={setIsSignUpOpen}
        onLoginClick={handleOpenLogin}
      />
      <CompleteDetailsPopup
        open={isCompleteDetailsOpen}
        onOpenChange={setIsCompleteDetailsOpen}
      />
    </>
  );
}
