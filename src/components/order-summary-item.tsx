
// @/components/order-summary-item.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { SanityProduct } from '@/types';

interface OrderSummaryItemProps {
    product: SanityProduct;
    quantity: number;
    isMobile?: boolean;
    onClick?: () => void;
}

export function OrderSummaryItem({ product, quantity, isMobile = false, onClick }: OrderSummaryItemProps) {
  const price = product?.discountedPrice || 0;
  return (
    <div 
      className={cn("bg-transparent w-full flex items-center justify-between text-black", onClick && "cursor-pointer", isMobile ? "p-0" : "p-1")}
      onClick={onClick}
    >
        <div className="flex items-center gap-2 md:gap-3">
            <div className={cn("flex-shrink-0 relative", isMobile ? "w-10 h-10" : "w-12 h-12")}>
                <Image
                    src={product.images?.[0] || "/choco img.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 10vw, 5vw"
                    className="rounded-md object-cover"
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>
            <div className="flex flex-col items-start gap-1 md:gap-3">
                <h4 className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{product.name}</h4>
                <p className={cn("font-medium text-gray-600", isMobile ? "text-[10px]" : "text-xs")}>x{quantity}</p>
            </div>
        </div>
        <div>
            <p className={cn("font-bold", isMobile ? "text-sm" : "text-base")}>₹{(price * quantity).toFixed(2)}</p>
        </div>
    </div>
  );
}
