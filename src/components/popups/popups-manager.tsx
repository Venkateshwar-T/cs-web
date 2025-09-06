
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
  selectedProduct: Product | null;
  isCartVisible: boolean;
  isCartOpen: boolean;
  isProfileOpen: boolean;
  isSignUpOpen: boolean;
  isCompleteDetailsOpen: boolean;

  onClosePopup: () => void;
  onImageExpandChange: (isExpanded: boolean) => void;
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  cart: Record<string, number>;
  onAddToCart: (productName: string, quantity: number, animate?: boolean) => void;

  onToggleCartPopup: () => void;
  onClearCart: () => void;
  onFinalizeOrder: () => void;
  
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
  profileInfo: ProfileInfo;
  allProducts: Product[];
  onClearWishlist: () => void;
  setIsProfileOpen: (isOpen: boolean) => void;
  
  setIsSignUpOpen: (isOpen: boolean) => void;
  onLoginClick: () => void;

  setIsCompleteDetailsOpen: (isOpen: boolean) => void;
  onConfirmOrder: (name: string, phone: string) => void;
}

export function PopupsManager({
  selectedProduct,
  isCartVisible,
  isCartOpen,
  isProfileOpen,
  isSignUpOpen,
  isCompleteDetailsOpen,
  onClosePopup,
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
  const isAnyPopupVisible = selectedProduct || isCartVisible || isProfileOpen || isSignUpOpen || isCompleteDetailsOpen || isLoginOpen;

  const handleOpenLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };


  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-10 bg-black/50" />}
      
      {isCartVisible && (
          <div className={cn("fixed inset-x-0 bottom-0 z-30 h-[85vh]", isCartOpen ? 'animate-slide-up-in' : 'animate-slide-down-out' )}>
              <div className="h-full relative w-[70vw] left-1/2 -translate-x-1/2">
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

      {isProfileOpen && (
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

      <SignUpPopup 
        open={isSignUpOpen}
        onOpenChange={setIsSignUpOpen}
        onLoginClick={handleOpenLogin}
      />
      
      <LoginPopup
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSignUpClick={handleOpenSignUp}
      />

      <CompleteDetailsPopup
        open={isCompleteDetailsOpen}
        onOpenChange={setIsCompleteDetailsOpen}
        onConfirm={onConfirmOrder}
      />
    </>
  );
}
