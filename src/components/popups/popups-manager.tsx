
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
  allProducts: SanityProduct[];
  onClearWishlist?: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
  onProductClick?: (product: SanityProduct) => void;
}

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
  onProductClick,
}: PopupsManagerProps) {
  const router = useRouter();
  const { addOrder, clearCart: globalClearCart, authPopup, setAuthPopup, isAuthenticated, updateProfileInfo } = useAppContext();
  const isAnyPopupVisible = isCartOpen || isProfileOpen || !!authPopup;

  const handleFinalizeOrder = () => {
    if (!isAuthenticated) {
      setAuthPopup('login');
      return;
    }
    if (!cart) return;

    const productsByName = allProducts.reduce((acc, product) => {
      acc[product.name] = product;
      return acc;
    }, {} as Record<string, SanityProduct>);

    const newOrderId = generateOrderId();
    const { subtotal } = Object.entries(cart).reduce((acc, [productName, cartItem]) => {
        const product = productsByName[productName];
        if (product) {
            const price = product.discountedPrice || 0;
            let itemTotal = price * cartItem.quantity;

            if (cartItem.flavours && product.availableFlavours) {
                const flavourPrices = cartItem.flavours.reduce((flavourAcc, flavourName) => {
                    const flavour = product.availableFlavours.find(f => f.name === flavourName);
                    return flavourAcc + (flavour?.price || 0);
                }, 0);
                itemTotal += flavourPrices * cartItem.quantity;
            }
            acc.subtotal += itemTotal;
        }
        return acc;
    }, { subtotal: 0 });
    
    const subtotalAfterDiscount = subtotal;
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

  const handleDetailsConfirm = (name: string, phone: string) => {
    updateProfileInfo({ name, phone });
    setAuthPopup(null);
  };


  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-50 bg-black/50" />}
      
      {isCartOpen && cart && onClearCart && onAddToCart && onToggleCartPopup && onProductClick && (
          <div 
            className={cn("fixed inset-x-0 bottom-0 z-[60] h-[82vh] data-[state=closed]:animate-slide-down-out data-[state=open]:animate-slide-up-in")}
            data-state={isCartOpen ? 'open' : 'closed'}
          >
              <div className="h-full relative w-[80vw] left-1/2 -translate-x-1/2">
                  <CartPopup
                    onClose={onToggleCartPopup}
                    cart={cart}
                    allProducts={allProducts}
                    onClearCart={onClearCart}
                    onFinalizeOrder={handleFinalizeOrder}
                    onQuantityChange={onAddToCart}
                    onProductClick={onProductClick}
                  />
              </div>
          </div>
      )}

      {isProfileOpen && likedProducts && onLikeToggle && cart && onAddToCart && onClearWishlist && onProductClick && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <ProfilePopup 
              onClose={() => setIsProfileOpen(false)} 
              products={allProducts}
              likedProducts={likedProducts}
              onLikeToggle={onLikeToggle}
              onAddToCart={onAddToCart}
              cart={cart}
              onClearWishlist={onClearWishlist}
              onProductClick={onProductClick}
            />
          </div>
      )}

      <LoginPopup 
        open={authPopup === 'login'} 
        onOpenChange={(open) => !open && setAuthPopup(null)}
        onSignUpClick={() => setAuthPopup('signup')}
      />
      <SignUpPopup
        open={authPopup === 'signup'}
        onOpenChange={(open) => !open && setAuthPopup(null)}
        onLoginClick={() => setAuthPopup('login')}
      />
      <CompleteDetailsPopup
        open={authPopup === 'completeDetails'}
        onOpenChange={(open) => !open && setAuthPopup(null)}
        onConfirm={handleDetailsConfirm}
      />
    </>
  );
}
