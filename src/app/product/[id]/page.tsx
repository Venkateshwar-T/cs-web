
'use client';

import { useState, useEffect, type UIEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import type { Product, ProfileInfo, ActiveView } from '@/app/page';
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
import { ProductCard } from '@/components/product-card';
import { SectionTitle } from '@/components/section-title';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const { cart, updateCart, clearCart } = useCart();
  const isMobile = useIsMobile();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
  const [flavourCart, setFlavourCart] = useState<Record<string, number>>({});
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCompleteDetailsOpen, setIsCompleteDetailsOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
  });
  const [searchInput, setSearchInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [isCartButtonExpanded, setIsCartButtonExpanded] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);

  useEffect(() => {
    if (params.id) {
      const productId = parseInt(params.id as string, 10);
      const foundProduct = allProducts.find(p => p.id === productId);
      setProduct(foundProduct || null);
    }
  }, [params.id]);

  useEffect(() => {
    if (isCartOpen) {
      setIsCartVisible(true);
    } else {
      const timer = setTimeout(() => setIsCartVisible(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);
  
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

  const handleLikeToggle = (productId: number) => {
    setLikedProducts(prev => ({ ...prev, [productId]: !prev[productId] }));
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
  
  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    setFlavourCart(prev => {
      const newCart = { ...prev };
      if (quantity > 0) {
        newCart[flavourId.toString()] = quantity;
      } else {
        delete newCart[flavourId.toString()];
      }
      return newCart;
    });
  };

  const handleToggleCartPopup = () => setIsCartOpen(p => !p);

  const handleNavigation = (view: ActiveView) => {
    if (view === 'cart') router.push('/cart');
    else if (view === 'profile') router.push('/profile');
    else router.push('/');
  };

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...updatedProfile }));
  };

  const handleConfirmOrder = (name: string, phone: string) => {
    setProfileInfo(prev => ({ ...prev, name, phone }));
    router.push('/order-confirmed');
    setIsCartOpen(false);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };
  
  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <SparkleBackground />
        <p className="text-white">Product not found.</p>
      </div>
    );
  }
  
  const isPopupOpen = isCartVisible || isProfileOpen || isSignUpOpen || isCompleteDetailsOpen || isImageExpanded;

  if (isMobile) {
    return (
      <>
        <SparkleBackground />
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
                onToggleCartPopup={handleToggleCartPopup}
                isLiked={!!likedProducts[product.id]}
                onLikeToggle={() => handleLikeToggle(product.id)}
                flavourCart={flavourCart}
                onFlavourAddToCart={handleFlavourAddToCart}
              />
              <div className="mt-8">
                <div className="bg-white/10 rounded-2xl p-4">
                    <SectionTitle className="text-base mb-3 p-0 text-center">You might also like</SectionTitle>
                    <div className="flex items-stretch overflow-x-auto no-scrollbar gap-4">
                        {allProducts.slice(0, 6).map(p => (
                             <div key={p.id} className="flex-shrink-0 w-40">
                                <ProductCard
                                  product={p}
                                  onProductClick={handleProductClick}
                                  onAddToCart={handleAddToCart}
                                  quantity={cart[p.name] || 0}
                                  isLiked={!!likedProducts[p.id]}
                                  onLikeToggle={() => handleLikeToggle(p.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
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
      <div className={cn("flex flex-col h-screen", isPopupOpen && 'opacity-50')}>
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
          <div className="px-4 sm:px-6 lg:px-8 flex flex-col">
            <div className="relative w-full flex-grow flex flex-col">
              <div className={cn("bg-[#9A7DAB] rounded-[40px] pt-6 md:px-4 lg:px-5 xl:px-8 text-white overflow-hidden relative flex flex-col")}>
                               
                <div className="flex flex-row flex-grow md:gap-4 lg:gap-4 xl:gap-8">
                  {/* Left Section */}
                  <div className="w-[48%] flex flex-col gap-4 h-full items-center">
                    <div className="flex md:h-full xl:h-[45%] rounded-lg w-full justify-center">
                      <ImageGallery product={product} onImageExpandChange={setIsImageExpanded} />
                    </div>
                    <div className="pb-6 rounded-lg w-full h-[55%]">
                      <FlavoursSection onAddToCart={handleFlavourAddToCart} cart={flavourCart} />
                    </div>
                  </div>
                  
                  <Separator orientation="vertical" className="bg-white/50 h-[95%] w-0.5" />

                  {/* Right Section */}
                  <div className="flex-grow h-full xl:relative lg:relative">
                      <div className="h-full py-0 pr-6 overflow-y-auto custom-scrollbar pb-28">
                          <ProductDetails product={product} isLiked={!!likedProducts[product.id]} onLikeToggle={() => handleLikeToggle(product.id)} isMobile={false} />
                      </div>
                      <ProductPopupFooter product={product} onAddToCart={handleAddToCart} quantity={cart[product.name] || 0} onToggleCartPopup={onToggleCartPopup} />
                  </div>
                </div>
              </div>
            </div>
          </div>
           <FeaturedProducts 
              products={allProducts}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              cart={cart}
              likedProducts={likedProducts}
              onLikeToggle={handleLikeToggle}
            />
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
        selectedProduct={null}
        isCartVisible={isCartVisible}
        isCartOpen={isCartOpen}
        isProfileOpen={isProfileOpen}
        isSignUpOpen={isSignUpOpen}
        isCompleteDetailsOpen={isCompleteDetailsOpen}
        onClosePopup={() => {}}
        onImageExpandChange={setIsImageExpanded}
        likedProducts={likedProducts}
        onLikeToggle={handleLikeToggle}
        cart={cart}
        onAddToCart={handleAddToCart}
        onToggleCartPopup={handleToggleCartPopup}
        onClearCart={clearCart}
        onFinalizeOrder={() => setIsCompleteDetailsOpen(true)}
        onProfileUpdate={handleProfileUpdate}
        profileInfo={profileInfo}
        allProducts={allProducts}
        onClearWishlist={() => setLikedProducts({})}
        setIsProfileOpen={setIsProfileOpen}
        setIsSignUpOpen={setIsSignUpOpen}
        onLoginClick={() => setIsSignUpOpen(true)}
        setIsCompleteDetailsOpen={setIsCompleteDetailsOpen}
        onConfirmOrder={handleConfirmOrder}
      />
      <BottomNavbar activeView={'search'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
