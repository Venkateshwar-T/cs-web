'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function ProductPopupFooter() {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-[11%]">
            <div className="bg-custom-purple-dark h-full w-full rounded-t-3xl flex items-center justify-center">
                <div className="flex items-center justify-center gap-4 text-white w-full">
                    <div className="flex flex-col items-center">
                        <p className="text-sm line-through opacity-100">₹1000</p>
                        <p className="text-sm text-custom-gold font-semibold">25% OFF</p>
                    </div>

                    <p className="text-3xl font-bold">₹750</p>

                    <Button
                        size="sm"
                        className="rounded-full font-semibold text-sm lg:text-base border border-custom-purple-dark bg-custom-gold text-custom-purple-dark px-4 py-1.5 h-auto hover:bg-custom-gold/90"
                    >
                        Add to Cart
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full font-semibold text-sm lg:text-base border border-white bg-white text-custom-purple-dark px-4 py-1.5 h-auto hover:bg-custom-purple-dark hover:text-white"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
