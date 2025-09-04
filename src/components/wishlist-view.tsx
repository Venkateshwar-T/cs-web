// @/components/wishlist-view.tsx
'use client';

import { useState } from 'react';
import type { Product } from "@/app/page";
import { WishlistItemCard } from "./wishlist-item-card";
import { Button } from "./ui/button";
import { FaTrash } from "react-icons/fa";
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface WishlistViewProps {
  products: Product[];
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  onClearWishlist: () => void;
  isMobile?: boolean;
}

export function WishlistView({ 
  products, 
  likedProducts, 
  onLikeToggle, 
  onAddToCart, 
  cart, 
  onClearWishlist, 
  isMobile = false 
}: WishlistViewProps) {
  const wishlistedProducts = products.filter(p => likedProducts[p.id]);
  const [unlikingItems, setUnlikingItems] = useState<number[]>([]);

  const handleUnlike = (productId: number) => {
    setUnlikingItems(prev => [...prev, productId]);
  };

  const handleAnimationEnd = (productId: number) => {
    onLikeToggle(productId);
    setUnlikingItems(prev => prev.filter(id => id !== productId));
  };

  const containerClasses = isMobile 
    ? "bg-white/80 rounded-2xl flex flex-col p-4" 
    : "p-8 text-white h-full flex flex-col relative";

  return (
    <div className={containerClasses}>
      {!isMobile && <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Wishlist</h2>}
      
      {wishlistedProducts.length > 0 ? (
        <>
          <div className="flex-grow overflow-y-auto pr-0 md:pr-4 space-y-4 custom-scrollbar">
            {wishlistedProducts.map(product => (
              <WishlistItemCard 
                key={product.id}
                product={product}
                onUnlike={() => handleUnlike(product.id)}
                onAddToCart={onAddToCart}
                isInCart={!!cart[product.name]}
                isUnliking={unlikingItems.includes(product.id)}
                onAnimationEnd={() => handleAnimationEnd(product.id)}
              />
            ))}
          </div>
          <div className={cn(isMobile ? "flex justify-end mt-4" : "absolute bottom-8 right-8")}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  size={isMobile ? "sm" : "icon"}
                  className={cn(
                    "bg-red-600 hover:bg-red-700 shadow-lg",
                    isMobile ? "rounded-full h-8 px-3 text-xs" : "h-14 w-14 rounded-full"
                  )}
                  disabled={wishlistedProducts.length === 0}
                >
                  <FaTrash className={cn(isMobile ? "h-3 w-3 mr-1" : "h-6 w-6")} />
                  {isMobile && 'Clear All'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently remove all items from your wishlist.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearWishlist}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-center text-lg text-white/70">
                Your wishlist is empty. Start adding some products you love!
            </p>
        </div>
      )}
    </div>
  );
}
