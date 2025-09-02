
'use client';

import { ProductPopup } from '@/components/product-popup';
import { CartPopup } from '@/components/cart-popup';
import { ProfilePopup } from '@/components/profile-popup';
import { SignUpPopup } from '@/components/signup-popup';
import { CompleteDetailsPopup } from '@/components/complete-details-popup';
import type { Product, ProfileInfo } from '@/app/page';
import { cn } from '@/lib/utils';

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
  onLoginClick,
  setIsCompleteDetailsOpen,
  onConfirmOrder,
}: PopupsManagerProps) {
  
  const isAnyPopupVisible = selectedProduct || isCartVisible || isProfileOpen || isSignUpOpen || isCompleteDetailsOpen;

  return (
    <>
      {isAnyPopupVisible && <div className="fixed inset-0 z-10 bg-black/50" />}
      
      {selectedProduct && (
          <div className={cn("fixed inset-0 z-20 flex items-start justify-center pt-36 transition-opacity duration-300", isCartVisible && "pointer-events-none opacity-65")}>
              <div className="h-full flex-grow ml-[calc(17%+2rem)] mr-8 relative w-[calc(83%-4rem)]">
                  <ProductPopup 
                    product={selectedProduct} 
                    onClose={onClosePopup}
                    onImageExpandChange={onImageExpandChange}
                    isLiked={!!likedProducts[selectedProduct.id]}
                    onLikeToggle={() => onLikeToggle(selectedProduct.id)}
                    cart={cart}
                    onAddToCart={onAddToCart}
                  />
              </div>
          </div>
      )}

      {isCartVisible && (
          <div className={cn("fixed inset-0 z-[30] flex items-start justify-center pt-36", isCartOpen ? 'animate-slide-up-in' : 'animate-slide-down-out' )}>
              <div className="h-full flex-grow ml-[calc(17%+2rem)] mr-8 relative w-[calc(83%-4rem)]">
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
        onLoginClick={onLoginClick}
      />
      
      <CompleteDetailsPopup
        open={isCompleteDetailsOpen}
        onOpenChange={setIsCompleteDetailsOpen}
        onConfirm={onConfirmOrder}
      />
    </>
  );
}
