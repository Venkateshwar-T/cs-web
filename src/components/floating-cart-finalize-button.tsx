
// @/components/floating-cart-finalize-button.tsx
'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Cart } from '@/context/app-context';
import type { SanityProduct } from '@/types';

interface FloatingCartFinalizeButtonProps {
    cart: Cart;
    allProducts: SanityProduct[];
    onCheckout: () => void;
    isVisible: boolean;
}

export function FloatingCartFinalizeButton({ cart, allProducts, onCheckout, isVisible }: FloatingCartFinalizeButtonProps) {
    if (allProducts.length === 0) {
        return null;
    }
    
    const productsByName = allProducts.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);
    
    const subtotal = Object.entries(cart).reduce((acc, [productName, cartItem]) => {
        const product = productsByName[productName];
        const price = product?.discountedPrice || 0;
        return acc + (price * cartItem.quantity);
    }, 0);

    const subtotalAfterDiscount = subtotal; // subtotal is already discounted prices
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const rawTotal = subtotalAfterDiscount + gstAmount;
    const total = rawTotal > 0 ? rawTotal : 0;

    return (
        <div
            className={cn(
                "fixed bottom-16 left-0 right-0 z-10 transition-all duration-300",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}
        >
            <div className="border-t border-white/20 bg-custom-purple-dark/80 p-2 px-4 backdrop-blur-md">
                <div className="flex justify-between items-center">
                    <div className="text-white">
                        <p className="text-xs">Total Payable</p>
                        <p className="text-base font-bold">₹{total.toFixed(2)}</p>
                    </div>
                    <Button onClick={onCheckout} className="bg-custom-gold text-custom-purple-dark font-bold hover:bg-custom-gold/90 h-9 text-base rounded-full px-6">
                        Finalize Order
                    </Button>
                </div>
            </div>
        </div>
    );
};
