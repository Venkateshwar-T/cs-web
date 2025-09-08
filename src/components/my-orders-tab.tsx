// @/components/my-orders-tab.tsx
'use client';

import { OrderItemCard } from './order-item-card';
import { useOrders, type Order } from '@/hooks/use-orders';
import { ListOrdered } from 'lucide-react';
import { EmptyState } from './empty-state';
import { useRouter } from 'next/navigation';

interface MyOrdersTabProps {
  isMobile?: boolean;
}

export function MyOrdersTab({ isMobile = false }: MyOrdersTabProps) {
    const { orders, isLoaded } = useOrders();
    const router = useRouter();

    if (!isLoaded) {
        // You can return a loader here if you want
        return null;
    }
    
    const handleExplore = () => {
      router.push('/');
    }

    if (isMobile) {
        return (
            <div className="flex flex-col h-full text-white">
                 {orders.length > 0 ? (
                    <div className="bg-white/80 rounded-2xl flex flex-col">
                        <div className="overflow-y-auto no-scrollbar space-y-4 p-2">
                           {orders.map((order, index) => (
                             <OrderItemCard 
                                key={order.id} 
                                order={order} 
                                isMobile={true} 
                              />
                           ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4 px-4">
                        <EmptyState
                          imageUrl="/icons/empty.png"
                          title="You Haven't Ordered Yet"
                          description="Looks like you haven't placed an order. Your past orders will appear here."
                          buttonText="Explore Now"
                          onButtonClick={handleExplore}
                        />
                    </div>
                )}
                 {orders.length > 0 && <div className="h-16 flex-shrink-0" />}
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
                   <EmptyState
                      imageUrl="/icons/empty.png"
                      title="You Haven't Ordered Yet"
                      description="Looks like you haven't placed an order. Your past orders will appear here."
                      buttonText="Explore Now"
                      onButtonClick={handleExplore}
                    />
                </div>
             )}
        </div>
    );
}
