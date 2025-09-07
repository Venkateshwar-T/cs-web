
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import type { Product, ProfileInfo, ActiveView } from '@/app/page';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';
import { OrderConfirmedView } from '@/components/order-confirmed-view';
import { Footer } from '@/components/footer';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

export default function OrderConfirmedPage() {
  const router = useRouter();
  const { cart, updateCart, clearCart } = useCart();
  
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
  
  const handleSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleNavigation = (view: ActiveView) => {
    if (view === 'cart') router.push('/cart');
    else if (view === 'profile') router.push('/profile');
    else router.push('/');
  };

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...updatedProfile }));
  };
  
  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
  const isPopupOpen = isCartVisible || isProfileOpen || isSignUpOpen || isCompleteDetailsOpen;

  return (
    <>
      <SparkleBackground />
      <div className={cn("flex flex-col min-h-screen", isPopupOpen && 'opacity-50')}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={true}
          onReset={() => router.push('/')}
          onNavigate={(view) => router.push(`/?view=${view}`)}
          activeView={'order-confirmed'}
          onSearchSubmit={handleSearchSubmit}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
        />
        <main className="flex-grow pt-36 md:px-32 flex flex-col gap-8 pb-8">
            <OrderConfirmedView cart={cart} />
        </main>
        <Footer />
      </div>
      
      <PopupsManager
        selectedProduct={null}
        isCartVisible={isCartVisible}
        isCartOpen={isCartOpen}
        isProfileOpen={isProfileOpen}
        isSignUpOpen={isSignUpOpen}
        isCompleteDetailsOpen={isCompleteDetailsOpen}
        onClosePopup={() => {}}
        onImageExpandChange={() => {}}
        likedProducts={{}}
        onLikeToggle={() => {}}
        cart={cart}
        onAddToCart={updateCart}
        onToggleCartPopup={() => setIsCartOpen(p => !p)}
        onClearCart={clearCart}
        onFinalizeOrder={() => setIsCompleteDetailsOpen(true)}
        onProfileUpdate={handleProfileUpdate}
        profileInfo={profileInfo}
        allProducts={allProducts}
        onClearWishlist={() => {}}
        setIsProfileOpen={setIsProfileOpen}
        setIsSignUpOpen={setIsSignUpOpen}
        onLoginClick={() => setIsSignUpOpen(true)}
        setIsCompleteDetailsOpen={setIsCompleteDetailsOpen}
        onConfirmOrder={() => {}}
      />
      <BottomNavbar activeView={'order-confirmed'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
