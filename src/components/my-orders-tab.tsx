
// @/components/my-orders-tab.tsx
'use client';

import { useState, type UIEvent } from 'react';
import { OrderItemCard } from './order-item-card';
import { EmptyState } from './empty-state';
import { useRouter } from 'next/navigation';
import { SectionTitle } from './section-title';
import { useAppContext } from '@/context/app-context';
import { Loader } from './loader';
import { Button } from './ui/button';
import { OrderDetailsPopup } from './order-details-popup';
import { RatingPopup } from './rating-popup';
import type { Order, SanityProduct, OrderItem } from '@/types';
import { CancellationFeedbackPopup } from './cancellation-feedback-popup';

interface MyOrdersTabProps {
  isMobile?: boolean;
  products: SanityProduct[];
  onProductClick?: (product: SanityProduct, orderItem: OrderItem) => void;
}

export function MyOrdersTab({ isMobile = false, products, onProductClick }: MyOrdersTabProps) {
    const { orders, isOrdersLoaded, clearOrders, reorder, isAuthenticated, loadMoreUserOrders, hasMoreUserOrders } = useAppContext();
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
    const [cancellationOrder, setCancellationOrder] = useState<Order | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    
    const currentOrders = orders.filter(o => o.status === 'Order Requested' || o.status === 'In Progress');
    const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');


    if (!isOrdersLoaded) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        )
    }

    const handleScroll = async (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight + 100 && hasMoreUserOrders && !isFetchingMore) {
          setIsFetchingMore(true);
          await loadMoreUserOrders();
          setIsFetchingMore(false);
      }
    };
    
    const handleExplore = () => {
      router.push('/');
    }
    
    if (!isAuthenticated) {
       return (
            <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4 px-4 pb-24">
                <EmptyState
                  imageUrl="/icons/empty.png"
                  title="Log In to See Your Orders"
                  description="Your past orders will appear here once you log in."
                  buttonText="Log In / Sign Up"
                  onButtonClick={() => router.push('/profile')}
                />
            </div>
       )
    }

    if (isMobile) {
        return (
            <>
                <div className="flex flex-col h-full text-white">
                     {orders.length > 0 ? (
                        <div onScroll={handleScroll} className="bg-transparent rounded-2xl flex flex-col pt-4 overflow-y-auto no-scrollbar">
                            <div>
                                <SectionTitle className="text-lg mb-2 px-2">Current Orders</SectionTitle>
                                {currentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {currentOrders.map((order) => (
                                            <OrderItemCard 
                                                key={order.id} 
                                                order={order} 
                                                isMobile={true} 
                                                onClick={() => setSelectedOrder(order)}
                                                onRate={() => setRatingOrder(order)}
                                                onCancel={() => setCancellationOrder(order)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center gap-2 py-8 px-4 bg-white/5 rounded-2xl">
                                      <h3 className="text-lg font-semibold text-white">No Active Orders</h3>
                                      <p className="text-sm text-white/70 max-w-xs">Your next sweet moment is just a click away!</p>
                                      <Button onClick={handleExplore} className="mt-4 bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90 rounded-full px-6 font-bold">Start Shopping</Button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <SectionTitle className="text-lg mb-2 mt-4 px-2">Completed Orders</SectionTitle>
                                {completedOrders.length > 0 ? (
                                    <div className="space-y-4 mb-4">
                                        {completedOrders.map((order) => (
                                            <OrderItemCard 
                                                key={order.id} 
                                                order={order} 
                                                isMobile={true} 
                                                onClick={() => setSelectedOrder(order)}
                                                onRate={() => setRatingOrder(order)}
                                                onCancel={() => setCancellationOrder(order)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center gap-2 py-8 px-4 mb-4 bg-white/5 rounded-2xl">
                                       <h3 className="text-lg font-semibold text-white">No Past Orders</h3>
                                       <p className="text-sm text-white/70 max-w-xs">Your past orders will appear here once they're delivered or cancelled.</p>
                                    </div>
                                )}
                            </div>
                             {isFetchingMore && (
                              <div className="flex justify-center py-4">
                                <Loader />
                              </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4 px-4 pb-24">
                            <EmptyState
                              imageUrl="/icons/empty.png"
                              title="You Haven't Ordered Yet"
                              description="Your next sweet moment is just a click away!"
                              buttonText="Explore Now"
                              onButtonClick={handleExplore}
                            />
                        </div>
                    )}
                     {orders.length > 0 && <div className="h-16 flex-shrink-0" />}
                </div>
                 <OrderDetailsPopup
                    order={selectedOrder}
                    open={!!selectedOrder}
                    onOpenChange={(isOpen) => { if (!isOpen) setSelectedOrder(null); }}
                    products={products}
                />
                <RatingPopup
                    order={ratingOrder}
                    open={!!ratingOrder}
                    onOpenChange={(isOpen) => { if (!isOpen) setRatingOrder(null); }}
                />
                <CancellationFeedbackPopup
                    order={cancellationOrder}
                    open={!!cancellationOrder}
                    onOpenChange={(isOpen) => { if (!isOpen) setCancellationOrder(null); }}
                />
            </>
        )
    }

    return (
        <>
            <div className="p-8 text-white h-full flex flex-col relative pb-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-normal font-poppins self-start">My Orders</h2>
                </div>
                 {orders.length > 0 ? (
                    <div onScroll={handleScroll} className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8">
                        <div>
                            <SectionTitle className="text-xl mb-4 p-0">Current Orders</SectionTitle>
                            {currentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {currentOrders.map(order => (
                                        <OrderItemCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} onRate={() => setRatingOrder(order)} onCancel={() => setCancellationOrder(order)} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center gap-2 py-8 px-4 bg-white/5 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-white">No Active Orders</h3>
                                    <p className="text-sm text-white/70 max-w-xs">Your next sweet moment is just a click away!</p>
                                    <Button onClick={handleExplore} className="mt-4 bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90 rounded-full px-6 font-bold">Start Shopping</Button>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <SectionTitle className="text-xl mb-4 p-0">Completed Orders</SectionTitle>
                             {completedOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {completedOrders.map(order => (
                                        <OrderItemCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} onRate={() => setRatingOrder(order)} onCancel={() => setCancellationOrder(order)} />
                                    ))}
                                </div>
                             ) : (
                                <div className="flex flex-col items-center justify-center text-center gap-2 py-8 px-4 bg-white/5 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-white">No Past Orders</h3>
                                    <p className="text-sm text-white/70 max-w-xs">Your past orders will appear here once they're delivered or cancelled.</p>
                                </div>
                            )}
                        </div>
                        {isFetchingMore && (
                          <div className="flex justify-center py-4">
                            <Loader />
                          </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4">
                       <EmptyState
                          imageUrl="/icons/empty.png"
                          title="You Haven't Ordered Yet"
                          description="Your next sweet moment is just a click away!"
                          buttonText="Explore Now"
                          onButtonClick={handleExplore}
                        />
                    </div>
                 )}
            </div>
             <OrderDetailsPopup
                order={selectedOrder}
                open={!!selectedOrder}
                onOpenChange={(isOpen) => { if (!isOpen) setSelectedOrder(null); }}
                products={products}
            />
            <RatingPopup
                order={ratingOrder}
                open={!!ratingOrder}
                onOpenChange={(isOpen) => { if (!isOpen) setRatingOrder(null); }}
            />
            <CancellationFeedbackPopup
                order={cancellationOrder}
                open={!!cancellationOrder}
                onOpenChange={(isOpen) => { if (!isOpen) setCancellationOrder(null); }}
            />
        </>
    );
}
