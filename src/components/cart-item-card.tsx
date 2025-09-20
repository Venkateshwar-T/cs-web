// @/components/cart-item-card.tsx
'use client';

import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { FaTrash } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import type { OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';
import { useRouter } from 'next/navigation';

interface CartItemCardProps {
    item: OrderItem;
    product: SanityProduct;
    onQuantityChange: (productName: string, quantity: number, flavours?: string[]) => void;
    onRemove: (productName: string) => void;
    isRemoving: boolean;
    onAnimationEnd: () => void;
    onProductClick: (product: SanityProduct) => void;
}

export function CartItemCard({ item, product, onQuantityChange, onRemove, isRemoving, onAnimationEnd, onProductClick }: CartItemCardProps) {
    const router = useRouter();
    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(item.name, item.quantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(item.name, item.quantity - 1);
    };
    
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(item.name);
    }
    
    const handleClick = () => {
        onProductClick(product);
    }

    const subtitle = [product.weight, product.composition, product.packageType].filter(Boolean).join(' | ');
    const discountPercentage = product.mrp && product.discountedPrice && product.mrp > product.discountedPrice
    ? Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)
    : null;

    const availableFlavoursMap = product.availableFlavours?.reduce((acc, flavour) => {
        acc[flavour.name] = flavour;
        return acc;
    }, {} as Record<string, typeof product.availableFlavours[number]>);


    return (
        <div 
            onAnimationEnd={onAnimationEnd}
            className={cn(
                "w-full bg-white/80 rounded-2xl p-4 text-black relative transition-all duration-300 overflow-hidden",
                isRemoving && 'animate-fade-out-slide-up'
            )}
        >
            <div className="flex gap-4">
                <div 
                    className="w-1/3 flex-shrink-0 cursor-pointer"
                    onClick={handleClick}
                >
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-full aspect-square"
                    />
                </div>
                <div className="w-2/3 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-xl pr-8">{item.name}</h3>
                        <p className="text-sm text-black/70">{subtitle}</p>
                        
                        {item.flavours && item.flavours.length > 0 && (
                            <>
                                <p className="font-bold mt-2">Your Selection</p>
                                <p className="text-sm text-black/60 font-semibold">Flavours & Fillings</p>
                                <ul className="list-disc list-inside text-sm mt-1 space-y-1 font-bold">
                                    {item.flavours.map((flavour, index) => {
                                        const flavourDetails = availableFlavoursMap?.[flavour];
                                        const price = flavourDetails?.price ?? 0;

                                        return (
                                            <li key={index} className="flex items-center gap-1.5">
                                                <span>{flavour}</span>
                                                {product.numberOfChocolates && <span className="text-xs text-black/70 font-medium">x{product.numberOfChocolates} Pieces</span>}
                                                <span className="font-medium text-sm">{price > 0 ? `+₹${price}` : '+₹0'}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        )}
                    </div>

                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end">
                     <button onClick={handleRemove} className="text-custom-purple-dark hover:text-red-600 transition-colors pb-[78%]">
                        <FaTrash size={20} />
                    </button>
                    <div className="flex items-center justify-between rounded-full text-white h-9 w-32 border-2 border-custom-purple-dark overflow-hidden">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleDecrement}
                            className="h-full rounded-none bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white hover:text-white flex-shrink-0 px-3"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center bg-white text-custom-purple-dark h-full flex items-center justify-center">
                            <span className="font-bold px-1 text-sm">{item.quantity}</span>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleIncrement}
                            className="h-full rounded-none bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white hover:text-white flex-shrink-0 px-3"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-end gap-4 pt-4">
                        <div className="flex flex-col items-center">
                            {product.mrp && <p className="text-sm line-through text-gray-500 font-bold">₹{product.mrp}</p>}
                            {discountPercentage && <p className="text-sm text-custom-purple-dark font-semibold">{discountPercentage}% OFF</p>}
                        </div>
                        {product.discountedPrice && <p className="font-bold text-2xl">₹{product.discountedPrice}</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}
