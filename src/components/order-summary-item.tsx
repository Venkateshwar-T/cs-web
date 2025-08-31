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
    <div className="bg-white w-full flex items-center justify-between text-black p-2">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0 relative">
                <Image
                    src="/choco img.png"
                    alt={productName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>
            <div className="flex flex-col">
                <h4 className="font-bold text-base">{productName}</h4>
                <p className="text-gray-600 text-sm font-medium">x{quantity}</p>
            </div>
        </div>
        <div>
            <p className="font-bold text-lg">₹{(price * quantity).toFixed(2)}</p>
        </div>
    </div>
  );
}
