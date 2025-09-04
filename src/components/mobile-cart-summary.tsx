// @/components/mobile-cart-summary.tsx
'use client';

import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface MobileCartSummaryProps {
  cart: Record<string, number>;
  onCheckout: () => void;
}

// Mock data for product prices - in a real app this would come from a database or state management
const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
  'Anniversary Special Box': 1199,
  'Diwali Collection Box 3': 750.00,
  // Add other products as needed
};

const SummaryRow = ({ label, value, isBold = false }: { label: React.ReactNode, value: string, isBold?: boolean }) => (
    <div className={cn("flex justify-between items-center text-sm", isBold ? "font-bold text-base text-black" : "text-black/80")}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

export function MobileCartSummary({ cart, onCheckout }: MobileCartSummaryProps) {
  const cartItems = Object.entries(cart);

  if (cartItems.length === 0) {
      return null;
  }

  const subtotal = cartItems.reduce((acc, [name, quantity]) => {
    const price = productPrices[name] || 0;
    return acc + (price * quantity);
  }, 0);

  const discount = 500.00;
  const subtotalAfterDiscount = subtotal - discount;
  const gstRate = 0.18;
  const gstAmount = subtotalAfterDiscount * gstRate;
  const total = subtotalAfterDiscount + gstAmount;

  return (
    <div className="mt-6 bg-white/80 rounded-2xl p-4 shadow-lg text-black">
        <h3 className="font-bold text-lg text-center text-black mb-4">Order Summary</h3>
        
        <div className="space-y-2.5">
            <div className="space-y-2">
                {cartItems.map(([name, quantity]) => (
                    <div key={name} className="flex justify-between items-center text-sm">
                        <span className="font-medium w-2/3 truncate pr-2">{name}</span>
                        <span className="text-black/60">x{quantity}</span>
                        <span className="font-semibold w-1/4 text-right">₹{(productPrices[name] || 0).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            
            <Separator className="my-3 bg-black/20" />

            <SummaryRow 
                label="Discount Applied"
                value={`-₹${discount.toFixed(2)}`}
            />
             <SummaryRow 
                label="Subtotal"
                value={`₹${subtotalAfterDiscount.toFixed(2)}`}
            />
            <SummaryRow 
                label={<>GST + Taxes <span className="font-normal text-black/60">(18%)</span></>}
                value={`+₹${gstAmount.toFixed(2)}`}
            />

            <Separator className="my-2 bg-black/20 h-[1.5px]" />
            
            <SummaryRow 
                label="Total (Amount Payable)"
                value={`₹${total.toFixed(2)}`}
                isBold={true}
            />
        </div>
        <Button onClick={onCheckout} className="w-full mt-4 bg-custom-gold text-custom-purple-dark font-bold hover:bg-custom-gold/90 h-12 text-base rounded-full">
            Proceed to Checkout
        </Button>
    </div>
  );
}
