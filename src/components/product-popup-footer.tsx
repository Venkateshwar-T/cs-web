// @/components/product-popup-footer.tsx
'use client';

import { Button } from './ui/button';

export function ProductPopupFooter() {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-24">
            <div className="bg-custom-purple-dark h-full w-full rounded-t-3xl flex items-center justify-center px-6">
                <div className="flex items-center justify-center gap-4 text-white w-full">
                    {/* Prices */}
                    <div className="flex flex-col items-center">
                        <p className="text-sm line-through opacity-70">₹1000</p>
                        <p className="text-xs text-custom-gold font-semibold">25% OFF</p>
                    </div>

                    <p className="text-3xl font-bold">₹750</p>

                    {/* Buttons */}
                    <Button
                        size="sm"
                        className="rounded-full font-semibold text-sm lg:text-base border border-custom-purple-dark bg-white text-custom-purple-dark px-4 py-1.5 h-auto hover:bg-white/90"
                    >
                        Add to Cart
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full font-semibold text-sm lg:text-base border border-white bg-transparent text-white px-4 py-1.5 h-auto hover:bg-white hover:text-custom-purple-dark"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
