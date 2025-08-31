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
    <div className="bg-white w-full flex items-center gap-4 text-black">
        <div className="w-24 h-24 flex-shrink-0 relative">
            <Image
                src="/choco img.png"
                alt={productName}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
            />
        </div>
        <div className="flex-grow flex flex-col justify-center">
            <h4 className="font-bold text-lg">{productName}</h4>
            <p className="text-gray-600 font-medium">x{quantity}</p>
        </div>
        <div className="flex-shrink-0">
            <p className="font-bold text-xl">₹{(price * quantity).toFixed(2)}</p>
        </div>
    </div>
  );
}
