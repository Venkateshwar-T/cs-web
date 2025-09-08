
// @/components/profile-mobile-view.tsx
'use client';

import { useState } from 'react';
import type { Product, ProfileInfo } from '@/app/page';
import { cn } from '@/lib/utils';
import { MyProfileTab } from './my-profile-tab';
import { WishlistView } from './wishlist-view';
import { MyOrdersTab } from './my-orders-tab';

interface ProfileMobileViewProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
  products: Product[];
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  onClearWishlist: () => void;
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
  onClearWishlist 
}: ProfileMobileViewProps) {
  const [activeTab, setActiveTab] = useState('My Profile');

  return (
    <div className="flex flex-col h-full px-4 text-white">
      <div className="flex-shrink-0 border-b border-white/20">
        <div className="flex justify-around">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3 px-2 text-sm font-medium transition-colors w-full",
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
      <div className={cn("flex-grow overflow-y-auto no-scrollbar pt-2 pb-20", activeTab==='My Profile' && 'pt-6', activeTab==='My Wishlist' && 'pt-6')}>
        {activeTab === 'My Profile' && (
          <MyProfileTab profile={profile} onProfileUpdate={onProfileUpdate} />
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
          />
        )}
        {activeTab === 'My Orders' && (
          <MyOrdersTab isMobile={true} />
        )}
      </div>
    </div>
  );
}
