
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

interface OrderItemCardProps {
    order: Order;
    isMobile?: boolean;
    onClick: () => void;
    onRate: () => void;
}

export function OrderItemCard({ order, isMobile = false, onClick, onRate }: OrderItemCardProps) {
    const { updateOrderStatus } = useAppContext();
    const { toast } = useToast();

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

    const handleCancelOrder = () => {
      if (order.uid && order.id) {
        updateOrderStatus(order.uid, order.id, 'Cancelled', 'user');
      }
    };

    return (
        <div 
            className="bg-white/90 p-3 md:p-4 text-black w-full relative overflow-hidden rounded-xl md:rounded-2xl shadow-md text-left flex flex-col gap-3">
            <button 
                onClick={onClick}
                className="w-full text-left"
            >
                <div className="flex justify-between items-start mb-3">
                     <div className="flex flex-col">
                        <p className="text-xs text-black/70">{formattedDate} at {formattedTime}</p>
                        <p className="text-base md:text-lg font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                    <Badge 
                        variant={statusVariant(order.status)}
                        className={cn(
                            order.status === 'Order Requested' && 'text-custom-purple-dark'
                        )}
                    >
                        {order.status}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                    {order.items.map((item, index) => (
                        <div key={index} className="relative flex-shrink-0">
                             <div className="relative w-14 h-14 md:w-16 md:h-16">
                                 <Image
                                    src={item.coverImage || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 768px) 15vw, 5vw"
                                    className="rounded-full object-cover border-2 border-white"
                                    data-ai-hint="chocolate box"
                                />
                                 <div className="absolute -bottom-1 -right-1 bg-custom-purple-dark text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {item.quantity}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </button>
            
            <div className="border-t border-black/10 -mx-3 md:-mx-4"></div>

            <div className="flex items-center justify-end gap-2 pt-1">
                {(order.status === 'Order Requested' || order.status === 'In Progress') && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="text-xs h-7 rounded-full">Cancel Order</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelOrder}>Yes, Cancel</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {order.status === 'Completed' && (
                    <Button onClick={onRate} size="sm" className="text-xs h-7 rounded-full bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90">Rate Your Order</Button>
                )}
            </div>
        </div>
    );
}
