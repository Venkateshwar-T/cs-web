// @/components/mobile-cart-item-card.tsx
'use client';

import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MobileCartItemCardProps {
    item: OrderItem;
    product: SanityProduct;
    onQuantityChange: (productName: string, newQuantity: number) => void;
    onRemove: (productName: string) => void;
    isLastItem: boolean;
    onProductClick: (product: SanityProduct) => void;
}

export function MobileCartItemCard({ item, product, onQuantityChange, onRemove, isLastItem, onProductClick }: MobileCartItemCardProps) {
    const [isFlavourSheetOpen, setIsFlavourSheetOpen] = useState(false);
    
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(item.name);
    }
    
    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(item.name, item.quantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.quantity > 1) {
            onQuantityChange(item.name, item.quantity - 1);
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        if (!isFlavourSheetOpen) {
            onProductClick(product);
        }
    }
    
    const subtitle = [product.weight, product.composition, product.packageType].filter(Boolean).join(' | ');
    const discountPercentage = product.mrp && product.discountedPrice && product.mrp > product.discountedPrice
    ? Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)
    : null;

    const availableFlavoursMap = product.availableFlavours?.reduce((acc, flavour) => {
        acc[flavour.name] = flavour;
        return acc;
    }, {} as Record<string, typeof product.availableFlavours[number]>);
    
    const flavourTotal = (item.flavours && availableFlavoursMap)
        ? item.flavours.reduce((acc, flavourName) => acc + (availableFlavoursMap[flavourName]?.price || 0), 0)
        : 0;
        
    const itemPrice = (product.discountedPrice || 0) + flavourTotal;

    return (
        <div 
            className={cn(
                "w-full bg-transparent pl-3 py-3 pr-4 text-black relative transition-all duration-300 overflow-hidden",
                !isLastItem && "border-b border-black/10"
            )}
        >
            <div className="flex gap-3 items-center">
                <div 
                    className="w-1/4 flex-shrink-0 flex flex-col items-center gap-2"
                >
                    <div className="cursor-pointer" onClick={handleImageClick}>
                      <Image
                          src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover w-full aspect-square"
                          data-ai-hint="chocolate box"
                      />
                    </div>
                    <div className="flex items-center justify-between w-full max-w-[100px] rounded-full text-black h-8 bg-gray-200 overflow-hidden">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleDecrement}
                            className="h-full rounded-none bg-gray-200 hover:bg-gray-300 text-black flex-1 flex items-center justify-center"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center bg-gray-200 h-full flex items-center justify-center">
                            <span className="font-bold px-1 text-sm">{item.quantity}</span>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleIncrement}
                            className="h-full rounded-none bg-gray-200 hover:bg-gray-300 text-black flex-1 flex items-center justify-center"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="w-3/4 flex flex-col justify-between self-stretch">
                    <div className="flex flex-col items-start">
                        <div className="flex justify-between items-center w-full gap-2">
                            <h3 className="font-bold text-base flex-1 truncate">{item.name}</h3>
                            <button onClick={handleRemove} className="text-black/80 hover:text-red-500 transition-colors flex-shrink-0">
                                <FaTrash size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-black/80 truncate mt-0">{subtitle}</p>
                        
                        {item.flavours && item.flavours.length > 0 && (
                            <Sheet open={isFlavourSheetOpen} onOpenChange={setIsFlavourSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" className="h-auto p-2 mt-2 text-custom-purple-dark text-xs rounded-lg hover:text-custom-purple-dark hover:bg-black/5" onClick={(e) => e.stopPropagation()}>
                                    <span>Selected Flavours</span>
                                    <ChevronDown className="h-4 w-4 text-custom-purple-dark" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent 
                                  side="bottom" 
                                  className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-auto p-0"
                                >
                                    <SheetHeader className="p-4 border-b border-white/20">
                                    <SheetTitle className="text-white">Selected Flavours & Fillings</SheetTitle>
                                    </SheetHeader>
                                    <div className="bg-white/10 rounded-lg p-4 m-4">
                                        <ul className="list-disc list-inside text-sm mt-1 space-y-2 font-medium">
                                        {item.flavours.map((flavour, index) => {
                                            const flavourDetails = availableFlavoursMap?.[flavour];
                                            const price = flavourDetails?.price ?? 0;
                                            return (
                                                <li key={index} className="flex justify-between items-center">
                                                    <span className="w-24 inline-block">{flavour}</span>
                                                    {product.numberOfChocolates && <span className="text-xs text-white/70 font-medium">x{product.numberOfChocolates} Pieces</span>}
                                                    <span className="font-semibold text-right w-20">{price > 0 ? `+₹${price}` : '+₹0'}</span>
                                                </li>
                                            )
                                        })}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-center text-white/70 italic pb-4">
                                        *Additional charges may apply for special flavours*
                                    </p>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                         <div className="flex items-baseline gap-2">
                           {product.mrp && <p className="text-sm line-through text-black/70 font-semibold">₹{product.mrp}</p>}
                           {discountPercentage && (
                            <div className="flex items-center gap-1 text-custom-purple-dark bg-custom-gold px-1.5 py-0.5 rounded-md">
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12z"/></svg>
                                <span className="text-xs font-semibold">{discountPercentage}%</span>
                            </div>
                           )}
                        </div>
                        {<p className="text-lg font-bold">₹{itemPrice}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
