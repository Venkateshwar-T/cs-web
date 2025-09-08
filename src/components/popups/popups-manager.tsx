
'use client';

import { CartPopup } from '@/components/cart-popup';
import { ProfilePopup } from '@/components/profile-popup';
import type { Product, ProfileInfo } from '@/app/page';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface PopupsManagerProps {
  isCartOpen?: boolean;
  isProfileOpen: boolean;
  likedProducts?: Record<number, boolean>;
  onLikeToggle?: (productId: number) => void;
  cart?: Record<string, number>;
  onAddToCart?: (productName: string, quantity: number) => void;
  onToggleCartPopup?: () => void;
  onClearCart?: () => void;
  onFinalizeOrder?: () => void;
  onProfileUpdate?: (updatedProfile: Partial<ProfileInfo>) => void;
  profileInfo?: ProfileInfo;
  allProducts?: Product[];
  onClearWishlist?: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
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
  onFinalizeOrder,
  onProfileUpdate,
  profileInfo,
  allProducts,
  onClearWishlist,
  setIsProfileOpen,
}: PopupsManagerProps) {
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setIsCartVisible(true);
    } else {
      const timer = setTimeout(() => setIsCartVisible(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const isAnyPopupVisible = isCartVisible || isProfileOpen;

  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-40 bg-black/50" />}
      
      {isCartVisible && cart && onClearCart && onFinalizeOrder && onAddToCart && onToggleCartPopup && (
          <div className={cn("fixed inset-x-0 bottom-0 z-50 h-[82vh]", isCartOpen ? 'animate-slide-up-in' : 'animate-slide-down-out' )}>
              <div className="h-full relative w-[80vw] left-1/2 -translate-x-1/2">
                  <CartPopup
                    onClose={onToggleCartPopup}
                    cart={cart}
                    onClearCart={onClearCart}
                    onFinalizeOrder={onFinalizeOrder}
                    onQuantityChange={onAddToCart}
                  />
              </div>
          </div>
      )}

      {isProfileOpen && profileInfo && onProfileUpdate && allProducts && likedProducts && onLikeToggle && cart && onAddToCart && onClearWishlist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <ProfilePopup 
              onClose={() => setIsProfileOpen(false)} 
              profile={profileInfo} 
              onProfileUpdate={onProfileUpdate}
              products={allProducts}
              likedProducts={likedProducts}
              onLikeToggle={onLikeToggle}
              onAddToCart={onAddToCart}
              cart={cart}
              onClearWishlist={onClearWishlist}
            />
          </div>
      )}
    </>
  );
}
