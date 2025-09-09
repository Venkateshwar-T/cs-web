
'use client';

import { CartPopup } from '@/components/cart-popup';
import { ProfilePopup } from '@/components/profile-popup';
import type { Product } from '@/app/page';
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
  allProducts,
  onClearWishlist,
  setIsProfileOpen,
}: PopupsManagerProps) {
  const isAnyPopupVisible = isCartOpen || isProfileOpen;

  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-40 bg-black/50" />}
      
      {isCartOpen && cart && onClearCart && onFinalizeOrder && onAddToCart && onToggleCartPopup && (
          <div 
            className={cn("fixed inset-x-0 bottom-0 z-50 h-[82vh] data-[state=closed]:animate-slide-down-out data-[state=open]:animate-slide-up-in")}
            data-state={isCartOpen ? 'open' : 'closed'}
          >
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
    </>
  );
}
