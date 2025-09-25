
// @/components/my-orders-tab.tsx
'use client';

import { useState } from 'react';
import { OrderItemCard } from './order-item-card';
import { EmptyState } from './empty-state';
import { useRouter } from 'next/navigation';
import { SectionTitle } from './section-title';
import { Separator } from './ui/separator';
import { useAppContext, type Order, type SanityProduct } from '@/context/app-context';
import { Loader } from './loader';
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
import { OrderDetailsPopup } from './order-details-popup';
import { RatingPopup } from './rating-popup';

interface MyOrdersTabProps {
  isMobile?: boolean;
  products: SanityProduct[];
}

export function MyOrdersTab({ isMobile = false, products }: MyOrdersTabProps) {
    const { orders, isOrdersLoaded, clearOrders, reorder, isAuthenticated } = useAppContext();
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [ratingOrder, setRatingOrder] = useState<Order | null>(null);

    if (!isOrdersLoaded) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        )
    }
    
    const handleExplore = () => {
      router.push('/');
    }
    
    const latestOrder = orders.length > 0 ? orders[0] : null;
    const pastOrders = orders.length > 1 ? orders.slice(1) : [];
    
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
                        <div className="bg-transparent rounded-2xl flex flex-col">
                            <div className="flex justify-between items-center px-2 pt-4">
                               <SectionTitle className="text-base text-white pb-2 pl-0 mb-0">Latest Order</SectionTitle>
                               <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="bg-red-500 text-white rounded-full hover:bg-red-600/90 text-xs h-8 px-3 disabled:opacity-50"
                                      disabled={orders.length === 0}
                                    >
                                      Clear History
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently remove all items from your order history.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={clearOrders}>Confirm</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div className="overflow-y-auto no-scrollbar py-4 space-y-4">
                              {latestOrder && (
                                <OrderItemCard 
                                    key={latestOrder.id} 
                                    order={latestOrder} 
                                    isMobile={true} 
                                    onClick={() => setSelectedOrder(latestOrder)}
                                    onRate={() => setRatingOrder(latestOrder)}
                                />
                              )}
                                
                                {pastOrders.length > 0 && (
                                  <>
                                    <Separator className="my-4 bg-white/20" />
                                    <SectionTitle className="text-base text-white pb-2 pl-2 mb-0">Past Orders</SectionTitle>
                                    <div className="space-y-4">
                                      {pastOrders.map((order) => (
                                        <OrderItemCard 
                                          key={order.id} 
                                          order={order} 
                                          isMobile={true} 
                                          onClick={() => setSelectedOrder(order)}
                                          onRate={() => setRatingOrder(order)}
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4 px-4 pb-24">
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
            </>
        )
    }

    return (
        <>
            <div className="p-8 text-white h-full flex flex-col relative pb-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-normal font-poppins self-start">My Orders</h2>
                  {orders.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-500 text-white rounded-full hover:bg-red-500/90 text-sm h-9 px-4 disabled:opacity-50"
                          disabled={orders.length === 0}
                        >
                          Clear History
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove all items from your order history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearOrders}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                 {orders.length > 0 ? (
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {latestOrder && (
                          <>
                            <SectionTitle className="text-xl text-white/90 pl-3 mb-2">Latest Order</SectionTitle>
                            <OrderItemCard key={latestOrder.id} order={latestOrder} onClick={() => setSelectedOrder(latestOrder)} onRate={() => setRatingOrder(latestOrder)} />
                          </>
                        )}

                        {pastOrders.length > 0 && (
                          <>
                            <Separator className="my-4 bg-white/20" />
                            <SectionTitle className="text-xl text-white/90 pl-3 mb-2">Past Orders</SectionTitle>
                            <div className="space-y-4">
                              {pastOrders.map(order => (
                                  <OrderItemCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} onRate={() => setRatingOrder(order)} />
                              ))}
                            </div>
                          </>
                        )}
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center h-full text-center gap-4">
                       <EmptyState
                          imageUrl="/icons/empty.png"
                          title="You Haven't Ordered Yet"
                          description="Looks like you haven't placed an order. Your past orders will appear here."
                          buttonText="Explore Now"
                          onButtonClick={handleExplore}
                          showButton={false}
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
        </>
    );
}
