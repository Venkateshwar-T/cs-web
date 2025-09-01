// @/components/wishlist-view.tsx
'use client';

import type { Product } from "@/app/page";
import { WishlistItemCard } from "./wishlist-item-card";

interface WishlistViewProps {
  products: Product[];
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
}

export function WishlistView({ products, likedProducts, onLikeToggle, onAddToCart, cart }: WishlistViewProps) {
  const wishlistedProducts = products.filter(p => likedProducts[p.id]);

  return (
    <div className="p-8 text-white h-full flex flex-col">
      <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Wishlist</h2>
      
      {wishlistedProducts.length > 0 ? (
        <div className="flex-grow overflow-y-auto pr-4 space-y-4">
          {wishlistedProducts.map(product => (
            <WishlistItemCard 
              key={product.id}
              product={product}
              onUnlike={() => onLikeToggle(product.id)}
              onAddToCart={onAddToCart}
              isInCart={!!cart[product.name]}
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-white/70 text-lg">Your wishlist is empty. Start adding some products you love!</p>
        </div>
      )}
    </div>
  );
}
