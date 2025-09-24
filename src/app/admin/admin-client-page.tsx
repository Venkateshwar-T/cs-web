// @/app/admin/admin-client-page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext, type Order } from '@/context/app-context';
import { Loader } from '@/components/loader';
import { EmptyState } from '@/components/empty-state';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AdminOrderItemCard } from '@/components/admin-order-item-card';
import { AdminOrderDetails } from '@/components/admin-order-details';

export default function AdminClientPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { allOrders, isAllOrdersLoaded, isAdmin, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return allOrders;
    }
    return allOrders.filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allOrders, searchTerm]);

  if (!isAllOrdersLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
         <EmptyState
            imageUrl="/icons/profile_drpdwn_btn.png"
            title="Access Denied"
            description="You do not have permission to view this page."
            buttonText="Go to Homepage"
            onButtonClick={() => router.push('/')}
            imageClassName='w-24 h-24'
          />
      </div>
    )
  }

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen", !!selectedOrder && 'opacity-50')}>
        <Header
          onProfileOpenChange={() => {}}
          isContentScrolled={true}
          onReset={() => router.push('/')}
          onNavigate={(view) => router.push(`/${view}`)}
          activeView={'admin'}
        />
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0",
          "pt-24 md:pt-32" 
        )}>
          <div className="px-4 md:px-16 lg:px-32 flex-grow flex flex-col">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by Order ID, Product, or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {filteredOrders.length > 0 ? (
              <div className="flex-grow overflow-y-auto no-scrollbar pb-8 space-y-4">
                {filteredOrders.map(order => (
                  <AdminOrderItemCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                ))}
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <EmptyState
                  imageUrl="/icons/empty.png"
                  title="No Orders Found"
                  description="There are no orders matching your search criteria."
                  showButton={false}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <AdminOrderDetails 
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedOrder(null);
            }
        }}
      />
    </>
  );
}
