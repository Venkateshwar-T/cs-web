
'use client';

import { useState, useEffect, type UIEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import type { ProfileInfo, ActiveView } from '@/app/page';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';
import { OrderConfirmedView } from '@/components/order-confirmed-view';
import { Footer } from '@/components/footer';
import { useOrders } from '@/hooks/use-orders';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { Loader } from '@/components/loader';
import { motion } from 'framer-motion';

// Mock data for product prices - in a real app this would come from a database or state management
const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
  'Diwali Collection Box 2': 1199,
  'Diwali Collection Box 3': 999,
  'Diwali Collection Box 4': 899,
  'Diwali Collection Box 5': 750,
  'Diwali Collection Box 6': 1250,
  'Diwali Collection Box 7': 600,
  'Diwali Collection Box 8': 1500,
  'Diwali Collection Box 9': 850,
  'Diwali Collection Box 10': 950,
  'Diwali Collection Box 11': 1100,
  'Diwali Collection Box 12': 1300,
};


function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CS';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const ProcessingView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
        <Loader className="w-24 h-24 text-custom-gold" />
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2"
        >
          <h1 className="font-base font-poppins text-lg md:text-3xl text-white">Processing your order</h1>
          <p className="text-sm md:text-base text-white/80">Please do not refresh the page</p>
        </motion.div>
    </div>
);


export default function OrderConfirmedPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
  });
  const [searchInput, setSearchInput] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [processedCart, setProcessedCart] = useState<Record<string, number>>({});
  const isMobile = useIsMobile();
  const [isContentScrolled, setIsContentScrolled] = useState(false);
    
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
        setIsLoading(true);
        const newOrderId = generateOrderId();
        setOrderId(newOrderId);
        setProcessedCart(cart);

        const subtotal = Object.entries(cart).reduce((acc, [name, quantity]) => {
            const price = productPrices[name] || 0;
            return acc + (price * quantity);
        }, 0);
        
        const discount = 500.00;
        const subtotalAfterDiscount = subtotal - discount;
        const gstRate = 0.18;
        const gstAmount = subtotalAfterDiscount * gstRate;
        const total = subtotalAfterDiscount + gstAmount;

        addOrder({
            id: newOrderId,
            date: new Date().toISOString(),
            items: Object.entries(cart).map(([name, quantity]) => ({ name, quantity })),
            status: 'Order Requested',
            total: total > 0 ? total : 0,
        });

        const timer = setTimeout(() => {
            setIsLoading(false);
            clearCart();
        }, 3000); // Simulate a 3-second processing time

        return () => clearTimeout(timer);
    } else {
        setIsLoading(false);
    }
  }, [cart, addOrder, clearCart]);
  
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setIsContentScrolled(scrollTop > 0);
  };
  
  const handleSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleNavigation = (view: ActiveView) => {
    if (view === 'cart') router.push('/cart');
    else if (view === 'profile') router.push('/profile');
    else router.push('/');
  };

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...updatedProfile }));
  };
  
  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen", isProfileOpen && 'opacity-50')}>
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={isContentScrolled}
          onReset={() => router.push('/')}
          onNavigate={(view) => router.push(`/${view}`)}
          activeView={'order-confirmed'}
          isUsingAnimatedSearch={!isMobile}
          onSearchSubmit={handleSearchSubmit}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
        />
        <main onScroll={handleScroll} className={cn(
          "flex-grow flex flex-col gap-8 overflow-y-auto no-scrollbar",
          "pt-24 md:pt-32"
        )}>
          {isLoading ? (
            <ProcessingView />
          ) : (
            <>
              <div className={cn("flex-grow flex flex-col", isMobile ? "px-4" : "md:px-32")}>
                <OrderConfirmedView cart={processedCart} orderId={orderId} />
              </div>
              <Footer />
            </>
          )}
        </main>
      </div>
      
      <PopupsManager
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        onProfileUpdate={handleProfileUpdate}
        profileInfo={profileInfo}
      />
      <BottomNavbar activeView={'order-confirmed'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
    </>
  );
}
