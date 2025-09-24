
// @/components/admin-order-item-card.tsx
'use client';

import Image from 'next/image';
import type { Order } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface AdminOrderItemCardProps {
    order: Order;
}

export function AdminOrderItemCard({ order }: AdminOrderItemCardProps) {
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
    
    const statusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    };

    return (
        <div className={cn(
            "w-full bg-white/10 p-4 text-white relative overflow-hidden rounded-2xl border border-white/20"
        )}>
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <div>
                    <p className="text-sm text-white/80">Order ID: <span className="font-semibold text-white">{order.id}</span></p>
                    <p className="text-xs text-white/70">{formattedDate} at {formattedTime}</p>
                </div>
                <Badge variant={statusVariant(order.status)} className="text-sm bg-custom-gold">{order.status}</Badge>
            </div>

            {/* Customer Details */}
            <Separator className="bg-white/20 my-3" />
            <div>
                <h4 className="text-base font-bold mb-2">Customer Details</h4>
                <p className="text-sm text-white/80">Name: <span className="font-semibold text-white">{order.customerName}</span></p>
                <p className="text-sm text-white/80">Email: <span className="font-semibold text-white">{order.customerEmail}</span></p>
                <p className="text-sm text-white/80">Phone: <span className="font-semibold text-white">{order.customerPhone}</span></p>
            </div>
            <Separator className="bg-white/20 my-3" />
             <div className="space-y-3">
                {order.items.map(item => (
                    <div key={item.name} className="flex items-center gap-4">
                        <Image
                            src={item.coverImage || "/placeholder.png"}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="rounded-md flex-shrink-0"
                            data-ai-hint="chocolate box"
                        />
                        <div className="flex-grow">
                            <p className="font-semibold truncate">{item.name}</p>
                            <p className="text-sm text-white/70">Quantity: {item.quantity}</p>
                             {item.flavours && item.flavours.length > 0 && (
                                <p className="text-xs text-white/60">Flavours: {item.flavours.map(f => f.name).join(', ')}</p>
                            )}
                        </div>
                        <div className='text-right'>
                            <p className="text-sm font-semibold">₹{item.finalSubtotal?.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
             </div>
             <Separator className="bg-white/20 my-3" />
             <div className="flex justify-between items-center flex-wrap gap-2 text-sm">
                <p>Items: <span className="font-bold">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
                <p>Discount: <span className="font-bold text-green-400">-₹{order.totalDiscount?.toFixed(2) ?? '0.00'}</span></p>
                <p>GST: <span className="font-bold">+₹{(order.total - (order.total / (1 + (order.gstPercentage ?? 18) / 100))).toFixed(2)}</span></p>
                <p className="text-base">Total: <span className="font-bold text-lg text-custom-gold">₹{order.total.toFixed(2)}</span></p>
             </div>
        </div>
    )
}
