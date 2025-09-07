// @/components/views/MobileProductDetailView.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Product } from '@/app/page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Plus, Minus } from 'lucide-react';
import { MobileImageGallery } from '../mobile-image-gallery';
import { ProductDetails } from '../product-details';
import { FlavoursSection } from '../flavours-section';
import { Separator } from '../ui/separator';

const PriceBox = ({ product, productQuantity, onAddToCart, onToggleCartPopup, className }: { product: Product, productQuantity: number, onAddToCart: any, onToggleCartPopup: any, className?: string }) => {
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
        <div className={cn("bg-black/20 p-2 backdrop-blur-sm", className)}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="text-white">
                        <p className="text-xs line-through opacity-70">₹1000</p>
                        <p className="text-xl font-bold">₹750</p>
                    </div>
                     <div className="bg-custom-gold text-custom-purple-dark px-1.5 py-0.5 rounded-md">
                        <span className="text-xs font-bold">25% OFF</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     {productQuantity === 0 ? (
                        <Button
                            className="rounded-full font-semibold text-xs border border-white bg-white text-custom-purple-dark py-1 h-9 px-4 hover:bg-gray-200"
                            onClick={handleAddToCartClick}
                        >
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center w-24 rounded-full h-9 border border-white overflow-hidden">
                            <Button size="icon" variant="ghost" onClick={handleDecrement} className="h-full rounded-none bg-transparent hover:bg-white/20 text-white hover:text-white flex-1">
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 text-center bg-transparent text-white h-full flex items-center justify-center">
                                <span className="font-bold px-1 text-base">{productQuantity}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={handleIncrement} className="h-full rounded-none bg-transparent hover:bg-white/20 text-white hover:text-white flex-1">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <Button
                        onClick={handleBuyNow}
                        className="rounded-full font-semibold text-xs border-2 border-custom-gold bg-custom-gold text-custom-purple-dark py-1 h-9 px-5 hover:bg-custom-gold/90"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

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
  const [isInlinePriceBoxVisible, setIsInlinePriceBoxVisible] = useState(true);
  const inlinePriceBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInlinePriceBoxVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Inline box is considered "visible" when 10% is showing
    );

    const currentRef = inlinePriceBoxRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className={cn(
      "bg-[#9A7DAB] h-full w-full rounded-t-[20px] relative flex flex-col pt-2 mt-4 overflow-hidden"
    )}>
      <div className="flex-grow overflow-y-auto no-scrollbar pb-24">
        <div className="-mt-2">
          <MobileImageGallery product={product} onImageExpandChange={() => {}} />
        </div>
        
        <div className="px-4">
            <ProductDetails product={product} isLiked={isLiked} onLikeToggle={onLikeToggle} isMobile={true} />
        </div>
        
        <Separator className="my-4 bg-white/30" />
        <div className="px-4">
            <FlavoursSection onAddToCart={onFlavourAddToCart} cart={flavourCart} isMobile={true} />
        </div>
        <Separator className="my-4 bg-white/30" />
        
        <div ref={inlinePriceBoxRef} className="px-4">
            <PriceBox
              product={product}
              productQuantity={productQuantity}
              onAddToCart={onAddToCart}
              onToggleCartPopup={onToggleCartPopup}
              className="rounded-xl"
            />
        </div>
      </div>
      
       {/* Floating Price Box */}
      <div
          className={cn(
            "fixed bottom-16 left-0 right-0 z-10 transition-all duration-300",
            isInlinePriceBoxVisible ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          )}
      >
          <PriceBox
              product={product}
              productQuantity={productQuantity}
              onAddToCart={onAddToCart}
              onToggleCartPopup={onToggleCartPopup}
              className="mx-0" // No margin for the floating bar
          />
      </div>
    </div>
  );
}
