
// @/components/product-card.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { SanityProduct } from '@/types';

interface ProductCardProps {
  product: SanityProduct;
  onAddToCart: (product: SanityProduct) => void;
  onRemoveFromCart: (product: SanityProduct) => void;
  quantity: number;
  onProductClick: (product: SanityProduct) => void;
  isLiked: boolean;
  onLikeToggle: (productId: string) => void;
  isMobile?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onRemoveFromCart,
  quantity,
  onProductClick,
  isLiked,
  onLikeToggle,
  isMobile = false,
}: ProductCardProps) {
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFromCart(product);
  };
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle(product._id);
    if (!isLiked) {
      setIsAnimatingLike(true);
    }
  };

  const discountPercentage = product.mrp && product.discountedPrice && product.mrp > product.discountedPrice
    ? Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)
    : null;
    
  const subtitle = [product.weight, product.composition, product.packageType].filter(Boolean).join(' | ');

  return (
    <div
      onClick={() => onProductClick(product)}
      className="relative w-full h-full bg-white/90 hover:bg-custom-gold rounded-2xl overflow-hidden cursor-pointer group border border-custom-gold md:border-white hover:border-custom-gold transition-colors duration-300 flex flex-col shadow-lg"
    >
      {/* Image Section */}
      <div className="relative w-full pt-[100%] overflow-hidden">
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          onClick={handleLikeClick} 
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full text-white hover:text-red-500 transition-colors"
          aria-label="Like product"
        >
          <Heart 
            key={String(isLiked)}
            onAnimationEnd={() => setIsAnimatingLike(false)}
            className={cn(
              "h-4 w-4 md:h-5 md:w-5 transition-all",
              isLiked ? 'text-red-500 fill-red-500' : 'text-white',
              isAnimatingLike && 'animate-heart-pop'
            )} 
          />
        </button>

        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-custom-gold text-custom-purple-dark px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold z-10">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col p-2 md:p-3 text-black flex-grow">
        <h3 className="font-bold text-xs md:text-base leading-tight truncate">{product.name}</h3>
        <p className="text-[10px] md:text-xs text-black/70 mt-0.5 truncate">{subtitle}</p>
        
        <div className="flex-grow"></div>

        {isMobile ? (
          <>
            <div className="flex items-center mt-2">
              {product.discountedPrice !== undefined && (
                <div className="flex flex-col">
                  {product.mrp && product.mrp > product.discountedPrice && <p className="text-[10px] text-black/70 line-through">₹{product.mrp.toFixed(2)}</p>}
                  <p className="font-bold text-sm text-custom-purple-dark -mt-1">₹{product.discountedPrice.toFixed(2)}</p>
                </div>
              )}
            </div>
            <div className="mt-2">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  onClick={handleAddToCartClick}
                  className="w-full h-7 rounded-lg bg-custom-purple-dark text-white hover:bg-custom-purple-dark/90 text-xs"
                  aria-label="Add to cart"
                >
                  ADD
                </Button>
              ) : (
                <div className="flex items-center justify-center h-7 w-full rounded-lg bg-custom-purple-dark text-white overflow-hidden">
                  <Button variant="ghost" size="icon" onClick={handleDecrement} className="h-full rounded-none flex-1 hover:bg-black/20 text-white hover:text-white"><Minus className="w-4 h-4" /></Button>
                  <span className="font-bold text-sm flex-1 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={handleIncrement} className="h-full rounded-none flex-1 hover:bg-black/20 text-white hover:text-white"><Plus className="w-4 h-4" /></Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center mt-2">
            {product.discountedPrice !== undefined && (
              <div className="flex flex-col">
                {product.mrp && product.mrp > product.discountedPrice && <p className="text-[10px] md:text-xs text-black/70 line-through">₹{product.mrp.toFixed(2)}</p>}
                <p className="font-bold text-xs md:text-lg text-custom-purple-dark -mt-1">₹{product.discountedPrice.toFixed(2)}</p>
              </div>
            )}
            
            <div className="flex-shrink-0">
              {quantity === 0 ? (
                <Button
                  size="icon"
                  onClick={handleAddToCartClick}
                  className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-custom-purple-dark text-white hover:bg-custom-purple-dark/90"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              ) : (
                <div className="flex items-center justify-center h-6 md:h-9 w-16 md:w-24 rounded-full bg-custom-purple-dark text-white overflow-hidden">
                  <Button variant="ghost" size="icon" onClick={handleDecrement} className="h-full rounded-none flex-1 hover:bg-black/20 text-xs text-white hover:text-white"><Minus className="h-1 w-1" /></Button>
                  <span className="font-bold text-sm flex-1 text-xs text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={handleIncrement} className="h-full rounded-none flex-1 hover:bg-black/20 text-white hover:text-white"><Plus className="h-1 w-1" /></Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
