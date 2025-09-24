
// @/components/order-confirmed-summary.tsx
'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import type { Order, OrderItem, SanityProduct } from '@/types';
import { Separator } from './ui/separator';
import { OrderConfirmedItemCard } from './order-confirmed-item-card';

interface OrderConfirmedSummaryProps {
    order: Order;
    products: SanityProduct[];
    isMobile: boolean;
    onProductClick: (product: SanityProduct, orderItem: OrderItem) => void;
}

const SummaryRow = ({ label, value, valueClass }: { label: string, value: string, valueClass?: string }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-white/80">{label}</span>
        <span className={cn("font-medium text-white", valueClass)}>{value}</span>
    </div>
);


export function OrderConfirmedSummary({ order, products, isMobile, onProductClick }: OrderConfirmedSummaryProps) {
    const productsByName = products.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);
    
    const subtotal = order.items.reduce((acc, item) => acc + (item.finalSubtotal || 0), 0);
    const gstAmount = order.total - subtotal;
    const discount = order.totalDiscount || 0;
    const totalMrp = subtotal + discount;

    return (
        <div className="bg-white/10 w-full rounded-2xl md:rounded-3xl text-white p-4 md:p-6 flex flex-col">
            <div className="flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-sm md:text-xl">Your Order Summary</h3>
            </div>
            <Separator className="bg-white/20 my-2 md:my-3" />

            {/* Items List */}
            <div className={cn(
              "flex-grow overflow-y-auto min-h-0 pr-2 space-y-2 always-visible-scrollbar",
              isMobile ? "max-h-full" : "max-h-[25vh]"
            )}>
                {order.items.map((item: OrderItem) => {
                   const product = productsByName[item.name];
                   if (!product) return null;
                   return (
                    <OrderConfirmedItemCard
                        key={item.name}
                        item={item}
                        product={product}
                        isMobile={isMobile}
                        onClick={() => onProductClick(product, item)}
                    />
                )})}
            </div>

            <Separator className="bg-white/20 my-2 md:my-3" />
            
            {/* Financial Breakdown */}
            <div className="space-y-1.5 flex-shrink-0">
                <SummaryRow label="Total MRP" value={`₹${totalMrp.toFixed(2)}`} />
                <SummaryRow label="Discount" value={`- ₹${discount.toFixed(2)}`} valueClass="text-green-400" />
                <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                <SummaryRow label={`GST (${order.gstPercentage}%)`} value={`+ ₹${gstAmount.toFixed(2)}`} />
                <Separator className="bg-white/40 my-2" />
                <div className="flex justify-between items-center text-base md:text-lg font-bold">
                    <span>Grand Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
