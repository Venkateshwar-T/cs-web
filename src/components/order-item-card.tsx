
// @/components/order-item-card.tsx
'use client';

import Image from 'next/image';
import type { Order } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { SanityProduct } from '@/types';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RotateCcw } from 'lucide-react';

interface OrderItemCardProps {
    order: Order;
    isMobile?: boolean;
    products: SanityProduct[];
    onProductClick: (product: SanityProduct) => void;
    onOrderAgain?: () => void;
}

export function OrderItemCard({ order, isMobile = false, products, onProductClick, onOrderAgain }: OrderItemCardProps) {
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = orderDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    
    const productsByName = products.reduce((acc, product) => {
        if(product) {
            acc[product.name] = product;
        }
        return acc;
    }, {} as Record<string, SanityProduct>);
    
    const statusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    };

    if (isMobile) {
        return (
            <div className={cn(
                "w-full bg-white p-3 text-black relative overflow-hidden rounded-2xl"
            )}>
                 <div className="flex justify-between items-center mb-2">
                    <div>
                        <p className="text-xs text-black/70">Order ID: {order.id}</p>
                        <p className="text-xs text-black/70">{formattedDate}</p>
                        <p className="text-xs text-black/70">{formattedTime}</p>
                    </div>
                     <Badge variant={statusVariant(order.status)} className="text-xs bg-custom-gold">{order.status}</Badge>
                 </div>
                 <Separator className="bg-black/10 my-2" />
                 <div className="space-y-2">
                    {order.items.map(item => {
                        const product = productsByName[item.name];
                        if (!product) return null;
                         return (
                            <div key={item.name} className="flex items-center gap-3 cursor-pointer" onClick={() => onProductClick(product)}>
                                <Image
                                    src={product.images?.[0] || "/choco img.png"}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="rounded-md flex-shrink-0"
                                    data-ai-hint="chocolate box"
                                />
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold truncate">{item.name}</p>
                                    <p className="text-xs text-black/60">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                         )
                    })}
                 </div>
                 <Separator className="bg-black/10 my-2" />
                 <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xs font-medium">Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        <p className="text-base font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                    {onOrderAgain && (
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" className="bg-custom-purple-dark text-white rounded-full hover:bg-custom-purple-dark/90 h-8 px-4 text-xs">
                                <RotateCcw className="mr-2 h-3 w-3" />
                                Order Again
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Order Again?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will add all items from this order to your current cart.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={onOrderAgain}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    )}
                 </div>
            </div>
        )
    }

    return (
        <div className="bg-white/90 p-4 text-black w-full relative overflow-hidden rounded-2xl">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm text-black/70">Order ID: <span className="font-semibold">{order.id}</span></p>
                    <p className="text-sm text-black/70">Date: <span className="font-semibold">{formattedDate} at {formattedTime}</span></p>
                </div>
                <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
            </div>
            
            <Separator className="my-2 bg-black/20" />
            
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {order.items.map(item => {
                     const product = productsByName[item.name];
                     if (!product) return null;
                     return (
                        <div key={item.name} className="flex items-center gap-4 cursor-pointer" onClick={() => onProductClick(product)}>
                            <Image
                                src={product.images?.[0] || "/choco img.png"}
                                alt={item.name}
                                width={56}
                                height={56}
                                className="rounded-md flex-shrink-0"
                                data-ai-hint="chocolate box"
                            />
                            <div className="flex-grow">
                                <p className="font-bold truncate">{item.name}</p>
                                <p className="text-sm text-black/60">Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Separator className="my-2 bg-black/20" />

            <div className="flex justify-between items-center mt-2">
                <p className="font-semibold">Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="text-xl font-bold">Total: ₹{order.total.toFixed(2)}</p>
            </div>
        </div>
    );
}
