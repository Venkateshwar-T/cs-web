
// @/components/cart-popup-footer.tsx
'use client';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';

interface CartPopupFooterProps {
    cart: Record<string, OrderItem>;
    onFinalizeOrder: () => void;
    allProducts: SanityProduct[];
}


export function CartPopupFooter({ cart, onFinalizeOrder, allProducts }: CartPopupFooterProps) {
    const productsByName = allProducts.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);
    
    const { subtotal, totalOriginalPrice } = Object.entries(cart).reduce((acc, [productName, cartItem]) => {
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
            acc.totalOriginalPrice += mrp * cartItem.quantity;
        }
        return acc;
    }, { subtotal: 0, totalOriginalPrice: 0 });

    const subtotalAfterDiscount = subtotal;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const total = subtotalAfterDiscount + gstAmount;

    return (
        <div className="relative bottom-0 left-0 right-0 md:h-[8%] lg:h-[11%] lg:w-[96%]">
            <div className="bg-custom-purple-dark h-full w-full md:rounded-t-xl lg:rounded-t-2xl xl:rounded-t-3xl flex items-center justify-center">
                <div className="flex items-center justify-center md:gap-2 lg:gap-4 xl:gap-6 text-white w-full">
                    <div className="flex flex-col items-center">
                        <p className="lg:text-sm xl:text-sm opacity-100">
                          <span className={cn(
                            "relative inline-block",
                            totalOriginalPrice > 0 && "after:content-[''] after:absolute after:left-0 after:top-1/2 after:h-[1.5px] after:bg-white after:animate-cut-through after:origin-left"
                          )}>
                              ₹{totalOriginalPrice.toFixed(2)}
                          </span>
                        </p>
                        <p className="lg:text-sm xl:text-m text-custom-gold font-semibold">Total Price</p>
                    </div>

                    <p className="md:text-2xl lg:text-xl xl:text-3xl font-bold">₹{total > 0 ? total.toFixed(2) : '0.00'}</p>
                    
                    <Button
                        onClick={onFinalizeOrder}
                        size="sm"
                        className="rounded-full font-semibold text-sm md:text-sm lg:text-sm xl:text-base border border-white bg-white text-custom-purple-dark md:px-4 xl:px-4 lg:px-6 py-1.5 h-auto hover:bg-custom-purple-dark hover:text-white"
                        disabled={Object.keys(cart).length === 0}
                    >
                        Finalize Order
                    </Button>
                </div>
            </div>
        </div>
    );
}
