
'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/app/page';
import { Plus, Minus } from 'lucide-react';

interface ProductPopupFooterProps {
    product: Product;
    onAddToCart: (productName: string, quantity: number, animate?: boolean) => void;
    quantity: number;
}

export function ProductPopupFooter({ product, onAddToCart, quantity }: ProductPopupFooterProps) {

    const handleAddToCartClick = () => {
        onAddToCart(product.name, 1, false);
    };

    const handleIncrement = () => {
        onAddToCart(product.name, quantity + 1, false);
    };

    const handleDecrement = () => {
        onAddToCart(product.name, quantity - 1, false);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 md:h-[8%] lg:h-[11%] animate-slide-up-fade-in" style={{ animationDuration: '0.2s', animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="bg-custom-purple-dark h-full w-full md:rounded-t-xl lg:rounded-t-2xl xl:rounded-t-3xl flex items-center justify-center">
                <div className="flex items-center justify-center md:gap-6 lg:gap-2 xl:gap-4 text-white w-full">
                    <div className="flex flex-col items-center">
                        <p className="lg:text-sm xl:text-sm opacity-100">
                          <span className="relative inline-block
                            after:content-[''] after:absolute after:left-0 after:top-1/2 after:h-[1.5px] after:bg-white after:animate-cut-through after:origin-left">
                              ₹1000
                          </span>
                        </p>
                        <p className="lg:text-sm xl:text-m text-custom-gold font-semibold animate-shake" style={{ animationIterationCount: 'infinite', animationDuration: '8s' }}>25% OFF</p>
                    </div>

                    <p className="md:text-2xl lg:text-xl xl:text-3xl font-bold">₹750</p>
                    
                    <div className="flex items-center md:gap-6 lg:gap-2 xl:gap-2">
                        {quantity === 0 ? (
                             <>
                                <Button
                                    size="sm"
                                    className="rounded-full font-semibold text-sm md:text-sm lg:text-sm xl:text-base border border-custom-purple-dark bg-custom-gold text-custom-purple-dark md:px-2 xl:px-4 lg:px-4 py-1.5 h-auto hover:bg-custom-gold/90"
                                    onClick={handleAddToCartClick}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    size="sm"
                                    className="rounded-full font-semibold text-sm md:text-sm lg:text-sm xl:text-base border border-white bg-white text-custom-purple-dark md:px-2 xl:px-4 lg:px-4 py-1.5 h-auto hover:bg-custom-purple-dark hover:text-white"
                                >
                                    Buy Now
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center w-32 rounded-full h-9 border-2 border-white overflow-hidden">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleDecrement}
                                    className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 text-center bg-custom-purple-dark text-white h-full flex items-center justify-center">
                                    <span className="font-bold px-1 text-sm">{quantity}</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleIncrement}
                                    className="h-full rounded-none bg-white hover:bg-white/90 text-custom-purple-dark hover:text-custom-purple-dark flex-1"
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
