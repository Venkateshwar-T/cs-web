
// @/components/wishlist-view.tsx
'use client';

import type { Product } from "@/app/page";
import { WishlistItemCard } from "./wishlist-item-card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
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
}

export function WishlistView({ products, likedProducts, onLikeToggle, onAddToCart, cart, onClearWishlist }: WishlistViewProps) {
  const wishlistedProducts = products.filter(p => likedProducts[p.id]);

  return (
    <div className="p-8 text-white h-full flex flex-col relative">
      <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Wishlist</h2>
      
      {wishlistedProducts.length > 0 ? (
        <>
          <div className="flex-grow overflow-y-auto pr-4 space-y-4 custom-scrollbar">
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
          <div className="absolute bottom-8 right-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  size="icon"
                  className="bg-red-600 hover:bg-red-700 h-14 w-14 rounded-full shadow-lg"
                  disabled={wishlistedProducts.length === 0}
                >
                  <Trash2 className="h-7 w-7" />
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
            <p className="text-white/70 text-lg">Your wishlist is empty. Start adding some products you love!</p>
        </div>
      )}
    </div>
  );
}
