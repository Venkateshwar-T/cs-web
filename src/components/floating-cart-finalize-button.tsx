// @/components/floating-cart-finalize-button.tsx
'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';

interface FloatingCartFinalizeButtonProps {
    cart: Record<string, OrderItem>;
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
    
    const subtotal = Object.values(cart).reduce((acc, item) => {
        const product = productsByName[item.name];
        const price = product?.discountedPrice || 0;
        return acc + (price * item.quantity);
    }, 0);

    const discount = 500.00; // Mock discount
    const subtotalAfterDiscount = subtotal - discount;
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
