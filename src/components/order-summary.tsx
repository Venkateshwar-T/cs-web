// @/components/order-summary.tsx
'use client';

import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
  cart: Record<string, number>;
}

// Mock data for product prices - in a real app this would come from a database or state management
const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
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

const SummaryRow = ({ label, value, isBold = false }: { label: React.ReactNode, value: string, isBold?: boolean }) => (
    <div className={cn("flex justify-between items-center text-sm", isBold && "font-bold")}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

export function OrderSummary({ cart }: OrderSummaryProps) {
  const cartItems = Object.entries(cart);

  if (cartItems.length === 0) {
      return (
          <div className="bg-white/90 text-black rounded-2xl p-6 h-full flex items-center justify-center">
              <p className="text-center text-gray-500">Your order summary will appear here once you add items to your cart.</p>
          </div>
      );
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
    <div className="bg-white/90 text-black rounded-2xl p-4 flex flex-col border border-white/30 max-h-full">
        <h3 className="font-bold text-xl text-center mb-4 flex-shrink-0">Order Summary</h3>
        
        <div className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
            {cartItems.map(([name, quantity]) => (
                <div key={name} className="flex justify-between items-center">
                    <span className="text-sm font-bold w-2/3 truncate pr-2">{name}</span>
                    <span className="text-sm text-gray-600">x{quantity}</span>
                    <span className="text-sm font-semibold w-1/4 text-right">₹{(productPrices[name] || 0).toFixed(2)}</span>
                </div>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed border-gray-300 space-y-2.5 flex-shrink-0">
            <SummaryRow 
                label="Discount Applied"
                value={`-₹${discount.toFixed(2)}`}
            />
             <SummaryRow 
                label="Subtotal"
                value={`₹${subtotalAfterDiscount.toFixed(2)}`}
            />
            <SummaryRow 
                label={<>GST + Taxes <span className="font-normal text-gray-500">(18%)</span></>}
                value={`+₹${gstAmount.toFixed(2)}`}
            />

            <Separator className="my-2 bg-gray-400 h-[1.5px]" />
            
            <SummaryRow 
                label="Total (Amount Payable)"
                value={`₹${total.toFixed(2)}`}
                isBold={true}
            />
        </div>
    </div>
  );
}
