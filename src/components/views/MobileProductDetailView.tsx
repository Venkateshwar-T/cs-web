
// @/components/views/MobileProductDetailView.tsx
'use client';

import type { Product } from '@/app/page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Plus, Minus } from 'lucide-react';
import { MobileImageGallery } from '../mobile-image-gallery';
import { ProductDetails } from '../product-details';
import { FlavoursSection } from '../flavours-section';
import { Separator } from '../ui/separator';

interface MobileProductDetailViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productName: string, quantity: number, animate?: boolean) => void;
  cart: Record<string, number>;
  onToggleCartPopup: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
  flavourCart: Record<string, number>;
  onFlavourAddToCart: (flavourId: number, quantity: number) => void;
}

export function MobileProductDetailView({ 
  product, 
  onClose, 
  onAddToCart, 
  cart, 
  onToggleCartPopup, 
  isLiked,
  onLikeToggle,
  flavourCart,
  onFlavourAddToCart,
}: MobileProductDetailViewProps) {
  const productQuantity = cart[product.name] || 0;

  const handleAddToCartClick = () => {
      onAddToCart(product.name, 1, false);
  };

  const handleIncrement = () => {
      onAddToCart(product.name, productQuantity + 1, false);
  };

  const handleDecrement = () => {
      onAddToCart(product.name, productQuantity - 1, false);
  };

  const handleBuyNow = () => {
      if (productQuantity === 0) {
          onAddToCart(product.name, 1, false);
      }
      onToggleCartPopup();
  };

  return (
    <div className={cn(
      "bg-white/20 h-full w-full rounded-t-[20px] relative flex flex-col overflow-hidden"
    )}>
      <div className="absolute top-0 right-0 z-20 p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 text-white rounded-full hover:bg-custom-gold hover:text-custom-purple-dark"
          >
            <X className="h-6 w-6" />
          </Button>
      </div>
      <div className="flex-grow overflow-y-auto no-scrollbar pb-32">
        <div className="-mt-2">
          <MobileImageGallery product={product} onImageExpandChange={() => {}} />
        </div>
        <div className="p-4">
          <ProductDetails product={product} isLiked={isLiked} onLikeToggle={onLikeToggle} isMobile={true} />
        </div>
        <Separator className="my-4 bg-white/30" />
        <div className="px-4">
          <FlavoursSection onAddToCart={onFlavourAddToCart} cart={flavourCart} isMobile={true} />
        </div>
        <Separator className="my-4 bg-white/30" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-custom-purple-dark pt-4 rounded-t-2xl">
          <div className="flex justify-between items-center mb-4 px-4">
              <div className="flex flex-col items-start">
                  <p className="text-sm line-through opacity-70">₹1000</p>
                  <p className="text-sm text-custom-gold font-semibold">25% OFF</p>
              </div>
              <p className="text-3xl font-bold">₹750</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 px-4 pb-4">
            {productQuantity === 0 ? (
                <Button
                    className="w-1/2 rounded-full font-semibold text-sm border-2 border-custom-gold bg-custom-gold text-custom-purple-dark py-2 h-auto hover:bg-custom-gold/90"
                    onClick={handleAddToCartClick}
                >
                    Add to Cart
                </Button>
            ) : (
                <div className="flex items-center justify-center w-1/2 rounded-full h-10 border-2 border-white overflow-hidden">
                    <Button size="icon" variant="ghost" onClick={handleDecrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                        <Minus className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 text-center bg-custom-purple-dark text-white h-full flex items-center justify-center">
                        <span className="font-bold px-2 text-lg">{productQuantity}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={handleIncrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            )}
             <Button
                onClick={handleBuyNow}
                className="w-1/2 rounded-full font-semibold text-sm border border-white bg-white text-custom-purple-dark py-2 h-auto hover:bg-custom-purple-dark hover:text-white"
            >
                Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

    