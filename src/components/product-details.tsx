'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';
import Image from 'next/image';

interface ProductDetailsProps {
    product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="flex flex-col gap-4 text-white h-full">
            {/* Title and Like button */}
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold font-poppins">{product.name}</h2>
                <button onClick={() => setIsLiked(!isLiked)} className="p-1">
                    <Heart className={cn("h-7 w-7 stroke-current", isLiked ? 'text-red-500 fill-red-500' : 'text-white')} />
                </button>
            </div>

            {/* FSSAI Logo and details */}
            <div className="flex items-center gap-2">
                <Image src="/fssai_logo.png" alt="FSSAI" width={24} height={24} />
                <p className="text-sm">250g | Assorted | Hard-Box</p>
            </div>

            {/* Best for */}
            <div>
                <p className="text-sm">
                    <span className="font-semibold">Best for:</span> Weddings, Corporate Gifts, Birthdays & Anniversaries, Festive Seasons
                </p>
            </div>

            {/* Product Description */}
            <div>
                <p className="text-sm">
                    This premium hard-box presents a curated assortment of handcrafted chocolates. The collection is fully customizable, allowing you to select from a variety of dark, milk, and white chocolates to create a truly personalized gift.
                </p>
            </div>

            {/* Ingredients */}
            <div>
                 <p className="text-xs">
                    <span className="font-semibold">Ingredients:</span> Sugar, Edible Vegetable Fat, Cocoa Solids, Emulsifiers (492, 322). Contains Added Natural (Vanilla) Flavouring Substances.
                </p>
            </div>
            
            {/* Nutritional Information */}
            <div>
                <p className="text-xs">
                    <span className="font-semibold">Nutritional Information:</span> Made with Hydrogenated Vegetable Fat. Contains Trans Fats.
                </p>
            </div>

            {/* Allergen Alert */}
            <div>
                <p className="text-xs font-semibold">Allergen Alert:</p>
                <ul className="list-none pl-0 text-xs">
                    <li>*Contains soy.</li>
                    <li>*May contain traces of milk solids.</li>
                </ul>
            </div>
        </div>
    );
}
