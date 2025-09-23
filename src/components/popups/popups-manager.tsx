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
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';


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
  onLogout?: () => void;
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
  onLogout,
}: PopupsManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addOrder, clearCart: globalClearCart, authPopup, setAuthPopup, isAuthenticated, updateProfileInfo } = useAppContext();
  const isAnyPopupVisible = isCartOpen || isProfileOpen || !!authPopup;

  const handleFinalizeOrder = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to finalize your order.",
        action: <ToastAction altText="Login" onClick={() => setAuthPopup('login')}>Login</ToastAction>,
      });
      return;
    }
    if (!cart) return;

    const productsByName = allProducts.reduce((acc, product) => {
      acc[product.name] = product;
      return acc;
    }, {} as Record<string, SanityProduct>);
    
    const orderItems: OrderItem[] = Object.values(cart).map(cartItem => {
      const product = productsByName[cartItem.name];
      if (!product) return null;

      const flavourTotal = (cartItem.flavours && product.availableFlavours)
        ? cartItem.flavours.reduce((acc, flavourName) => {
            const flavour = product.availableFlavours.find(f => f.name === flavourName);
            return acc + (flavour?.price || 0);
          }, 0)
        : 0;

      const finalProductPrice = (product.discountedPrice || 0) + flavourTotal;
      const finalSubtotal = finalProductPrice * cartItem.quantity;

      return {
        name: product.name,
        quantity: cartItem.quantity,
        flavours: cartItem.flavours || [],
        mrp: product.mrp,
        finalProductPrice: finalProductPrice,
        finalSubtotal: finalSubtotal,
        coverImage: product.images?.[0] || '/placeholder.png'
      };
    }).filter((item): item is OrderItem => item !== null);

    const subtotal = orderItems.reduce((acc, item) => acc + (item.finalSubtotal || 0), 0);
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;

    const newOrderId = await addOrder({
        date: new Date().toISOString(),
        items: orderItems,
        status: 'Order Requested',
        total: total > 0 ? total : 0,
    });

    if (newOrderId) {
      if(onToggleCartPopup) onToggleCartPopup();
      
      const clearCartAction = onClearCart || globalClearCart;
      clearCartAction();
      router.push(`/order-confirmed?orderId=${newOrderId}`);
    }
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

      {isProfileOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <ProfilePopup 
              onClose={() => setIsProfileOpen(false)} 
              products={allProducts}
              likedProducts={likedProducts || {}}
              onLikeToggle={onLikeToggle || (() => {})}
              onAddToCart={onAddToCart || (() => {})}
              cart={cart || {}}
              onClearWishlist={onClearWishlist || (() => {})}
              onProductClick={onProductClick || (() => {})}
              onLogout={onLogout || (() => {})}
            />
          </div>
      )}

      <LoginPopup 
        open={authPopup === 'login'} 
        onOpenChange={(open) => {
            if (!open) {
                setAuthPopup(null);
            }
        }}
        onSignUpClick={() => setAuthPopup('signup')}
      />
      <SignUpPopup
        open={authPopup === 'signup'}
        onOpenChange={(open) => {
            if (!open) {
                setAuthPopup(null);
            }
        }}
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
