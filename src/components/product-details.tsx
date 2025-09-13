// @/components/product-details.tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SanityProduct } from '@/types';
import { PortableText } from '@portabletext/react';

interface ProductDetailsProps {
    product: SanityProduct;
    isLiked: boolean;
    onLikeToggle: () => void;
    isMobile?: boolean;
}

export function ProductDetails({ product, isLiked, onLikeToggle, isMobile = false }: ProductDetailsProps) {
    const [likeClickCount, setLikeClickCount] = useState(0);

    const handleLikeClick = () => {
        setLikeClickCount(prev => prev + 1);
        onLikeToggle();
    };
    
    const subtitle = [product.weight, product.composition, product.packageType].filter(Boolean).join(' | ');

    return (
        <div className={cn("flex flex-col gap-4 h-full animate-slide-in-from-right text-black")} style={{ animationDuration: '0.5s' }}>
            {/* Title and Like button */}
            <div className="flex justify-between items-start">
                <h2 className={cn("font-bold font-plex-sans-condensed", isMobile ? "text-2xl" : "text-3xl")}>{product.name}</h2>
                <div className="relative">
                    <button onClick={handleLikeClick} className="p-1">
                        <Heart 
                            key={likeClickCount}
                            className={cn(
                                "h-7 w-7 stroke-current transition-colors duration-300", 
                                isLiked ? 'text-red-500 fill-red-500' : 'text-black',
                                'animate-heart-pop'
                            )} 
                        />
                    </button>
                </div>
            </div>

            {/* FSSAI Logo and details */}
            <div className="flex items-center gap-2 -mt-2 font-poppins font-normal">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <rect x="1" y="1" width="22" height="22" rx="0" stroke="#137C00" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="7" fill="#137C00"/>
                  </svg>
                </div>
                <p className={cn("font-normal font-poppins", isMobile ? "text-sm" : "text-base")}>{subtitle}</p>
            </div>

            {/* Best for */}
            {product.bestFor && (
                <div>
                     <p className={cn("font-semibold font-plex-sans-condensed", isMobile ? "text-xs" : "text-base")}>
                        <span className="font-semibold">Best for:</span> {product.bestFor}
                    </p>
                </div>
            )}

            {/* Product Description */}
            {product.description && (
                <div>
                    <div className={cn("font-medium font-plex-sans", isMobile ? "text-sm" : "text-base")}>
                       <PortableText value={product.description} />
                    </div>
                </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
                <div>
                     <p className={cn("font-plex-sans-condensed", isMobile ? "text-xs" : "text-base")}>
                        <span className="font-medium">Ingredients:</span> {product.ingredients}
                    </p>
                </div>
            )}
            
            {/* Allergen Alert */}
            {product.allergenAlert && (
                <div className={cn("font-medium font-plex-sans", isMobile ? "text-sm" : "text-base")}>
                    <p className={cn("font-semibold", isMobile ? "text-sm" : "text-sm")}>Allergen Alert:</p>
                    <PortableText value={product.allergenAlert} />
                </div>
            )}
        </div>
    );
}
