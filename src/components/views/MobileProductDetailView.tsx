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
      "relative bg-[#9A7DAB] rounded-t-[20px] h-full ring-4 ring-custom-purple-dark"
    )}>
      <div className="bg-white/20 h-full w-full rounded-t-[20px] relative overflow-y-auto no-scrollbar">
        <div className="sticky top-0 z-20 flex justify-end p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 text-white rounded-full hover:bg-custom-gold hover:text-custom-purple-dark"
            >
              <X className="h-6 w-6" />
            </Button>
        </div>
        <div className="-mt-12">
           <MobileImageGallery product={product} onImageExpandChange={() => {}} />
        </div>
        <div className="p-4">
          <ProductDetails product={product} isLiked={isLiked} onLikeToggle={onLikeToggle} isMobile={true} />
        </div>
        <Separator className="my-4 bg-white/30" />
        <div className="px-4 pb-4">
          <FlavoursSection onAddToCart={onFlavourAddToCart} cart={flavourCart} isMobile={true} />
        </div>
        <Separator className="my-4 bg-white/30" />
        <div className="bg-custom-purple-dark rounded-2xl p-4 mx-4 mb-4 text-white">
          <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                      <p className="text-sm line-through opacity-70">₹1000</p>
                      <p className="text-sm text-custom-gold font-semibold">25% OFF</p>
                  </div>
                  <p className="text-3xl font-bold">₹750</p>
              </div>
              <div className="w-24">
                  {productQuantity === 0 ? (
                      <Button
                          className="w-full rounded-full font-semibold text-sm border-2 border-custom-gold bg-custom-gold text-custom-purple-dark py-1.5 h-auto hover:bg-custom-gold/90"
                          onClick={handleAddToCartClick}
                      >
                          Add
                      </Button>
                  ) : (
                      <div className="flex items-center justify-center w-full rounded-full h-9 border-2 border-white overflow-hidden">
                          <Button size="icon" variant="ghost" onClick={handleDecrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                              <Minus className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 text-center bg-custom-purple-dark text-white h-full flex items-center justify-center">
                              <span className="font-bold px-1 text-sm">{productQuantity}</span>
                          </div>
                          <Button size="icon" variant="ghost" onClick={handleIncrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                              <Plus className="h-4 w-4" />
                          </Button>
                      </div>
                  )}
              </div>
          </div>
          <Button
              onClick={handleBuyNow}
              className="w-full rounded-full font-semibold text-base border border-white bg-white text-custom-purple-dark py-2.5 h-auto hover:bg-custom-purple-dark hover:text-white"
          >
              Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
