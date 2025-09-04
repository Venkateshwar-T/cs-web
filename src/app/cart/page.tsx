
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView, ProfileInfo } from '@/app/page';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { PopupsManager } from '@/components/popups/popups-manager';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CartPage() {
  const [activeView, setActiveView] = useState<ActiveView>('cart');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});

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
          {Object.keys(cart).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
              <ShoppingCart className="h-24 w-24 text-white/30" strokeWidth={1} />
              <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
              <p className="text-white/70 max-w-xs">
                Looks like you haven&apos;t added anything to your cart yet. Start exploring to find the perfect gift!
              </p>
              <Button asChild className="mt-4 bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90 rounded-full px-8">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart content will go here */}
            </>
          )}
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
