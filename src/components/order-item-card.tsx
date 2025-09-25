
// @/components/order-item-card.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import type { Order } from '@/types';

interface OrderItemCardProps {
    order: Order;
    isMobile?: boolean;
    onClick: () => void;
}

export function OrderItemCard({ order, isMobile = false, onClick }: OrderItemCardProps) {
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

    return (
        <button 
            onClick={onClick}
            className="bg-white/90 p-3 md:p-4 text-black w-full relative overflow-hidden rounded-xl md:rounded-2xl shadow-md text-left">
            <div className="flex justify-between items-start mb-3">
                 <div className="flex flex-col">
                    <p className="text-xs text-black/70">{formattedDate} at {formattedTime}</p>
                    <p className="text-base md:text-lg font-bold">₹{order.total.toFixed(2)}</p>
                </div>
                <Badge 
                    variant={statusVariant(order.status)}
                    className={cn(order.status === 'Order Requested' && 'text-custom-purple-dark hover:bg-primary')}
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
    );
}
