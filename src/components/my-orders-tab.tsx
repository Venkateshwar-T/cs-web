// @/components/my-orders-tab.tsx
'use client';

import { OrderItemCard } from './order-item-card';
import { useOrders, type Order } from '@/hooks/use-orders';
import { ListOrdered } from 'lucide-react';

interface MyOrdersTabProps {
  isMobile?: boolean;
}

export function MyOrdersTab({ isMobile = false }: MyOrdersTabProps) {
    const { orders, isLoaded } = useOrders();

    if (!isLoaded) {
        // You can return a loader here if you want
        return null;
    }

    if (isMobile) {
        return (
            <div className="flex flex-col h-full text-white">
                 {orders.length > 0 ? (
                    <div className="bg-white/80 rounded-2xl flex flex-col">
                        <div className="overflow-y-auto no-scrollbar">
                           {orders.map((order, index) => (
                             <OrderItemCard 
                                key={order.id} 
                                order={order} 
                                isMobile={true} 
                                isLastItem={index === orders.length - 1} 
                              />
                           ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4 px-4">
                        <ListOrdered className="h-24 w-24 text-white/30" strokeWidth={1} />
                        <h2 className="text-2xl font-bold text-white">No Orders Yet</h2>
                        <p className="text-white/70 max-w-xs">
                            You haven't placed any orders yet. Your past orders will appear here.
                        </p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="p-8 text-white h-full flex flex-col relative">
            <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Orders</h2>
             {orders.length > 0 ? (
                <div className="flex-grow overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                    {orders.map(order => (
                        <OrderItemCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4">
                    <ListOrdered className="h-24 w-24 text-white/30" strokeWidth={1} />
                    <h2 className="text-2xl font-bold text-white">No Orders Yet</h2>
                    <p className="text-white/70 max-w-xs">
                        You haven't placed any orders yet. Your past orders will appear here.
                    </p>
                </div>
             )}
        </div>
    );
}
