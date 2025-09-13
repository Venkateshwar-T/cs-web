// @/components/popups/popups-manager.tsx
'use client';

import { CartPopup } from '@/components/cart-popup';
import { ProfilePopup } from '@/components/profile-popup';
import type { SanityProduct } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { LoginPopup } from '../login-popup';
import { SignUpPopup } from '../signup-popup';
import { CompleteDetailsPopup } from '../complete-details-popup';
import type { OrderItem } from '@/context/app-context';


interface PopupsManagerProps {
  isCartOpen?: boolean;
  isProfileOpen: boolean;
  likedProducts?: Record<string, boolean>;
  onLikeToggle?: (productId: string) => void;
  cart?: Record<string, OrderItem>;
  onAddToCart?: (productName: string, quantity: number, flavours?: string[]) => void;
  onToggleCartPopup?: () => void;
  onClearCart?: () => void;
  allProducts?: SanityProduct[];
  onClearWishlist?: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
}

const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
  'Diwali Collection Box 2': 1199,
  'Diwali Collection Box 3': 999,
  'Diwali Collection Box 4': 899,
  'Diwali Collection Box 5': 750,
  'Diwali Collection Box 6': 1250,
  'Diwali Collection Box 7': 600,
  'Diwali Collection Box 8': 1500,
  'Diwali Collection Box 9': 850,
  'Diwali Collection Box 10': 950,
  'Diwali Collection Box 11': 1100,
  'Diwali Collection Box 12': 1300,
};

function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CS';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function PopupsManager({
  isCartOpen,
  isProfileOpen,
  likedProducts,
  onLikeToggle,
  cart,
  onAddToCart,
  onToggleCartPopup,
  onClearCart,
  allProducts,
  onClearWishlist,
  setIsProfileOpen,
}: PopupsManagerProps) {
  const router = useRouter();
  const { addOrder, clearCart: globalClearCart, authPopup, setAuthPopup, login, isAuthenticated, updateProfileInfo } = useAppContext();
  const isAnyPopupVisible = isCartOpen || isProfileOpen || !!authPopup;

  const handleFinalizeOrder = () => {
    if (!isAuthenticated) {
        if(onToggleCartPopup) onToggleCartPopup();
        setAuthPopup('login');
        return;
    }
    if (!cart) return;

    const newOrderId = generateOrderId();
    const subtotal = Object.values(cart).reduce((acc, item) => {
        const price = productPrices[item.name] || 0;
        return acc + (price * item.quantity);
    }, 0);
    
    const discount = 500.00;
    const subtotalAfterDiscount = subtotal - discount;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const total = subtotalAfterDiscount + gstAmount;

    addOrder({
        id: newOrderId,
        date: new Date().toISOString(),
        items: Object.values(cart),
        status: 'Order Requested',
        total: total > 0 ? total : 0,
    });

    if(onToggleCartPopup) onToggleCartPopup();
    
    const clearCartAction = onClearCart || globalClearCart;
    clearCartAction();
    router.push(`/order-confirmed?orderId=${newOrderId}`);
  };

  const handleLoginSuccess = () => {
      login();
      setAuthPopup(null);
  };
  
  const handleSignUpSuccess = () => {
      login();
      setAuthPopup('completeDetails');
  };

  const handleDetailsConfirm = (name: string, phone: string) => {
    updateProfileInfo({ name, phone });
    setAuthPopup(null);
  };


  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-40 bg-black/50" />}
      
      {isCartOpen && cart && onClearCart && onAddToCart && onToggleCartPopup && (
          <div 
            className={cn("fixed inset-x-0 bottom-0 z-50 h-[82vh] data-[state=closed]:animate-slide-down-out data-[state=open]:animate-slide-up-in")}
            data-state={isCartOpen ? 'open' : 'closed'}
          >
              <div className="h-full relative w-[80vw] left-1/2 -translate-x-1/2">
                  <CartPopup
                    onClose={onToggleCartPopup}
                    cart={cart}
                    onClearCart={onClearCart}
                    onFinalizeOrder={handleFinalizeOrder}
                    onQuantityChange={onAddToCart}
                  />
              </div>
          </div>
      )}

      {isProfileOpen && allProducts && likedProducts && onLikeToggle && cart && onAddToCart && onClearWishlist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <ProfilePopup 
              onClose={() => setIsProfileOpen(false)} 
              products={allProducts}
              likedProducts={likedProducts}
              onLikeToggle={onLikeToggle}
              onAddToCart={onAddToCart}
              cart={cart}
              onClearWishlist={onClearWishlist}
            />
          </div>
      )}

      <LoginPopup 
        open={authPopup === 'login'} 
        onOpenChange={(open) => !open && setAuthPopup(null)}
        onSignUpClick={() => setAuthPopup('signup')}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignUpPopup
        open={authPopup === 'signup'}
        onOpenChange={(open) => !open && setAuthPopup(null)}
        onLoginClick={() => setAuthPopup('login')}
        onSignUpSuccess={handleSignUpSuccess}
      />
      <CompleteDetailsPopup
        open={authPopup === 'completeDetails'}
        onOpenChange={(open) => !open && setAuthPopup(null)}
        onConfirm={handleDetailsConfirm}
      />
    </>
  );
}
