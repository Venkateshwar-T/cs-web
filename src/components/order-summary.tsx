
// @/components/order-summary.tsx
'use client';

import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import type { OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';

interface OrderSummaryProps {
  cart: Record<string, OrderItem>;
  allProducts: SanityProduct[];
}


const SummaryRow = ({ label, value, isBold = false }: { label: React.ReactNode, value: string, isBold?: boolean }) => (
    <div className={cn("flex justify-between items-center text-sm", isBold && "font-bold")}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

export function OrderSummary({ cart, allProducts }: OrderSummaryProps) {
  const cartItems = Object.values(cart);
  const productsByName = allProducts.reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {} as Record<string, SanityProduct>);


  if (cartItems.length === 0) {
      return (
          <div className="bg-white/90 text-black rounded-2xl p-6 h-[95%] flex items-center justify-center border border-custom-purple-dark">
              <p className="text-center text-gray-500">Your order summary will appear here once you add items to your cart.</p>
          </div>
      );
  }

  const { subtotal, totalDiscount } = Object.entries(cart).reduce((acc, [productName, cartItem]) => {
      const product = productsByName[productName];
      if (product) {
          const price = product.discountedPrice || 0;
          const mrp = product.mrp || price;
          let itemTotal = price * cartItem.quantity;
          
          if (cartItem.flavours && product.availableFlavours) {
              const flavourPrices = cartItem.flavours.reduce((flavourAcc, flavourName) => {
                  const flavour = product.availableFlavours.find(f => f.name === flavourName);
                  return flavourAcc + (flavour?.price || 0);
              }, 0);
              itemTotal += flavourPrices * cartItem.quantity;
          }

          acc.subtotal += itemTotal;
          if (mrp > price) {
              acc.totalDiscount += (mrp - price) * cartItem.quantity;
          }
      }
      return acc;
  }, { subtotal: 0, totalDiscount: 0 });

  const subtotalAfterDiscount = subtotal;
  const gstRate = 0.18;
  const gstAmount = subtotalAfterDiscount * gstRate;
  const total = subtotalAfterDiscount + gstAmount;

  return (
    <div className="bg-white/90 text-black rounded-2xl p-4 flex flex-col border border-custom-purple-dark max-h-full">
        <h3 className="font-bold text-xl text-center mb-4 flex-shrink-0">Order Summary</h3>
        
        <div className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
            {cartItems.map((item) => {
                const product = productsByName[item.name];
                if (!product) return null;
                const price = product.discountedPrice || 0;
                
                let itemTotal = price;
                if (item.flavours && product.availableFlavours) {
                    const flavourPrices = item.flavours.reduce((flavourAcc, flavourName) => {
                        const flavour = product.availableFlavours.find(f => f.name === flavourName);
                        return flavourAcc + (flavour?.price || 0);
                    }, 0);
                    itemTotal += flavourPrices;
                }

                return (
                    <div key={item.name} className="flex justify-between items-center">
                        <span className="text-sm font-bold w-2/3 truncate pr-2">{item.name}</span>
                        <span className="text-sm text-gray-600">x{item.quantity}</span>
                        <span className="text-sm font-semibold w-1/4 text-right">₹{(itemTotal * item.quantity).toFixed(2)}</span>
                    </div>
                )
            })}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed border-gray-300 space-y-2.5 flex-shrink-0">
            <SummaryRow 
                label="Discount Applied"
                value={`-₹${totalDiscount.toFixed(2)}`}
            />
             <SummaryRow 
                label="Subtotal"
                value={`₹${subtotalAfterDiscount > 0 ? subtotalAfterDiscount.toFixed(2) : '0.00'}`}
            />
            <SummaryRow 
                label={<>GST + Taxes <span className="font-normal text-gray-500">(18%)</span></>}
                value={`+₹${gstAmount > 0 ? gstAmount.toFixed(2) : '0.00'}`}
            />

            <Separator className="my-2 bg-gray-400 h-[1.5px]" />
            
            <SummaryRow 
                label="Total (Amount Payable)"
                value={`₹${total > 0 ? total.toFixed(2) : '0.00'}`}
                isBold={true}
            />
        </div>
    </div>
  );
}
