// @/components/order-summary-item.tsx
'use client';

import Image from 'next/image';

interface OrderSummaryItemProps {
    productName: string;
    quantity: number;
    price: number;
}

export function OrderSummaryItem({ productName, quantity, price }: OrderSummaryItemProps) {
  return (
    <div className="bg-white w-full flex items-center justify-between text-black p-1">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 relative">
                <Image
                    src="/choco img.png"
                    alt={productName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                />
            </div>
            <div className="flex flex-col items-start gap-3">
                <h4 className="font-medium text-sm">{productName}</h4>
                <p className="text-gray-600 text-xs font-medium">x{quantity}</p>
            </div>
        </div>
        <div>
            <p className="font-bold text-base">₹{(price * quantity).toFixed(2)}</p>
        </div>
    </div>
  );
}
