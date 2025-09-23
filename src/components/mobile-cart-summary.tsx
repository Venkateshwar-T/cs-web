
// @/components/mobile-cart-summary.tsx
'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { SanityProduct } from '@/types';

interface MobileCartSummaryProps {
  cart: Record<string, { name: string; quantity: number; flavours?: string[] }>;
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

    let subtotal = 0;
    let totalMrp = 0;

    cartItems.forEach(item => {
        const product = productsByName[item.name];
        if (product) {
            const finalProductPrice = (product.discountedPrice || 0) * item.quantity;
            const totalFlavourPrice = (item.flavours || [])
                .reduce((acc, flavourName) => {
                    const flavour = product.availableFlavours?.find(f => f.name === flavourName);
                    return acc + (flavour?.price || 0);
                }, 0) * (product.numberOfChocolates || 1);

            subtotal += finalProductPrice + totalFlavourPrice;
            totalMrp += (product.mrp || product.discountedPrice || 0) * item.quantity;
        }
    });

    const totalDiscount = totalMrp > subtotal ? totalMrp - subtotal : 0;
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;

    return (
      <div ref={ref} className="mt-6 bg-white/80 rounded-2xl p-4 shadow-lg text-black">
          <h3 className="font-bold text-lg text-center text-black mb-4">Order Summary</h3>
          
          <div className="space-y-2">
              <div className="space-y-2">
                  {cartItems.map((item) => {
                    const product = productsByName[item.name];
                    if (!product) return null;
                    
                    const finalProductPrice = (product.discountedPrice || 0) * item.quantity;
                    const totalFlavourPrice = (item.flavours || [])
                        .reduce((acc, flavourName) => {
                            const flavour = product.availableFlavours?.find(f => f.name === flavourName);
                            return acc + (flavour?.price || 0);
                        }, 0) * (product.numberOfChocolates || 1);
                    
                    const itemTotal = finalProductPrice + totalFlavourPrice;

                    return (
                        <div key={item.name} className="flex justify-between items-center text-sm">
                            <span className="font-medium w-2/3 truncate pr-2">{item.name}</span>
                            <span className="text-black/60">x{item.quantity}</span>
                            <span className="font-semibold w-1/4 text-right">₹{itemTotal.toFixed(2)}</span>
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
                  value={`₹${subtotal > 0 ? subtotal.toFixed(2) : '0.00'}`}
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
