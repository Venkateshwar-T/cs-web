// @/components/mobile-cart-summary.tsx
'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';

interface MobileCartSummaryProps {
  cart: Record<string, OrderItem>;
  allProducts: SanityProduct[];
  onCheckout: () => void;
}

const SummaryRow = ({ label, value, isBold = false }: { label: React.ReactNode, value: string, isBold?: boolean }) => (
    <div className={cn("flex justify-between items-center text-sm", isBold ? "font-bold text-base text-black" : "text-black/80")}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

export const MobileCartSummary = React.forwardRef<HTMLDivElement, MobileCartSummaryProps>(
  ({ cart, allProducts, onCheckout }, ref) => {
    const cartItems = Object.values(cart);
    const productsByName = allProducts.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);


    if (cartItems.length === 0 || allProducts.length === 0) {
        return null;
    }

    const { subtotal, totalDiscount } = Object.entries(cart).reduce((acc, [productName, cartItem]) => {
        const product = productsByName[productName];
        if (product) {
            const price = product.discountedPrice || 0;
            const mrp = product.mrp || price;
            acc.subtotal += price * cartItem.quantity;
            if (mrp > price) {
                acc.totalDiscount += (mrp - price) * cartItem.quantity;
            }
        }
        return acc;
    }, { subtotal: 0, totalDiscount: 0 });

    const subtotalAfterDiscount = subtotal;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const rawTotal = subtotalAfterDiscount + gstAmount;
    const total = rawTotal > 0 ? rawTotal : 0;

    return (
      <div ref={ref} className="mt-6 bg-white/80 rounded-2xl p-4 shadow-lg text-black">
          <h3 className="font-bold text-lg text-center text-black mb-4">Order Summary</h3>
          
          <div className="space-y-2">
              <div className="space-y-2">
                  {cartItems.map((item) => {
                    const product = productsByName[item.name];
                    if (!product) return null;
                    const price = product.discountedPrice || 0;
                    return (
                        <div key={item.name} className="flex justify-between items-center text-sm">
                            <span className="font-medium w-2/3 truncate pr-2">{item.name}</span>
                            <span className="text-black/60">x{item.quantity}</span>
                            <span className="font-semibold w-1/4 text-right">₹{price.toFixed(2)}</span>
                        </div>
                    )
                  })}
              </div>
              
              <div className="border-t border-dashed border-black/20 my-3"></div>

              <SummaryRow 
                  label="Discount Applied"
                  value={`-₹${totalDiscount.toFixed(2)}`}
              />
              <SummaryRow 
                  label="Subtotal"
                  value={`₹${subtotalAfterDiscount > 0 ? subtotalAfterDiscount.toFixed(2) : '0.00'}`}
              />
              <SummaryRow 
                  label={<>GST + Taxes <span className="font-normal text-black/60">(18%)</span></>}
                  value={`+₹${gstAmount > 0 ? gstAmount.toFixed(2) : '0.00'}`}
              />

              <div className="border-t border-black/20 my-2 h-[1.5px]" ></div>
              
              <SummaryRow 
                  label="Total (Amount Payable)"
                  value={`₹${total.toFixed(2)}`}
                  isBold={true}
              />
          </div>
          <Button onClick={onCheckout} className="w-full mt-4 bg-custom-gold text-custom-purple-dark font-bold hover:bg-custom-gold/90 h-10 text-base rounded-full">
              Finalize Order
          </Button>
      </div>
    );
  }
);
MobileCartSummary.displayName = 'MobileCartSummary';
