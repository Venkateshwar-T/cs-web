
// @/components/floating-cart-finalize-button.tsx
'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FloatingCartFinalizeButtonProps {
    cart: Record<string, number>;
    onCheckout: () => void;
    isVisible: boolean;
}

// Mock data for product prices - in a real app this would come from a database or state management
const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
  'Anniversary Special Box': 1199,
  'Diwali Collection Box 2': 1199,
  'Diwali Collection Box 3': 999,
  'Diwali Collection Box 4': 899,
  'Diwali Collection Box 5': 750,
  'Diwali Collection Box 6': 1250,
  'Diwali Collection Box 7': 600,
  'Diwali Collection Box 8': 1500,
  'Diwali Collection Box 9': 850,
  'Diwali Collection Box 10': 950,
  'Diwali Collection Box 11': 1100,
  'Diwali Collection Box 12': 1300,
};

export function FloatingCartFinalizeButton({ cart, onCheckout, isVisible }: FloatingCartFinalizeButtonProps) {
    const subtotal = Object.entries(cart).reduce((acc, [name, quantity]) => {
        const price = productPrices[name] || 0;
        return acc + (price * quantity);
    }, 0);

    const discount = 500.00; // Mock discount
    const subtotalAfterDiscount = subtotal - discount;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const total = subtotalAfterDiscount + gstAmount;

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
                        <p className="text-sm">Total Payable:</p>
                        <p className="text-lg font-bold">₹{total > 0 ? total.toFixed(2) : '0.00'}</p>
                    </div>
                    <Button onClick={onCheckout} className="bg-custom-gold text-custom-purple-dark font-bold hover:bg-custom-gold/90 h-10 text-base rounded-full px-6">
                        Finalize Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

    