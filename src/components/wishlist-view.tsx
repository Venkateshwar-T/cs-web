// @/components/wishlist-view.tsx
'use client';

import { useState } from 'react';
import type { SanityProduct } from "@/types";
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
import { EmptyState } from './empty-state';
import { useRouter } from 'next/navigation';
import type { OrderItem } from '@/context/app-context';
import { useAppContext } from '@/context/app-context';

interface WishlistViewProps {
  products: SanityProduct[];
  likedProducts: Record<string, boolean>;
  onLikeToggle: (productId: string) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, OrderItem>;
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
  const { setFlavourSelection } = useAppContext();
  const wishlistedProducts = products.filter(p => likedProducts[p._id]);
  const [unlikingItems, setUnlikingItems] = useState<string[]>([]);
  const router = useRouter();

  const handleUnlike = (productId: string) => {
    setUnlikingItems(prev => [...prev, productId]);
  };
  
  const handleAddToCartFromWishlist = (product: SanityProduct) => {
    const isInCart = !!cart[product.name];
    if (isInCart) {
      onAddToCart(product.name, 0); // Remove from cart
    } else {
      setFlavourSelection({ product, isOpen: true }); // Open flavour popup
    }
  };

  const handleAnimationEnd = (productId: string) => {
    onLikeToggle(productId);
    setUnlikingItems(prev => prev.filter(id => id !== productId));
  };
  
  const handleExplore = () => {
    router.push('/');
  }

  if (isMobile) {
    return (
       <div className="flex flex-col h-full">
        {wishlistedProducts.length > 0 ? (
          <div className="bg-white/80 rounded-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-black/10 flex-shrink-0">
              <p className="text-base font-bold text-black">Total Products: {wishlistedProducts.length}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 text-white rounded-full hover:bg-red-600/90 text-xs h-8 px-3 disabled:opacity-50"
                    disabled={wishlistedProducts.length === 0}
                  >
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
            <div className="overflow-y-auto no-scrollbar">
              {wishlistedProducts.map((product, index) => (
                <WishlistItemCard 
                  key={product._id}
                  product={product}
                  onUnlike={() => handleUnlike(product._id)}
                  onAddToCart={() => handleAddToCartFromWishlist(product)}
                  isInCart={!!cart[product.name]}
                  isUnliking={unlikingItems.includes(product._id)}
                  onAnimationEnd={() => handleAnimationEnd(product._id)}
                  isLastItem={index === wishlistedProducts.length - 1}
                  isMobile={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center h-full">
            <EmptyState
              imageUrl="/icons/empty.png"
              title="Find a Sweet Treat to Save!"
              description="Your wishlist is where you can store all your favorite chocolates and come back to them later."
              buttonText="Explore Now"
              onButtonClick={handleExplore}
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="p-8 text-white h-full flex flex-col relative">
      <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Wishlist</h2>
      
      {wishlistedProducts.length > 0 ? (
        <>
          <div className="flex-grow overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {wishlistedProducts.map(product => (
              <WishlistItemCard 
                key={product._id}
                product={product}
                onUnlike={() => handleUnlike(product._id)}
                onAddToCart={() => handleAddToCartFromWishlist(product)}
                isInCart={!!cart[product.name]}
                isUnliking={unlikingItems.includes(product._id)}
                onAnimationEnd={() => handleAnimationEnd(product._id)}
                isLastItem={false}
              />
            ))}
          </div>
          <div className="absolute bottom-8 right-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  size="icon"
                  className="bg-red-600 hover:bg-red-700 shadow-lg h-14 w-14 rounded-full"
                  disabled={wishlistedProducts.length === 0}
                >
                  <FaTrash className="h-6 w-6" />
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
        <div className="flex-grow flex flex-col items-center justify-center">
            <EmptyState
              imageUrl="/icons/empty.png"
              title="Find a Sweet Treat to Save!"
              description="Your wishlist is where you can store all your favorite chocolates and come back to them later."
              buttonText="Explore Now"
              onButtonClick={handleExplore}
            />
        </div>
      )}
    </div>
  );
}
