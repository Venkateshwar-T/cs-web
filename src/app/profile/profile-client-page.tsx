
// @/app/profile/profile-client-page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView } from '@/app/page';
import type { SanityProduct } from '@/types';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileMobileView } from '@/components/profile-mobile-view';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';
import { Loader } from '@/components/loader';
import { EmptyState } from '@/components/empty-state';
import type { ProfileInfo } from '@/context/app-context';
import { PopupsManager } from '@/components/popups/popups-manager';
import { FlavourSelectionPopup } from '@/components/flavour-selection-popup';

interface ProfileClientPageProps {
  allProducts: SanityProduct[];
}

export default function ProfileClientPage({ allProducts }: ProfileClientPageProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { 
    cart, 
    updateCart,
    profileInfo, 
    updateProfileInfo, 
    isProfileLoaded,
    likedProducts,
    toggleLike,
    clearWishlist,
    isAuthenticated,
    setAuthPopup,
    clearCart,
    logout,
    authPopup,
    flavourSelection,
    setFlavourSelection,
  } = useAppContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  if (!isProfileLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
      </div>
    )
  }
  
  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'cart') {
      router.push('/cart');
    }
    // If view is 'profile', do nothing as we are already on the page.
  };

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  }

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    updateProfileInfo(updatedProfile);
  };
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };
  
  const handleLoginClick = () => {
    setAuthPopup('login');
  }
  
  const handleDesktopProfileClick = () => {
    setIsProfileOpen(true);
  }

  const handleFlavourConfirm = (productName: string, flavours: string[]) => {
    const prevQuantity = cart[productName]?.quantity || 0;
    updateCart(productName, prevQuantity + 1, flavours);
  };

  const cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen", (isProfileOpen || !!authPopup || flavourSelection.isOpen) && 'opacity-50')}>
        <Header
          onProfileOpenChange={handleDesktopProfileClick}
          isContentScrolled={false}
          onReset={() => router.push('/')}
          onNavigate={handleHeaderNavigate}
          activeView={'profile'}
          isUsingAnimatedSearch={false}
        />
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0 md:pb-0",
          "pt-24" 
        )}>
          {isMobile ? (
            <ProfileMobileView 
              profile={profileInfo}
              onProfileUpdate={handleProfileUpdate}
              products={allProducts}
              likedProducts={likedProducts}
              onLikeToggle={toggleLike}
              onAddToCart={updateCart}
              cart={cart}
              onClearWishlist={clearWishlist}
              isAuthenticated={isAuthenticated}
              onLoginClick={handleLoginClick}
            />
          ) : isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
               <h2 className="text-2xl font-bold text-white">Welcome, {profileInfo.name}!</h2>
                <p className="text-white/70 max-w-xs">
                  You can view and edit your profile details by clicking the profile icon in the header.
                </p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center h-full px-4 pb-24">
              <EmptyState 
                imageUrl='/icons/profile_drpdwn_btn.png'
                title="You're Not Logged In"
                description="Log in or create an account to view your profile, orders, and wishlist."
                buttonText="Log In / Sign Up"
                onButtonClick={handleLoginClick}
                imageClassName='w-24 h-24'
              />
            </div>
          )}
        </main>
        <BottomNavbar activeView={'profile'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </div>
       <PopupsManager
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          allProducts={allProducts}
          likedProducts={likedProducts}
          onLikeToggle={toggleLike}
          cart={cart}
          onAddToCart={updateCart}
          onClearWishlist={clearWishlist}
          onProductClick={handleProductClick}
          onClearCart={clearCart}
          onLogout={logout}
      />
      <FlavourSelectionPopup
        product={flavourSelection.product}
        open={flavourSelection.isOpen}
        onOpenChange={(isOpen) => setFlavourSelection({ product: null, isOpen })}
        onConfirm={handleFlavourConfirm}
      />
    </>
  );
}
