
// @/components/product-card.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { SanityProduct } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

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

const variants = {
  enter: {
    opacity: 0,
  },
  center: {
    zIndex: 1,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    opacity: 0,
  },
};

export function ProductCard({ product, onAddToCart, onRemoveFromCart, quantity, onProductClick, isLiked, onLikeToggle, isMobile = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const images = product.images || [];

  useEffect(() => {
    if (!isHovered || isMobile || images.length <= 1) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isHovered, currentImageIndex, isMobile, images.length]);
  
  useEffect(() => {
    if (isLiked) {
        setIsAnimatingLike(true);
        const timer = setTimeout(() => setIsAnimatingLike(false), 300);
        return () => clearTimeout(timer);
    }
  }, [isLiked]);

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
  }

  const handleMouseEnter = () => {
    if (isMobile || images.length <= 1) return;
    setIsHovered(true);
    setCurrentImageIndex(1);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    setCurrentImageIndex(0);
  };
  
  const currentImageUrl = images.length > 0 ? images[currentImageIndex] : '/placeholder.png';


  const HeartButton = () => (
    <button 
      onClick={handleLikeClick} 
      className={cn(
        "p-1",
        isMobile && "absolute top-1.5 right-1.5 z-10 bg-black/20 rounded-full",
      )}
    >
      <Heart 
        key={String(isLiked)}
        className={cn(
          "stroke-current transition-colors duration-300", 
          isMobile ? "h-5 w-5" : "h-6 w-6",
          isLiked ? 'text-red-500 fill-red-500' : (isMobile ? 'text-white' : 'text-black'),
          isAnimatingLike && 'animate-heart-pop'
        )} 
      />
    </button>
  );

  const discountPercentage = product.mrp && product.discountedPrice && product.mrp > product.discountedPrice
    ? Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)
    : null;

  const subtitle = [product.weight, product.composition, product.packageType].filter(Boolean).join(' | ');

  return (
    <div
      onClick={() => onProductClick(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-white text-black rounded-lg md:rounded-2xl overflow-hidden flex flex-col h-full shadow-custom-dark cursor-pointer",
        !isMobile && "transition-transform duration-200 hover:scale-105"
      )}
    >
      <div className={cn(
        "relative w-full rounded-t-lg md:rounded-t-2xl overflow-hidden",
        isMobile ? "pt-[80%]" : "pt-[70%]"
      )}>
        {isMobile && <HeartButton />}
        <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: 0.5 },
              }}
            >
              <Image
                key={currentImageUrl}
                src={currentImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  "rounded-t-lg md:rounded-t-2xl object-cover",
                  !isMobile && "group-hover:scale-110"
                )}
              />
            </motion.div>
        </AnimatePresence>
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        <div className="flex-grow md:flex-grow-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm md:text-base leading-tight flex-1 pr-2 whitespace-nowrap truncate">{product.name}</h3>
            {!isMobile && (
              <div className="relative">
                <HeartButton />
              </div>
            )}
          </div>
          <p className={cn(
            "text-[#9A7DAB] mt-1 whitespace-nowrap truncate",
            isMobile ? "text-[11px]" : "text-xs"
          )}>{subtitle}</p>
        </div>
        <div className="mt-2 md:mt-4 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-0">
          <div>
            {product.mrp && <p className="text-xs text-gray-500 line-through font-bold">₹{product.mrp}</p>}
            <div className="flex items-center">
              {product.discountedPrice && <p className="font-bold text-sm md:text-base">₹{product.discountedPrice}</p>}
              {discountPercentage && <p className="text-custom-gold text-xs font-semibold ml-2">{discountPercentage}% OFF</p>}
            </div>
          </div>
          <div className="w-full md:w-auto md:flex-grow md:ml-2">
            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={handleAddToCartClick}
                className={cn(
                  "w-full rounded-full uppercase bg-transparent border-2 border-b-[3px] border-custom-purple-dark text-custom-purple-dark text-xs hover:bg-custom-purple-dark hover:text-white",
                  isMobile ? "h-7" : "h-8"
                )}
              >
                Add
              </Button>
            ) : (
              <div className={cn(
                "flex items-center justify-between w-full rounded-full text-white border-2 border-custom-purple-dark overflow-hidden",
                isMobile ? "h-7" : "h-8"
              )}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDecrement}
                  className="h-full rounded-none bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white hover:text-white flex-shrink-0 px-2"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center bg-white text-custom-purple-dark">
                  <span className="font-bold px-1 text-sm">{quantity}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleIncrement}
                  className="h-full rounded-none bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white hover:text-white flex-shrink-0 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
