
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
      const timer = setTimeout(() => setIsAnimatingLike(false), 300);
      return () => clearTimeout(timer);
    }
  };

  const discountPercentage = product.mrp && product.discountedPrice && product.mrp > product.discountedPrice
    ? Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)
    : null;
    
  const subtitle = [product.weight, product.composition, product.packageType].filter(Boolean).join(' | ');

  return (
    <div
      onClick={() => onProductClick(product)}
      className="relative w-full h-full bg-black/20 rounded-2xl overflow-hidden cursor-pointer group border border-white/20 hover:border-custom-gold/50 transition-colors duration-300 flex flex-col"
    >
      <div className="relative w-full pt-[100%]">
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <button 
        onClick={handleLikeClick} 
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/30 rounded-full text-white hover:text-red-500 transition-colors"
        aria-label="Like product"
      >
        <Heart 
          key={String(isLiked)}
          className={cn(
            "h-4 w-4 md:h-5 md:w-5 transition-all",
            isLiked ? 'text-red-500 fill-red-500' : 'text-white',
            isAnimatingLike && 'animate-heart-pop'
          )} 
        />
      </button>

      {discountPercentage && (
        <div className="absolute top-2 left-2 bg-custom-gold text-custom-purple-dark px-2 py-0.5 rounded-full text-xs font-bold z-10">
          {discountPercentage}% OFF
        </div>
      )}

      <div className="relative flex flex-col justify-end p-3 md:p-4 text-white flex-grow -mt-16">
        <div className="flex-grow"></div>
        <h3 className="font-bold text-sm md:text-base leading-tight truncate">{product.name}</h3>
        <p className="text-[10px] md:text-xs text-white/80 mt-0.5 truncate">{subtitle}</p>
        
        <div className="flex justify-between items-center mt-2">
          {product.discountedPrice !== undefined && (
            <div className="flex flex-col">
              {product.mrp && product.mrp > product.discountedPrice && <p className="text-[10px] md:text-xs text-white/70 line-through">₹{product.mrp.toFixed(2)}</p>}
              <p className="font-bold text-sm md:text-lg text-custom-gold -mt-1">₹{product.discountedPrice.toFixed(2)}</p>
            </div>
          )}
          
          <div className="flex-shrink-0">
            {quantity === 0 ? (
              <Button
                size="icon"
                onClick={handleAddToCartClick}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white text-custom-purple-dark hover:bg-gray-200"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            ) : (
              <div className="flex items-center justify-center h-8 md:h-9 w-24 rounded-full bg-white text-custom-purple-dark overflow-hidden">
                <Button variant="ghost" size="icon" onClick={handleDecrement} className="h-full rounded-none flex-1 hover:bg-gray-200"><Minus className="h-4 w-4" /></Button>
                <span className="font-bold text-sm flex-1 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={handleIncrement} className="h-full rounded-none flex-1 hover:bg-gray-200"><Plus className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
