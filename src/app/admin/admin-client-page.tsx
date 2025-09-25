
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
import { Search, Filter } from 'lucide-react';
import { AdminOrderItemCard } from '@/components/admin-order-item-card';
import { AdminOrderDetails } from '@/components/admin-order-details';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PopupsManager } from '@/components/popups/popups-manager';


type StatusFilter = Order['status'] | 'All';
type SortOption = 'newest' | 'oldest' | 'rating-high' | 'rating-low';


const statusOptions: StatusFilter[] = ['All', 'Order Requested', 'In Progress', 'Completed', 'Cancelled'];
const sortOptions: { label: string; value: SortOption; section: 'date' | 'rating' }[] = [
  { label: 'Newest First', value: 'newest', section: 'date' },
  { label: 'Oldest First', value: 'oldest', section: 'date' },
  { label: 'High to Low', value: 'rating-high', section: 'rating' },
  { label: 'Low to High', value: 'rating-low', section: 'rating' },
];

const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-sm font-semibold text-white/70 mb-3 px-4">{title}</h3>
        <div className="flex flex-col space-y-2">
            {children}
        </div>
    </div>
);


export default function AdminClientPage({ allProducts }: { allProducts: SanityProduct[] }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { allOrders, isAllOrdersLoaded, isAdmin, cart, updateCart, likedProducts, toggleLike, clearWishlist, clearCart, logout } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProductClick = (product: SanityProduct) => {
    router.push(`/product/${product.slug.current}`);
  };

  const filteredOrders = useMemo(() => {
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

    // Sorting logic
    return filtered.sort((a, b) => {
        switch (sortOption) {
            case 'oldest':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'rating-high':
                return (b.rating ?? -1) - (a.rating ?? -1);
            case 'rating-low':
                return (a.rating ?? -1) - (b.rating ?? -1);
            case 'newest':
            default:
                return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });

  }, [allOrders, searchTerm, statusFilter, sortOption]);

  const handleStatusCheckboxChange = (status: StatusFilter) => {
    setStatusFilter(status);
  };
  
  const handleSortCheckboxChange = (option: SortOption) => {
    setSortOption(option);
  };

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
      <div className={cn("flex flex-col h-screen", (!!selectedOrder || isProfileOpen) && 'opacity-50')}>
        <Header
          onProfileOpenChange={setIsProfileOpen}
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
            <div className="relative w-full mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by Product or Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-12 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                 <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-white hover:bg-white/20 hover:text-white rounded-full">
                          <Filter className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-custom-purple-dark text-white border-l-2 border-custom-gold w-3/4 max-w-sm p-0">
                      <SheetHeader className="p-4 border-b border-white/20">
                        <SheetTitle className="text-white text-center">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 py-4 overflow-y-auto custom-scrollbar">
                        <FilterSection title="Filter by Status">
                            {statusOptions.map(option => (
                                <div key={option} className="flex items-center space-x-2 px-4">
                                  <Checkbox
                                    id={`filter-status-${option}`}
                                    checked={statusFilter === option}
                                    onCheckedChange={() => {
                                      handleStatusCheckboxChange(option);
                                      setIsFilterSheetOpen(false);
                                    }}
                                  />
                                  <Label htmlFor={`filter-status-${option}`} className="text-base w-full">
                                    {option === 'All' ? 'All Statuses' : option}
                                  </Label>
                                </div>
                            ))}
                        </FilterSection>
                        <Separator className="bg-white/20" />
                        <FilterSection title="Sort by Date">
                            {sortOptions.filter(o => o.section === 'date').map(option => (
                              <div key={option.value} className="flex items-center space-x-2 px-4">
                                <Checkbox
                                  id={`sort-${option.value}`}
                                  checked={sortOption === option.value}
                                  onCheckedChange={() => {
                                      handleSortCheckboxChange(option.value)
                                      setIsFilterSheetOpen(false);
                                  }}
                                />
                                <Label htmlFor={`sort-${option.value}`} className="text-base w-full">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                        </FilterSection>
                        <Separator className="bg-white/20" />
                        <FilterSection title="Sort by Rating">
                            {sortOptions.filter(o => o.section === 'rating').map(option => (
                              <div key={option.value} className="flex items-center space-x-2 px-4">
                                <Checkbox
                                  id={`sort-${option.value}`}
                                  checked={sortOption === option.value}
                                  onCheckedChange={() => {
                                    handleSortCheckboxChange(option.value)
                                    setIsFilterSheetOpen(false);
                                  }}
                                />
                                <Label htmlFor={`sort-${option.value}`} className="text-base w-full">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                        </FilterSection>
                      </div>
                    </SheetContent>
                  </Sheet>
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
      <PopupsManager
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        allProducts={allProducts}
        likedProducts={likedProducts}
        onLikeToggle={toggleLike}
        cart={cart}
        onAddToCart={updateCart}
        onClearWishlist={clearWishlist}
        onProductClick={handleProductClick}
        onClearCart={clearCart}
        onLogout={logout}
      />
    </>
  );
}
