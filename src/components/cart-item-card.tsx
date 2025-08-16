// @/components/cart-item-card.tsx
'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

interface CartItemCardProps {
    productName: string;
    quantity: number;
}

const selectedFlavours = [
    { name: 'Roasted Almond', price: 100 },
    { name: 'Fruit & Nut', price: 50 },
    { name: 'Dark Chocolate', price: 75 },
];

export function CartItemCard({ productName, quantity }: CartItemCardProps) {

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        // onAddToCart(product.name, quantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        // onAddToCart(product.name, quantity - 1);
    };

    return (
        <div className="w-[60%] bg-white/80 rounded-2xl p-4 text-black relative">
            <button className="absolute top-4 right-4 text-custom-purple-dark hover:text-custom-purple-dark/80">
                <Trash2 size={20} />
            </button>
            <div className="flex gap-4">
                <div className="w-1/3 flex-shrink-0">
                    <Image
                        src="/choco img.png"
                        alt={productName}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-full aspect-square"
                    />
                </div>
                <div className="w-2/3 flex flex-col">
                    <div>
                        <h3 className="font-bold text-xl">{productName}</h3>
                        <p className="text-sm text-black/70">250g | Assorted | Hard-Box</p>
                        
                        <p className="font-bold mt-2">Your Selection</p>
                        <p className="text-sm text-black/60 font-semibold">Flavours & Fillings</p>
                        <ol className="list-decimal list-inside text-sm mt-1 space-y-0.5">
                            {selectedFlavours.map((flavour, index) => (
                                <li key={index} className="flex gap-4">
                                    <span>{flavour.name}</span>
                                    <span>+₹{flavour.price}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="mt-auto pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-center rounded-full bg-custom-purple-dark text-white h-9 w-32">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleDecrement}
                                    className="h-full w-10 rounded-r-none rounded-l-full text-white hover:bg-white/10 hover:text-white"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold px-2">{quantity}</span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleIncrement}
                                    className="h-full w-10 rounded-l-none rounded-r-full text-white hover:bg-white/10 hover:text-white"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 line-through font-bold">₹1000</p>
                                <p className="font-bold text-2xl">₹750</p>
                            </div>
                        </div>
                        <p className="text-xs italic text-gray-600 mt-1">*Additional charges may apply for special flavors*</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
