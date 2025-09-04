
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView, ProfileInfo } from '@/app/page';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { PopupsManager } from '@/components/popups/popups-manager';

export default function CartPage() {
  const [activeView, setActiveView] = useState<ActiveView>('cart');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'profile') {
      setIsProfileOpen(true);
    }
    // If view is 'cart', do nothing as we are already on the page.
  };

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/?view=${view}`);
  }

  return (
    <>
      <SparkleBackground />
      <div className="flex flex-col h-screen">
        <Header
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={false}
          onReset={() => router.push('/')}
          onNavigate={handleHeaderNavigate}
          activeView={'cart'}
        />
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0",
          "pt-24 md:pt-36",
          "pb-16 md:pb-0"
        )}>
          {/* Cart content will go here */}
        </main>
        <BottomNavbar activeView={activeView} onNavigate={handleNavigation} />
      </div>

      <PopupsManager
        selectedProduct={null}
        isCartVisible={false}
        isCartOpen={false}
        isProfileOpen={isProfileOpen}
        isSignUpOpen={false}
        isCompleteDetailsOpen={false}
        onClosePopup={() => {}}
        onImageExpandChange={() => {}}
        likedProducts={{}}
        onLikeToggle={() => {}}
        cart={{}}
        onAddToCart={() => {}}
        onToggleCartPopup={() => {}}
        onClearCart={() => {}}
        onFinalizeOrder={() => {}}
        onProfileUpdate={() => {}}
        profileInfo={{ name: '', phone: '', email: '' }}
        allProducts={[]}
        onClearWishlist={() => {}}
        setIsProfileOpen={setIsProfileOpen}
        setIsSignUpOpen={() => {}}
        onLoginClick={() => {}}
        setIsCompleteDetailsOpen={() => {}}
        onConfirmOrder={() => {}}
      />
    </>
  );
}
