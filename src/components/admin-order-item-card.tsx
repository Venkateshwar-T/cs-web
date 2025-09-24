// @/components/admin-order-item-card.tsx
'use client';

import Image from 'next/image';
import type { Order } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from '@/context/app-context';


interface AdminOrderItemCardProps {
    order: Order;
    onClick: () => void;
}

export function AdminOrderItemCard({ order, onClick }: AdminOrderItemCardProps) {
    const { updateOrderStatus } = useAppContext();
    
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    
    const statusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-600';
            case 'Cancelled': return 'bg-red-600';
            case 'In Progress': return 'bg-blue-500';
            default: return 'bg-yellow-500';
        }
    };
    
    const handleStatusChange = (newStatus: Order['status']) => {
        if (order.id) {
            updateOrderStatus(order.id, newStatus);
        }
    };


    return (
        <div 
            onClick={onClick}
            className={cn(
            "w-full bg-white/10 p-4 text-white relative overflow-hidden rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
        )}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Customer & Order Info */}
                <div className="md:col-span-1">
                    <p className="font-bold text-base truncate">{order.customerName}</p>
                    <p className="text-xs text-white/70">ID: {order.id}</p>
                    <p className="text-xs text-white/70">{formattedDate}</p>
                </div>

                {/* Items Summary */}
                <div className="md:col-span-2">
                     <div className="flex -space-x-4">
                        {order.items.slice(0, 4).map(item => (
                            <div key={item.name} className="relative h-10 w-10">
                                <Image
                                    src={item.coverImage || "/placeholder.png"}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full border-2 border-custom-purple-dark object-cover"
                                    data-ai-hint="chocolate box"
                                />
                                {item.quantity > 1 && (
                                    <span className="absolute -bottom-1 -right-1 text-[10px] bg-custom-gold text-black rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                        {item.quantity}
                                    </span>
                                )}
                            </div>
                        ))}
                        {order.items.length > 4 && (
                             <div className="h-10 w-10 rounded-full bg-custom-purple-dark border-2 border-white/50 flex items-center justify-center">
                                <span className="text-xs font-bold">+{order.items.length - 4}</span>
                             </div>
                        )}
                    </div>
                </div>

                {/* Total & Status */}
                <div className="md:col-span-1 flex md:flex-col justify-between items-center md:items-end gap-2">
                    <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Select onValueChange={handleStatusChange} defaultValue={order.status}>
                          <SelectTrigger className={cn(
                            "w-full md:w-[130px] h-8 text-xs rounded-full border-none focus:ring-0 focus:ring-offset-0",
                             statusVariant(order.status)
                          )}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Order Requested">Order Requested</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
