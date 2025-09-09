
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

const FloatingPriceBox = ({ product, productQuantity, onAddToCart, onBuyNow, className }: { product: Product, productQuantity: number, onAddToCart: any, onBuyNow: any, className?: string }) => {
    const handleAddToCartClick = () => {
        onAddToCart(product.name, 1, false);
    };

    const handleIncrement = () => {
        onAddToCart(product.name, productQuantity + 1, false);
    };

    const handleDecrement = () => {
        onAddToCart(product.name, productQuantity - 1, false);
    };

    return (
        <div className={cn("border-t border-white/20 bg-custom-purple-dark/60 p-2 px-3 backdrop-blur-md", className)}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="text-white">
                        <p className="pl-1 text-[10px] line-through opacity-70">₹1000</p>
                        <p className="text-lg font-bold">₹750</p>
                    </div>
                     <div className="flex bg-custom-gold text-custom-purple-dark px-1 py-0.5 rounded-md">
                        <span className="text-[10px] font-bold">25% OFF</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     {productQuantity === 0 ? (
                        <Button
                            className="rounded-full font-semibold text-[10px] bg-custom-gold text-custom-purple-dark py-1 h-7 px-3 hover:bg-custom-gold/90"
                            onClick={handleAddToCartClick}
                        >
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center w-20 rounded-full h-7 bg-custom-gold overflow-hidden border-2 border-white">
                            <Button size="icon" variant="ghost" onClick={handleDecrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                                <Minus className="h-3 w-3 text-custom-purple-dark" />
                            </Button>
                            <div className="flex-1 text-center bg-custom-purple-dark text-white h-full flex items-center justify-center">
                                <span className="font-bold px-1 text-xs">{productQuantity}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={handleIncrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                                <Plus className="h-3 w-3 text-custom-purple-dark" />
                            </Button>
                        </div>
                    )}
                    <Button
                        onClick={onBuyNow}
                        className="rounded-full font-semibold text-[10px] border border-white bg-white text-custom-purple-dark py-1 h-7 px-4 hover:bg-gray-200"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
};


const InlinePriceBox = ({ product, productQuantity, onAddToCart, onBuyNow, className }: { product: Product, productQuantity: number, onAddToCart: any, onBuyNow: any, className?: string }) => {
    const handleAddToCartClick = () => {
        onAddToCart(product.name, 1, false);
    };

    const handleIncrement = () => {
        onAddToCart(product.name, productQuantity + 1, false);
    };

    const handleDecrement = () => {
        onAddToCart(product.name, productQuantity - 1, false);
    };

    return (
        <div className={cn("px-4", className)}>
            <div className="bg-custom-purple-dark/80 p-3 backdrop-blur-sm rounded-t-xl">
                 <div className="flex justify-center items-center mb-3 gap-2">
                    <p className="text-sm line-through opacity-70 text-white">₹1000</p>
                    <div className="flex bg-custom-gold text-custom-purple-dark px-1 py-0.5 rounded-md text-[10px] font-bold">
                        <span>25% OFF</span>
                    </div>
                    <p className="text-xl font-bold text-white">₹750</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 mx-auto max-w-xs">
                    {productQuantity === 0 ? (
                        <Button
                            className="w-full rounded-full font-semibold text-xs border-2 border-custom-gold bg-custom-gold text-custom-purple-dark py-1 h-8 hover:bg-custom-gold/90"
                            onClick={handleAddToCartClick}
                        >
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center w-full rounded-full h-8 bg-custom-gold overflow-hidden border-2 border-white">
                            <Button size="icon" variant="ghost" onClick={handleDecrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                                <Minus className="h-4 w-4 text-custom-purple-dark" />
                            </Button>
                            <div className="flex-1 text-center bg-custom-purple-dark text-white h-full flex items-center justify-center">
                                <span className="font-bold px-1 text-base">{productQuantity}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={handleIncrement} className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1">
                                <Plus className="h-4 w-4 text-custom-purple-dark" />
                            </Button>
                        </div>
                    )}
                    <Button
                        onClick={onBuyNow}
                        className="w-full rounded-full font-semibold text-xs border border-white bg-white text-custom-purple-dark py-1.5 h-8 hover:bg-gray-200"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
};


interface MobileProductDetailViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (name: string, quantity: number, animate?: boolean) => void;
  cart: Record<string, number>;
  onBuyNow: () => void;
  isLiked: boolean;
  onLikeToggle: (productId: number) => void;
  flavourCart: Record<string, number>;
  onFlavourAddToCart: (flavourId: number, quantity: number) => void;
}

export function MobileProductDetailView({ 
  product, 
  onClose, 
  onAddToCart, 
  cart, 
  onBuyNow, 
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
      { threshold: 0.1 }
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
      "bg-[#9A7DAB] h-full w-full rounded-[20px] relative flex flex-col pt-2 mt-4 overflow-hidden"
    )}>
      <div className="flex-grow overflow-y-auto no-scrollbar">
        <div className="-mt-2">
          <MobileImageGallery product={product} onImageExpandChange={() => {}} />
        </div>
        
        <div className="px-4 pt-6">
            <ProductDetails product={product} isLiked={isLiked} onLikeToggle={() => onLikeToggle(product.id)} isMobile={true} />
        </div>
        
        <Separator className="my-4 bg-white/30" />
        <div className="px-4">
            <FlavoursSection onAddToCart={onFlavourAddToCart} cart={flavourCart} isMobile={true} />
        </div>
        
        <div ref={inlinePriceBoxRef}>
            <InlinePriceBox
              product={product}
              productQuantity={productQuantity}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
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
          <FloatingPriceBox
              product={product}
              productQuantity={productQuantity}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
          />
      </div>
    </div>
  );
}
