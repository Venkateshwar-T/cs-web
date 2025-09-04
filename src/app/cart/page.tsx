
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView } from '@/app/page';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { PopupsManager } from '@/components/popups/popups-manager';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileCartItemCard } from '@/components/mobile-cart-item-card';
import { MobileCartSummary } from '@/components/mobile-cart-summary';

// Mock data for products
const mockProducts = [
  { id: 1, name: 'Diwali Collection Box 1' },
  { id: 2, name: 'Anniversary Special Box' },
];

export default function CartPage() {
  const [activeView, setActiveView] = useState<ActiveView>('cart');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({
    'Diwali Collection Box 1': 1,
    'Anniversary Special Box': 2,
  });
  const isMobile = useIsMobile();

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

  const handleQuantityChange = (productName: string, newQuantity: number) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newQuantity <= 0) {
        delete newCart[productName];
      } else {
        newCart[productName] = newQuantity;
      }
      return newCart;
    });
  };

  const handleRemove = (productName: string) => {
    handleQuantityChange(productName, 0);
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log('Proceeding to checkout');
  };

  const cartItems = Object.entries(cart);

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
          {cartItems.length === 0 ? (
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
              {isMobile ? (
                <div className="p-4">
                  <div className="space-y-4">
                    {cartItems.map(([productName, quantity]) => (
                       <MobileCartItemCard
                          key={productName}
                          productName={productName}
                          quantity={quantity}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemove}
                        />
                    ))}
                  </div>
                  {cartItems.length > 0 && <MobileCartSummary cart={cart} onCheckout={handleCheckout} />}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                  <h2 className="text-2xl font-bold text-white">Desktop Cart View</h2>
                  <p className="text-white/70 max-w-xs">
                    This is a placeholder for the desktop cart view.
                  </p>
                </div>
              )}
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
