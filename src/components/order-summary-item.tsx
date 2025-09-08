
// @/components/order-summary-item.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OrderSummaryItemProps {
    productName: string;
    quantity: number;
    price: number;
    isMobile?: boolean;
}

export function OrderSummaryItem({ productName, quantity, price, isMobile = false }: OrderSummaryItemProps) {
  return (
    <div className={cn("bg-white w-full flex items-center justify-between text-black", isMobile ? "p-0" : "p-1")}>
        <div className="flex items-center gap-2 md:gap-3">
            <div className={cn("flex-shrink-0 relative", isMobile ? "w-10 h-10" : "w-12 h-12")}>
                <Image
                    src="/choco img.png"
                    alt={productName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>
            <div className="flex flex-col items-start gap-1 md:gap-3">
                <h4 className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{productName}</h4>
                <p className={cn("font-medium text-gray-600", isMobile ? "text-[10px]" : "text-xs")}>x{quantity}</p>
            </div>
        </div>
        <div>
            <p className={cn("font-bold", isMobile ? "text-sm" : "text-base")}>₹{(price * quantity).toFixed(2)}</p>
        </div>
    </div>
  );
}
