
// @/components/views/ProductDetailClientPage.tsx
'use client';

import { useState, type UIEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SanityProduct } from '@/types';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { ImageGallery } from '@/components/image-gallery';
import { FlavoursSection } from '@/components/flavours-section';
import { ProductDetails } from '@/components/product-details';
import { Separator } from '@/components/ui/separator';
import { ProductPopupFooter } from '@/components/product-popup-footer';
import { FeaturedProducts } from '@/components/featured-products';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSearchHeader } from '@/components/header/mobile-search-header';
import { MobileProductDetailView } from '@/components/views/MobileProductDetailView';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';

interface ProductDetailClientPageProps {
  product: SanityProduct;
  featuredProducts: SanityProduct[];
}

export default function ProductDetailClientPage({ product, featuredProducts }: ProductDetailClientPageProps) {
  const router = useRouter();
  const { cart, updateCart, clearCart, likedProducts, toggleLike, clearWishlist } = useAppContext();
  const isMobile = useIsMobile();
  
  const [flavourCart, setFlavourCart] = useState<Record<string, number>>({});
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setIsScrolled(scrollTop > 0);
  };

  const handleMobileScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    const currentScrollTop = event.currentTarget.scrollTop;
    if (Math.abs(currentScrollTop - lastScrollTop) <= 10) {
      return;
    }

    if (currentScrollTop > lastScrollTop && currentScrollTop > 56) {
      setIsMobileHeaderVisible(false);
    } else {
      setIsMobileHeaderVisible(true);
    }
    setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
  };
  
  const handleSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleAddToCart = (productName: string, quantity: number, animate: boolean = true) => {
    const prevQuantity = cart[productName] || 0;
    updateCart(productName, quantity);
    
    if (animate && quantity > prevQuantity) {
      setCartMessage(`${quantity - prevQuantity} added`);
      setIsCartButtonExpanded(true);
      setTimeout(() => setIsCartButtonExpanded(false), 1500);
    }
  };
  
  const handleFlavourAddToCart = (flavourId: string, quantity: number) => {
    setFlavourCart(prev => {
      const newCart = { ...prev };
      if (quantity > 0) {
        newCart[flavourId] = quantity;
      } else {
        delete newCart[flavourId];
      }
      return newCart;
    });
  };

  const handleBuyNow = () => {
    if (product && (cart[product.name] || 0) === 0) {
      handleAddToCart(product.name, 1, false);
    }
    router.push('/cart');
  };

  const handleNavigation = (view: 'home' | 'cart' | 'profile') => {
    if (view === 'cart') router.push('/cart');
    else if (view === 'profile') router.push('/profile');
    else router.push('/');
  };

  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const handleToggleCartPopup = () => setIsCartOpen(p => !p);
  
  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
        <p className="text-white">Product not found. You may need to fetch this product by its slug from Sanity.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="flex flex-col h-screen">
          <MobileSearchHeader 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit(searchInput);
              }}
              isVisible={isMobileHeaderVisible}
            />
          <main onScroll={handleMobileScroll} className={cn("flex-grow flex flex-col transition-all duration-300 relative min-h-0 pb-16", isMobileHeaderVisible ? 'pt-16' : 'pt-0')}>
            <div className="flex-grow overflow-y-auto no-scrollbar px-4">
              <MobileProductDetailView
                product={product}
                onClose={() => router.back()}
                onAddToCart={handleAddToCart}
                cart={cart}
                onBuyNow={handleBuyNow}
                isLiked={!!likedProducts[product._id]}
                onLikeToggle={() => toggleLike(product._id)}
                flavourCart={flavourCart}
                onFlavourAddToCart={handleFlavourAddToCart}
              />
              <div className="mt-8">
                <FeaturedProducts 
                    products={featuredProducts}
                    onProductClick={handleProductClick}
                    onAddToCart={updateCart}
                    cart={cart}
                    likedProducts={likedProducts}
                    onLikeToggle={toggleLike}
                    isMobile={isMobile}
                />
              </div>
               <div className="h-4" />
            </div>
          </main>
        </div>
        <BottomNavbar activeView={'search'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </>
    );
  }

  return (
    <>
      <SparkleBackground />
      <div className={cn("flex flex-col h-screen", (isProfileOpen || isCartOpen) && 'opacity-50')}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={isScrolled}
          onReset={() => router.push('/')}
          onNavigate={(view) => router.push(`/${view}`)}
          activeView={'search'}
          isUsingAnimatedSearch={true}
          onSearchSubmit={handleSearchSubmit}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
        />
        <main onScroll={handleScroll} className="flex-grow pt-32 md:px-32 flex flex-col gap-8 pb-8 overflow-y-auto no-scrollbar">
          {/* Desktop content is removed as requested */}
        </main>
      </div>
      
      <FloatingCartButton
        activeView={'search'}
        isSearchingOnAbout={true}
        isCartOpen={isCartOpen}
        onToggleCart={handleToggleCartPopup}
        isCartButtonExpanded={isCartButtonExpanded}
        cartMessage={cartMessage}
        cart={cart}
      />

      <PopupsManager
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isCartOpen={isCartOpen}
        onToggleCartPopup={handleToggleCartPopup}
        allProducts={featuredProducts}
        likedProducts={likedProducts}
        onLikeToggle={toggleLike}
        cart={cart}
        onAddToCart={updateCart}
        onClearCart={clearCart}
        onClearWishlist={clearWishlist}
      />
      <BottomNavbar activeView={'search'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
