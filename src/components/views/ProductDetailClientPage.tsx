

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
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSearchHeader } from '@/components/header/mobile-search-header';
import { MobileProductDetailView } from '@/components/views/MobileProductDetailView';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';
import { FeaturedProducts } from '../featured-products';
import { Separator } from '../ui/separator';
import { ProductDetails } from '../product-details';
import { ProductPopupFooter } from '../product-popup-footer';
import { ImageGallery } from '../image-gallery';
import { FlavoursSection } from '../flavours-section';

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
  const [isImageExpanded, setIsImageExpanded] = useState(false);

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
      <div className={cn("flex flex-col h-screen", (isProfileOpen || isCartOpen || isImageExpanded))}>
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
        <main onScroll={handleScroll} className="pt-24 md:pt-32 overflow-y-auto no-scrollbar">
             <div className="bg-[#9A7DAB] rounded-[40px] text-white mx-32 h-[82vh] flex items-center justify-center">
                <div className="flex w-full h-full px-5 gap-4 pr-10">
                    <div className="w-1/2 h-full flex flex-col">
                        <div className="flex h-[46%] rounded-lg w-full justify-center pt-6">
                            <ImageGallery product={product} onImageExpandChange={setIsImageExpanded} />
                        </div>
                        <div className="py-6 px-6 rounded-lg w-full flex-grow min-h-0">
                            <FlavoursSection availableFlavours={product.availableFlavours || []} onAddToCart={handleFlavourAddToCart} cart={flavourCart} />
                        </div>
                    </div>
                    <Separator orientation="vertical" className="bg-white/30 h-[98%] self-center mr-4" />
                    <div className="h-full relative py-4 w-1/2 flex flex-col">
                        <div className="flex-grow overflow-y-auto no-scrollbar mb-16 min-h-0">
                            <ProductDetails
                                product={product}
                                isLiked={!!likedProducts[product._id]}
                                onLikeToggle={() => toggleLike(product._id)}
                            />
                        </div>
                        <div className="flex-shrink-0">
                          <ProductPopupFooter
                              product={product}
                              quantity={cart[product.name] || 0}
                              onAddToCart={handleAddToCart}
                              onToggleCartPopup={handleToggleCartPopup}
                          />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-24 py-8 mb-8">
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
