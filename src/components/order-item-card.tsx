// @/components/order-item-card.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import type { Order } from '@/types';
import { Button } from './ui/button';
import { useAppContext } from '@/context/app-context';
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
import { useToast } from '@/hooks/use-toast';
import { RotateCcw } from 'lucide-react';
import { Separator } from './ui/separator';

interface OrderItemCardProps {
    order: Order;
    isMobile?: boolean;
    onClick: () => void;
    onRate: () => void;
    onCancel: () => void;
}

export function OrderItemCard({ order: initialOrder, isMobile = false, onClick, onRate, onCancel }: OrderItemCardProps) {
    const { updateOrderStatus, reorder, orders } = useAppContext();
    const { toast } = useToast();

    const order = orders.find(o => o.id === initialOrder.id) || initialOrder;

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
     const formattedTime = orderDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const statusVariant = (status: Order['status']): "success" | "destructive" | "default" | "info" => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Cancelled': return 'destructive';
            case 'In Progress': return 'info';
            default: return 'default';
        }
    };

    const handleCancelOrder = async () => {
      if (order.uid && order.id) {
        await updateOrderStatus(order.uid, order.id, 'Cancelled', 'user');
        onCancel(); 
      }
    };

    const handleReorder = (e: React.MouseEvent) => {
        e.stopPropagation();
        reorder(order.id);
    };

    return (
        <div 
            onClick={onClick}
            className="bg-white/90 p-3 md:p-4 text-black w-full relative overflow-hidden rounded-xl md:rounded-2xl shadow-md text-left flex flex-col gap-2 cursor-pointer"
        >
            <div className="flex flex-col">
                <div className="flex items-center overflow-x-auto no-scrollbar pb-2">
                    {order.items.map((item, index) => (
                        <div key={index} className="relative flex-shrink-0">
                             <div className="relative w-14 h-14 md:w-16 md:h-16">
                                 <Image
                                    src={item.coverImage || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 768px) 15vw, 5vw"
                                    className="rounded-xl object-cover border-2 border-white"
                                    data-ai-hint="chocolate box"
                                />
                                 <div className="absolute -bottom-1 -right-1 bg-custom-purple-dark text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {item.quantity}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="self-start">
                    <Badge 
                        variant={statusVariant(order.status)}
                        className={cn(
                            "text-xs font-plex-sans",
                            order.status === 'Order Requested' && 'text-custom-purple-dark hover:bg-primary'
                        )}
                    >
                        {order.status}
                    </Badge>
                </div>
                
                <div className="flex justify-between items-center w-full mt-1">
                    <p className="text-xs text-black/70">{formattedDate} at {formattedTime}</p>
                    <p className="text-base md:text-lg font-bold">₹{order.total.toFixed(2)}</p>
                </div>
            </div>
            
            <Separator className="bg-custom-purple-dark/20" />

            <div className="flex items-center justify-between">
                <Button onClick={handleReorder} variant="link" className="p-0 h-auto text-custom-purple-dark font-poppins text-xs md:text-sm hover:no-underline">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Order Again
                </Button>
                
                {(order.status === 'Cancelled' || <Separator orientation="vertical" className="h-4 bg-custom-purple-dark/20" />)}

                {(order.status === 'Order Requested' || order.status === 'In Progress') && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="link" className="p-0 h-auto text-red-600 font-poppins text-xs md:text-sm hover:no-underline" onClick={(e) => e.stopPropagation()}>Cancel Order</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>No, Keep It</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelOrder}>Yes, Cancel</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {order.status === 'Completed' && (
                    <>
                        {order.rating ? (
                            <p className="text-xs text-custom-purple-dark font-semibold italic">Thanks for rating!</p>
                        ) : (
                            <Button onClick={(e) => { e.stopPropagation(); onRate(); }} variant="link" className="p-0 h-auto text-custom-purple-dark font-semibold text-xs md:text-sm hover:no-underline">Rate Order</Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
