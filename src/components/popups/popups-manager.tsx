
'use client';

import { CartPopup } from '@/components/cart-popup';
import { ProfilePopup } from '@/components/profile-popup';
import { SignUpPopup } from '@/components/signup-popup';
import { CompleteDetailsPopup } from '@/components/complete-details-popup';
import type { Product, ProfileInfo } from '@/app/page';
import { cn } from '@/lib/utils';
import { LoginPopup } from '../login-popup';
import { useState } from 'react';

interface PopupsManagerProps {
  isCartVisible?: boolean;
  isCartOpen?: boolean;
  isProfileOpen: boolean;
  isSignUpOpen?: boolean;
  isCompleteDetailsOpen?: boolean;
  onImageExpandChange?: (isExpanded: boolean) => void;
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
  setIsSignUpOpen?: (isOpen: boolean) => void;
  onLoginClick?: () => void;
  setIsCompleteDetailsOpen?: (isOpen: boolean) => void;
  onConfirmOrder?: (name: string, phone: string) => void;
}

export function PopupsManager({
  isCartVisible,
  isCartOpen,
  isProfileOpen,
  isSignUpOpen = false,
  isCompleteDetailsOpen = false,
  onImageExpandChange,
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
  setIsSignUpOpen,
  setIsCompleteDetailsOpen,
  onConfirmOrder,
}: PopupsManagerProps) {
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const isAnyPopupVisible = isCartVisible || isProfileOpen || isSignUpOpen || isCompleteDetailsOpen || isLoginOpen;

  const handleOpenLogin = () => {
    if (setIsSignUpOpen) setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenSignUp = () => {
    setIsLoginOpen(false);
    if (setIsSignUpOpen) setIsSignUpOpen(true);
  };


  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-40 bg-black/50" />}
      
      {isCartVisible && isCartOpen && cart && onClearCart && onFinalizeOrder && onAddToCart && onToggleCartPopup && (
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

      {setIsSignUpOpen && (
        <SignUpPopup 
          open={isSignUpOpen}
          onOpenChange={setIsSignUpOpen}
          onLoginClick={handleOpenLogin}
        />
      )}
      
      <LoginPopup
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSignUpClick={handleOpenSignUp}
      />

      {setIsCompleteDetailsOpen && onConfirmOrder && (
        <CompleteDetailsPopup
          open={isCompleteDetailsOpen}
          onOpenChange={setIsCompleteDetailsOpen}
          onConfirm={onConfirmOrder}
        />
      )}
    </>
  );
}
