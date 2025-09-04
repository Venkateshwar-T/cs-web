// @/components/mobile-cart-item-card.tsx
'use client';

import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface MobileCartItemCardProps {
    productName: string;
    quantity: number;
    onQuantityChange: (productName: string, newQuantity: number) => void;
    onRemove: (productName: string) => void;
}

const selectedFlavours = [
    { name: 'Roasted Almond', price: 100 },
    { name: 'Fruit & Nut', price: 50 },
    { name: 'Dark Chocolate', price: 75 },
];

export function MobileCartItemCard({ productName, quantity, onQuantityChange, onRemove }: MobileCartItemCardProps) {
    const handleRemove = () => {
        onRemove(productName);
    }

    return (
        <div 
            className={cn(
                "w-full bg-white/80 rounded-2xl p-3 text-black relative transition-all duration-300 overflow-hidden"
            )}
        >
            <div className="flex gap-3">
                <div className="w-1/4 flex-shrink-0">
                    <Image
                        src="/choco img.png"
                        alt={productName}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover w-full aspect-square"
                        data-ai-hint="chocolate box"
                    />
                </div>
                <div className="w-3/4 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-base pr-6 truncate">{productName}</h3>
                        <p className="text-xs text-black/80 truncate">250g | Assorted | Hard-Box</p>
                        
                        <p className="font-semibold text-xs text-black/60 mt-2">Selected Flavours & Fillings</p>
                        <ul className="list-disc list-inside text-xs mt-1 space-y-0.5 font-medium">
                           {selectedFlavours.map((flavour, index) => (
                                <li key={index}>
                                    <span className="w-24 inline-block">{flavour.name}</span>
                                    <span className='ml-1'>+₹{flavour.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                           <p className="text-sm line-through text-black/70 font-semibold">₹1000</p>
                           <p className="text-lg font-bold">₹750</p>
                           <p className="text-xs text-custom-gold font-semibold">25% OFF</p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-3 right-3">
                     <button onClick={handleRemove} className="text-black/80 hover:text-red-500 transition-colors">
                        <FaTrash size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
