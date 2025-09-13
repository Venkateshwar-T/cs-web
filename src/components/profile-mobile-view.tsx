// @/components/profile-mobile-view.tsx
'use client';

import { useState } from 'react';
import type { ProfileInfo } from '@/app/page';
import type { SanityProduct } from '@/types';
import { cn } from '@/lib/utils';
import { MyProfileTab } from './my-profile-tab';
import { WishlistView } from './wishlist-view';
import { MyOrdersTab } from './my-orders-tab';
import type { OrderItem } from '@/context/app-context';
import { useRouter } from 'next/navigation';

interface ProfileMobileViewProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
  products: SanityProduct[];
  likedProducts: Record<string, boolean>;
  onLikeToggle: (productId: string) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, OrderItem>;
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
  const router = useRouter();
  
  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

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
      <div className={cn("flex-grow overflow-y-auto no-scrollbar", activeTab==='My Profile' && 'pt-6', activeTab==='My Wishlist' && 'pt-6')}>
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
            onProductClick={handleProductClick}
          />
        )}
        {activeTab === 'My Orders' && (
          <MyOrdersTab isMobile={true} products={products} onProductClick={handleProductClick} />
        )}
      </div>
    </div>
  );
}
