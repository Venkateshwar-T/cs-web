
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView, ProfileInfo, Product } from '@/app/page';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileMobileView } from '@/components/profile-mobile-view';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';
import { Loader } from '@/components/loader';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ActiveView>('profile');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    clearWishlist
  } = useAppContext();

  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'cart') {
      router.push('/cart');
    }
    // If view is 'profile', do nothing as we are already on the page.
  };

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/?view=${view}`);
  }

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    updateProfileInfo(updatedProfile);
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
  
  if (!isProfileLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
      </div>
    )
  }

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className="flex flex-col h-screen">
        <Header
          onProfileOpenChange={setIsProfileOpen}
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
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
              <h2 className="text-2xl font-bold text-white">Desktop Profile View</h2>
              <p className="text-white/70 max-w-xs">
                This is a placeholder for the desktop profile view.
              </p>
            </div>
          )}
        </main>
        <BottomNavbar activeView={activeView} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </div>
    </>
  );
}
