
// @/components/order-item-card.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
import type { Order, OrderItem, SanityProduct } from '@/types';
import { useAppContext } from '@/context/app-context';

interface OrderItemCardProps {
    order: Order;
    products: SanityProduct[];
    isMobile?: boolean;
    onOrderAgain?: () => void;
}

export function OrderItemCard({ order, products, isMobile = false, onOrderAgain }: OrderItemCardProps) {
    const { isAuthenticated } = useAppContext();

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    
    const statusVariant = (status: Order['status']): "success" | "destructive" | "default" => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    };
    
    const productsByName = products.reduce((acc, p) => {
        if (p) acc[p.name] = p;
        return acc;
    }, {} as Record<string, SanityProduct>);


    return (
        <div className="bg-white/90 p-3 md:p-4 text-black w-full relative overflow-hidden rounded-xl md:rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-3">
                <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                <div className="text-right">
                    <p className="text-xs text-black/70">ID: {order.id}</p>
                    <p className="text-xs text-black/70">{formattedDate}</p>
                </div>
            </div>
            
            <Separator className="bg-black/10" />

            <div className="divide-y divide-black/10">
                {order.items.map((item: OrderItem) => {
                    const product = productsByName[item.name];
                    if (!product) return null;
                    return (
                        <div key={item.name} className="flex items-center gap-3 md:gap-4 py-3">
                            <Image
                                src={item.coverImage || "/placeholder.png"}
                                alt={item.name}
                                width={isMobile ? 56 : 72}
                                height={isMobile ? 56 : 72}
                                className="rounded-md flex-shrink-0 object-cover aspect-square"
                                data-ai-hint="chocolate box"
                            />
                            <div className="flex-grow min-w-0">
                                <p className="font-bold truncate text-sm md:text-base">{item.name}</p>
                                <p className="text-xs text-black/60">Qty: {item.quantity}</p>
                                <p className="text-sm md:text-base font-semibold text-custom-purple-dark">₹{item.finalSubtotal?.toFixed(2)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Separator className="bg-black/10" />

            <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-xs text-black/70">Total Paid:</p>
                  <p className="text-base md:text-lg font-bold">₹{order.total.toFixed(2)}</p>
                </div>
                {isAuthenticated && onOrderAgain && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size={isMobile ? 'sm' : 'default'} className="bg-custom-purple-dark text-white rounded-full hover:bg-custom-purple-dark/90 h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm">
                            <RotateCcw className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                            Order Again
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
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
    );
}
