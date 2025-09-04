// @/components/mobile-cart-item-card.tsx
'use client';

import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Minus, Plus, ArrowDown, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    
    const handleIncrement = () => {
        onQuantityChange(productName, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onQuantityChange(productName, quantity - 1);
        }
    };


    return (
        <div 
            className={cn(
                "w-full bg-white/80 rounded-2xl p-3 text-black relative transition-all duration-300 overflow-hidden"
            )}
        >
            <div className="flex gap-3 items-center">
                <div className="w-1/3 flex-shrink-0 flex flex-col items-center gap-2">
                    <Image
                        src="https://picsum.photos/100/100"
                        alt={productName}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover w-full aspect-square"
                        data-ai-hint="chocolate box"
                    />
                    <div className="flex items-center justify-between w-full max-w-[100px] rounded-full text-black h-8 bg-gray-200 overflow-hidden">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleDecrement}
                            className="h-full rounded-none bg-gray-200 hover:bg-gray-300 text-black flex-shrink-0 px-2"
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center bg-gray-200 h-full flex items-center justify-center">
                            <span className="font-bold px-1 text-sm">{quantity}</span>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleIncrement}
                            className="h-full rounded-none bg-gray-200 hover:bg-gray-300 text-black flex-shrink-0 px-2"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="w-2/3 flex flex-col justify-between self-stretch pr-2">
                    <div>
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="font-bold text-base truncate flex-1">{productName}</h3>
                            <button onClick={handleRemove} className="text-black/80 hover:text-red-500 transition-colors flex-shrink-0">
                                <FaTrash size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-black/80 truncate mt-0">250g | Assorted | Hard-Box</p>
                        
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="flex items-center gap-1 text-xs text-black/60 mt-2 hover:text-black transition-colors">
                              <span>Click to see your selected flavours & fillings</span>
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </SheetTrigger>
                          <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-auto p-4">
                            <SheetHeader className="text-center mb-4">
                              <SheetTitle className="text-white">Selected Flavours & Fillings</SheetTitle>
                            </SheetHeader>
                            <ul className="list-disc list-inside text-sm mt-1 space-y-2 font-medium bg-white/10 rounded-lg p-4">
                              {selectedFlavours.map((flavour, index) => (
                                  <li key={index}>
                                      <span className="w-36 inline-block">{flavour.name}</span>
                                      <span className='ml-1'>+₹{flavour.price}</span>
                                  </li>
                              ))}
                            </ul>
                          </SheetContent>
                        </Sheet>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                         <div className="flex items-baseline gap-2">
                           <p className="text-sm line-through text-black/70 font-semibold">₹1000</p>
                           <div className="flex items-center gap-1 text-custom-purple-dark bg-custom-gold px-1.5 py-0.5 rounded-md">
                            <ArrowDown className="h-3 w-3" />
                            <span className="text-xs font-semibold">25%</span>
                           </div>
                        </div>
                        <p className="text-lg font-bold">₹750</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
