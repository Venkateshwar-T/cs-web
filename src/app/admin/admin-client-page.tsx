
// @/app/admin/admin-client-page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';
import type { Order, SanityProduct } from '@/types';
import { Loader } from '@/components/loader';
import { EmptyState } from '@/components/empty-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { AdminOrderItemCard } from '@/components/admin-order-item-card';
import { AdminOrderDetails } from '@/components/admin-order-details';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

type StatusFilter = Order['status'] | 'All';

const statusOptions: StatusFilter[] = ['All', 'Order Requested', 'In Progress', 'Completed', 'Cancelled'];

const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-sm font-semibold text-white/70 mb-2 px-4">{title}</h3>
        <div className="flex flex-col">
            {children}
        </div>
    </div>
);


export default function AdminClientPage({ allProducts }: { allProducts: SanityProduct[] }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { allOrders, isAllOrdersLoaded, isAdmin, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = allOrders.filter(order => {
      const statusMatch = statusFilter === 'All' || order.status === statusFilter;
      const searchMatch = !searchTerm || (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return statusMatch && searchMatch;
    });

    // Default sort: newest first
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [allOrders, searchTerm, statusFilter]);

  const handleStatusSelect = (status: StatusFilter) => {
    setStatusFilter(status);
  }

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
            <div className="relative flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by Product or Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                 {isMobile && (
                  <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild>
                       <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:bg-white/20 hover:text-white">
                          <Filter className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-custom-purple-dark text-white border-l-2 border-custom-gold w-3/4 p-0">
                      <SheetHeader className="p-4 border-b border-white/20">
                        <SheetTitle className="text-white text-center">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 py-4 overflow-y-auto">
                        <FilterSection title="Filter by Status">
                            {statusOptions.map(option => (
                              <SheetClose asChild key={option}>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleStatusSelect(option)}
                                    className={cn(
                                    "justify-start text-base py-3 h-auto rounded-none px-4",
                                    statusFilter === option ? "font-bold bg-white/10 text-custom-gold" : "text-white/80 hover:text-white"
                                    )}
                                >
                                    {option === 'All' ? 'All Statuses' : option}
                                </Button>
                              </SheetClose>
                            ))}
                        </FilterSection>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
              {!isMobile && (
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                      <SelectTrigger className="w-full md:w-[200px] h-12 rounded-full bg-white/10 border-white/20 text-white">
                        <div className='flex items-center gap-2'>
                          <Filter className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Filter by status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Order Requested">Order Requested</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {filteredAndSortedOrders.length > 0 ? (
              <div className="flex-grow overflow-y-auto no-scrollbar pb-8 space-y-4">
                {filteredAndSortedOrders.map(order => (
                  <AdminOrderItemCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                ))}
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <EmptyState
                  imageUrl="/icons/empty.png"
                  title="No Orders Found"
                  description="There are no orders matching your search and filter criteria."
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
        allProducts={allProducts}
      />
    </>
  );
}
