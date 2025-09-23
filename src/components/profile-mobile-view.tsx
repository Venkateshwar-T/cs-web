
// @/components/profile-mobile-view.tsx
'use client';

import { useState } from 'react';
import type { ProfileInfo } from '@/context/app-context';
import type { SanityProduct } from '@/types';
import { cn } from '@/lib/utils';
import { MyProfileTab } from './my-profile-tab';
import { WishlistView } from './wishlist-view';
import { MyOrdersTab } from './my-orders-tab';
import type { OrderItem } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { EmptyState } from './empty-state';
import { ProductOrderDetailsPopup } from './product-order-details-popup';
import { useAppContext } from '@/context/app-context';

interface ProfileMobileViewProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
  products: SanityProduct[];
  likedProducts: Record<string, boolean>;
  onLikeToggle: (productId: string) => void;
  onAddToCart: (productName: string, quantity: number, flavours?: string[]) => void;
  cart: Record<string, { name: string; quantity: number; flavours?: string[] }>;
  onClearWishlist: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const tabs = ['My Profile', 'My Wishlist', 'My Orders'];

export function ProfileMobileView({ 
  profile, 
  onProfileUpdate, 
  products, 
  likedProducts, 
  onLikeToggle, 
  onAddToCart, 
  cart, 
  onClearWishlist,
  isAuthenticated,
  onLoginClick,
}: ProfileMobileViewProps) {
  const [activeTab, setActiveTab] = useState('My Profile');
  const router = useRouter();
  const { reorderItem } = useAppContext();

  const [selectedProductDetails, setSelectedProductDetails] = useState<{orderItem: OrderItem } | null>(null);

  const productsByName = products.reduce((acc, p) => {
    if (p) acc[p.name] = p;
    return acc;
  }, {} as Record<string, SanityProduct>);
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const handleViewProductFromOrder = (productName: string) => {
    const product = productsByName[productName];
    if (product) {
      router.push(`/product/${product.slug.current}`);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full px-4 text-white">
        <div className="flex-shrink-0 border-b border-white/20">
          <div className="flex justify-around">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 px-2 text-sm font-medium transition-colors w-full",
                  activeTab === tab
                    ? 'text-custom-gold border-b-2 border-custom-gold'
                    : 'text-white/70 hover:text-white'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className={cn("flex-grow overflow-y-auto no-scrollbar", activeTab==='My Profile' && 'pt-6', activeTab==='My Wishlist' && 'pt-6')}>
          {activeTab === 'My Profile' && (
            isAuthenticated ? (
              <MyProfileTab profile={profile} onProfileUpdate={onProfileUpdate} />
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center h-full px-4 pb-24">
                <EmptyState 
                  imageUrl='/icons/profile_drpdwn_btn.png'
                  title="You're Not Logged In"
                  description="Log in or create an account to view your profile, orders, and wishlist."
                  buttonText="Log In / Sign Up"
                  onButtonClick={onLoginClick}
                  imageClassName='w-24 h-24'
                />
              </div>
            )
          )}
          {activeTab === 'My Wishlist' && (
            <WishlistView
              products={products}
              likedProducts={likedProducts}
              onLikeToggle={onLikeToggle}
              onAddToCart={onAddToCart}
              cart={cart}
              onClearWishlist={onClearWishlist}
              isMobile={true}
              onProductClick={handleProductClick}
            />
          )}
          {activeTab === 'My Orders' && (
            <MyOrdersTab 
              isMobile={true} 
              products={products} 
              onProductClick={(orderItem) => setSelectedProductDetails({ orderItem })}
            />
          )}
        </div>
      </div>
       <ProductOrderDetailsPopup
        details={selectedProductDetails}
        open={!!selectedProductDetails}
        onOpenChange={(isOpen) => !isOpen && setSelectedProductDetails(null)}
        onViewProduct={handleViewProductFromOrder}
      />
    </>
  );
}
