
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';
import { SparkleIcon } from './sparkle-icon';

interface ProductDetailsProps {
    product: Product;
    isLiked: boolean;
    onLikeToggle: () => void;
    isMobile?: boolean;
}

export function ProductDetails({ product, isLiked, onLikeToggle, isMobile = false }: ProductDetailsProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [likeClickCount, setLikeClickCount] = useState(0);

    const handleLikeClick = () => {
        setLikeClickCount(prev => prev + 1);
        onLikeToggle();
        if (!isLiked) {
            setIsAnimating(true);
        }
    };

    return (
        <div className={cn("flex flex-col gap-4 h-full animate-slide-in-from-right text-black")} style={{ animationDuration: '0.5s' }}>
            {/* Title and Like button */}
            <div className="flex justify-between items-start">
                <h2 className={cn("font-bold font-plex-sans-condensed", isMobile ? "text-xl" : "text-3xl")}>{product.name}</h2>
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
                    {isAnimating && (
                        <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            onAnimationEnd={() => setIsAnimating(false)}
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute"
                                    style={{
                                        transform: `rotate(${i * 60}deg) translateY(-30px)`,
                                    }}
                                >
                                    <div className="animate-sparkle-pulse">
                                        <SparkleIcon className="text-red-500 animate-sparkle-fade-out" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                <p className={cn("font-normal font-poppins", isMobile ? "text-sm" : "text-base")}>250g | Assorted | Hard-Box</p>
            </div>

            {/* Best for */}
            <div>
                <p className={cn("font-semibold font-plex-sans-condensed", isMobile ? "text-sm" : "text-base")}>
                    Best for: Weddings, Corporate Gifts, Birthdays & Anniversaries, Festive Seasons
                </p>
            </div>

            {/* Product Description */}
            <div>
                <p className={cn("font-medium font-plex-sans", isMobile ? "text-sm" : "text-base")}>
                    This premium hard-box presents a curated assortment of handcrafted chocolates. The collection is fully customizable, allowing you to select from a variety of dark, milk, and white chocolates to create a truly personalized gift.
                </p>
            </div>

            {/* Ingredients */}
            <div>
                 <p className={cn("font-plex-sans-condensed", isMobile ? "text-xs" : "text-base")}>
                    <span className="font-medium">Ingredients:</span> Sugar, Edible Vegetable Fat, Cocoa Solids, Emulsifiers (492, 322). Contains Added Natural (Vanilla) Flavouring Substances.
                </p>
            </div>
            
            {/* Nutritional Information */}
            <div>
                <p className={cn("font-plex-sans-condensed", isMobile ? "text-xs" : "text-base")}>
                    <span className="font-medium">Nutritional Information:</span> Made with Hydrogenated Vegetable Fat. Contains Trans Fats.
                </p>
            </div>

            {/* Allergen Alert */}
            <div>
                <p className={cn("font-semibold", isMobile ? "text-sm" : "text-base")}>Allergen Alert:</p>
                <ul className="list-disc pl-5 font-semibold">
                    <li className={cn(isMobile ? "text-xs" : "text-sm")}>Contains soy.</li>
                    <li className={cn(isMobile ? "text-xs" : "text-sm")}>May contain traces of milk solids.</li>
                </ul>
            </div>
        </div>
    );
}
