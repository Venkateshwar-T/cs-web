
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
}

export function OrderConfirmedItemCard({ item, product, isMobile }: OrderConfirmedItemCardProps) {
  const pricePerItem = (item.finalProductPrice ?? 0) / item.quantity;
  const itemMrp = product.mrp ?? pricePerItem;
  const itemDiscount = (itemMrp * item.quantity) - (item.finalProductPrice ?? 0);

  if (isMobile) {
    return (
      <div 
        className={cn("bg-gray-100 w-full flex flex-col text-black rounded-lg p-3 transition-colors")}
      >
        <h4 className={cn("font-bold", "text-sm")}>{item.name}</h4>
        <Separator className="bg-black/10 my-2" />
        <div className={cn("flex items-start gap-3")}>
            <div className={cn("flex-shrink-0 relative", "w-16 h-16")}>
                <Image
                    src={item.coverImage || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="rounded-md object-cover"
                />
            </div>
            <div className="flex-grow min-w-0">
                <p className={cn("text-black/70", "text-xs")}>
                    {`₹${pricePerItem.toFixed(2)} x ${item.quantity}`}
                </p>
                {itemDiscount > 0 && (
                    <p className={cn("text-green-600 font-medium", "text-xs")}>
                        You saved ₹{itemDiscount.toFixed(2)}
                    </p>
                )}
            </div>
            <div className="text-right flex-shrink-0">
                <p className={cn("font-bold", "text-sm")}>₹{(item.finalProductPrice ?? 0).toFixed(2)}</p>
            </div>
        </div>

        {item.flavours && item.flavours.length > 0 && (
            <>
                <Separator className="bg-black/10 my-2" />
                <div className="pl-2">
                    <p className={cn("font-semibold text-black/80 mb-1", "text-xs")}>Flavours Selected:</p>
                    <ul className="space-y-0.5">
                        {item.flavours.map(flavour => (
                            <li key={flavour.name} className={cn("flex justify-between items-center text-black/70", "text-xs")}>
                                <div className="flex items-center gap-2">
                                  <span>{flavour.name}</span>
                                  {product.numberOfChocolates && <span className="text-black/60 text-[10px]">(x{product.numberOfChocolates} pcs)</span>}
                                </div>
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

  return (
    <div 
      className={cn("bg-gray-100 w-full flex flex-col text-black rounded-lg p-3 transition-colors")}
    >
        <div className={cn("flex items-start gap-3", "md:gap-4")}>
            <div className={cn("flex-shrink-0 relative", "w-20 h-20")}>
                <Image
                    src={item.coverImage || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="rounded-md object-cover"
                />
            </div>
            <div className="flex-grow min-w-0">
                <h4 className={cn("font-bold truncate", "text-base")}>{item.name}</h4>
                <p className={cn("text-black/70", "text-sm")}>
                    {`₹${pricePerItem.toFixed(2)} x ${item.quantity}`}
                </p>
                {itemDiscount > 0 && (
                    <p className={cn("text-green-600 font-medium", "text-sm")}>
                        You saved ₹{itemDiscount.toFixed(2)}
                    </p>
                )}
            </div>
            <div className="text-right flex-shrink-0">
                <p className={cn("font-bold", "text-base")}>₹{(item.finalProductPrice ?? 0).toFixed(2)}</p>
            </div>
        </div>

        {item.flavours && item.flavours.length > 0 && (
            <>
                <Separator className="bg-black/10 my-2" />
                <div className="pl-2">
                    <p className={cn("font-semibold text-black/80 mb-1", "text-sm")}>Flavours Selected:</p>
                    <ul className="space-y-0.5">
                        {item.flavours.map(flavour => (
                            <li key={flavour.name} className={cn("flex justify-between items-center text-black/70", "text-sm")}>
                                <div className="flex items-center gap-2">
                                  <span>{flavour.name}</span>
                                  {product.numberOfChocolates && <span className="text-black/60 text-[10px]">(x{product.numberOfChocolates} pcs)</span>}
                                </div>
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
