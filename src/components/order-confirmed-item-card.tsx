// @/components/order-confirmed-item-card.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { OrderItem, SanityProduct } from '@/types';
import { Separator } from './ui/separator';

interface OrderConfirmedItemCardProps {
    item: OrderItem;
    product: SanityProduct;
    isMobile: boolean;
    onClick: () => void;
}

export function OrderConfirmedItemCard({ item, product, isMobile, onClick }: OrderConfirmedItemCardProps) {
  const pricePerItem = (item.finalProductPrice ?? 0) / item.quantity;
  const itemMrp = product.mrp ?? pricePerItem;
  const itemDiscount = (itemMrp * item.quantity) - (item.finalProductPrice ?? 0);

  return (
    <div 
      className={cn("bg-gray-100 w-full flex flex-col text-black rounded-lg p-3 cursor-pointer hover:bg-gray-200 transition-colors")}
      onClick={onClick}
    >
        <div className={cn("flex items-start gap-3", isMobile ? "" : "md:gap-4")}>
            <div className={cn("flex-shrink-0 relative", isMobile ? "w-16 h-16" : "w-20 h-20")}>
                <Image
                    src={item.coverImage || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="rounded-md object-cover"
                />
            </div>
            <div className="flex-grow min-w-0">
                <h4 className={cn("font-bold truncate", isMobile ? "text-sm" : "text-base")}>{item.name}</h4>
                <p className={cn("text-black/70", isMobile ? "text-xs" : "text-sm")}>
                    {`₹${pricePerItem.toFixed(2)} x ${item.quantity}`}
                </p>
                {itemDiscount > 0 && (
                    <p className={cn("text-green-600 font-medium", isMobile ? "text-xs" : "text-sm")}>
                        You saved ₹{itemDiscount.toFixed(2)}
                    </p>
                )}
            </div>
            <div className="text-right flex-shrink-0">
                <p className={cn("font-bold", isMobile ? "text-sm" : "text-base")}>₹{(item.finalProductPrice ?? 0).toFixed(2)}</p>
            </div>
        </div>

        {item.flavours && item.flavours.length > 0 && (
            <>
                <Separator className="bg-black/10 my-2" />
                <div className="pl-2">
                    <p className={cn("font-semibold text-black/80 mb-1", isMobile ? "text-xs" : "text-sm")}>Flavours Selected:</p>
                    <ul className="space-y-0.5">
                        {item.flavours.map(flavour => (
                            <li key={flavour.name} className={cn("flex justify-between text-black/70", isMobile ? "text-xs" : "text-sm")}>
                                <span>{flavour.name}</span>
                                <span>+₹{flavour.price.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )}
    </div>
  );
}
