'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';

interface ProductDetailsProps {
    product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="flex flex-col gap-4 text-black h-full">
            {/* Title and Like button */}
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold font-poppins">{product.name}</h2>
                <button onClick={() => setIsLiked(!isLiked)} className="p-1">
                    <Heart className={cn("h-7 w-7 stroke-current", isLiked ? 'text-red-500 fill-red-500' : 'text-black')} />
                </button>
            </div>

            {/* FSSAI Logo and details */}
            <div className="flex items-center gap-2 -mt-2 font-poppins font-normal">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <rect x="1" y="1" width="22" height="22" rx="3" stroke="#137C00" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="7" fill="#137C00"/>
                  </svg>
                </div>
                <p className="text-sm">250g | Assorted | Hard-Box</p>
            </div>

            {/* Best for */}
            <div>
                <p className="text-base font-semibold font-plex-sans-condensed">
                    Best for: Weddings, Corporate Gifts, Birthdays & Anniversaries, Festive Seasons
                </p>
            </div>

            {/* Product Description */}
            <div>
                <p className="text-base font-plex-sans">
                    This premium hard-box presents a curated assortment of handcrafted chocolates. The collection is fully customizable, allowing you to select from a variety of dark, milk, and white chocolates to create a truly personalized gift.
                </p>
            </div>

            {/* Ingredients */}
            <div>
                 <p className="text-sm font-normal font-plex-sans-condensed">
                    <span className="font-semibold">Ingredients:</span> Sugar, Edible Vegetable Fat, Cocoa Solids, Emulsifiers (492, 322). Contains Added Natural (Vanilla) Flavouring Substances.
                </p>
            </div>
            
            {/* Nutritional Information */}
            <div>
                <p className="text-sm font-normal font-plex-sans-condensed">
                    <span className="font-semibold">Nutritional Information:</span> Made with Hydrogenated Vegetable Fat. Contains Trans Fats.
                </p>
            </div>

            {/* Allergen Alert */}
            <div>
                <p className="text-sm font-semibold">Allergen Alert:</p>
                <ul className="list-disc pl-5 text-sm font-semibold">
                    <li>Contains soy.</li>
                    <li>May contain traces of milk solids.</li>
                </ul>
            </div>
        </div>
    );
}
