
// @/app/order-confirmed/order-confirmed-client-page.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { SparkleBackground } from '@/components/sparkle-background';
import { Loader } from '@/components/loader';
import { useAppContext } from '@/context/app-context';
import type { SanityProduct, Order, ActiveView } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { OrderConfirmedSummary } from '@/components/order-confirmed-summary';
import CheckmarkAnimation from '../../../public/animations/Checkmark.json';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { PopupsManager } from '@/components/popups/popups-manager';

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

const TimelineNode = ({ isCompleted, isCurrent, children }: { isCompleted: boolean, isCurrent: boolean, children: React.ReactNode }) => (
  <div className="flex flex-col items-center">
    <div
      className={cn(
        'w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500',
        isCompleted ? 'bg-custom-gold border-custom-gold' : 'bg-transparent border-white/50',
        isCurrent && 'animate-pulse'
      )}
    >
      {isCompleted && <div className="w-2 h-2 md:w-3 md:h-3 bg-custom-purple-dark rounded-full"></div>}
    </div>
    <p className={cn('text-xs md:text-sm mt-2 text-center', isCompleted || isCurrent ? 'text-white font-semibold' : 'text-white/60')}>
      {children}
    </p>
  </div>
);

const TimelineConnector = ({ isCompleted }: { isCompleted: boolean }) => (
  <div className="flex-1 h-0.5 transition-all duration-500" style={{ background: isCompleted ? 'hsl(var(--primary))' : 'hsla(0, 0%, 100%, 0.3)' }} />
);

function OrderConfirmedPageComponent({ allProducts }: { allProducts: SanityProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, cart } = useAppContext();
  const isMobile = useIsMobile();
  
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.replace('/');
      return;
    }

    const timeout = setTimeout(() => {
        const foundOrder = orders.find(o => o.id === orderId);
        if (foundOrder) {
            setConfirmedOrder(foundOrder);
            setIsLoading(false);
        } else {
            console.warn(`Order with ID ${orderId} not found.`);
            const secondTimeout = setTimeout(() => router.replace('/'), 3000);
            return () => clearTimeout(secondTimeout);
        }
    }, 500);

    return () => clearTimeout(timeout);

  }, [searchParams, orders, router]);
  
  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else {
      router.push(`/${view}`);
    }
  };

  const handleHeaderNavigate = (view: 'about' | 'faq' | 'admin') => {
      router.push(`/${view}`);
  }

  const cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  const statusSteps = ['Order Requested', 'In Progress', 'Completed'];
  const currentStatusIndex = confirmedOrder ? statusSteps.indexOf(confirmedOrder.status) : -1;
  const isCancelled = confirmedOrder?.status === 'Cancelled';

  if (isLoading || !confirmedOrder) {
    return (
        <div className="flex flex-col h-screen w-screen bg-background">
            {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
            <main className="flex-grow flex flex-col justify-center items-center">
                <ProcessingView />
            </main>
        </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-white">
        {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
        <Header 
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={true}
          onReset={() => router.push('/')}
          onNavigate={handleHeaderNavigate}
          activeView={'order-confirmed'}
          isUsingAnimatedSearch={false}
        />
        <main className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-8 md:pt-32">
          <motion.div 
            className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 md:gap-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.1 }
              }
            }}
          >
            <motion.div variants={{ hidden: { scale: 0.5, opacity: 0 }, visible: { scale: 1, opacity: 1 } }} className="w-32 h-32 md:w-40 md:h-40">
              <Lottie animationData={CheckmarkAnimation} loop={false} />
            </motion.div>

            <motion.h1 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-4xl md:text-5xl font-bold text-custom-gold font-plex-sans">Thank You!</motion.h1>
            
            <motion.p variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-base md:text-lg text-white/80">Your order request has been received.</motion.p>
            
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="bg-white/10 rounded-full px-4 py-1.5 text-sm">
              Order ID: <span className="font-bold">{confirmedOrder.id}</span>
            </motion.div>

            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="w-full max-w-lg mt-4">
              <div className="flex items-center w-full">
                <TimelineNode isCompleted={currentStatusIndex >= 0} isCurrent={currentStatusIndex === 0}>Order<br/>Requested</TimelineNode>
                <TimelineConnector isCompleted={currentStatusIndex >= 1} />
                <TimelineNode isCompleted={currentStatusIndex >= 1} isCurrent={currentStatusIndex === 1}>In<br/>Progress</TimelineNode>
                <TimelineConnector isCompleted={currentStatusIndex >= 2} />
                <TimelineNode isCompleted={currentStatusIndex >= 2} isCurrent={currentStatusIndex === 2}>Delivered</TimelineNode>
              </div>
               {isCancelled && (
                <p className="text-red-400 font-semibold mt-4 text-sm">This order has been cancelled.</p>
              )}
            </motion.div>

            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-4 md:mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 w-full max-w-lg">
              <p className="font-semibold text-sm md:text-base max-w-md mx-auto text-white/90">
                To finalize your order and process the 50% advance payment, please connect with us.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full justify-center">
                <Button asChild variant="outline" className="h-auto w-full sm:w-auto py-2 px-6 text-sm md:text-base text-white border-white/50 bg-transparent hover:bg-white/10 hover:text-white rounded-full font-plex-sans shadow-lg">
                  <a href="tel:+917411414007">
                    <Phone className="h-4 w-4" /> Call Us
                  </a>
                </Button>
                <Button asChild className="h-auto w-full sm:w-auto py-2 px-6 text-sm md:text-base bg-white hover:bg-gray-200 text-custom-purple-dark rounded-full font-plex-sans shadow-lg font-semibold">
                  <a href="https://wa.me/917411414007" target="_blank" rel="noopener noreferrer">
                    <IoLogoWhatsapp className="h-5 w-5" /> Whatsapp
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="w-full max-w-lg mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="w-full bg-white/10 hover:bg-white/20 text-white hover:no-underline rounded-xl px-4 py-3 font-semibold text-base">
                    View Your Order Summary
                  </AccordionTrigger>
                  <AccordionContent className="mt-2">
                    <OrderConfirmedSummary 
                      order={confirmedOrder}
                      products={allProducts}
                      isMobile={isMobile ?? false}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
            
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-6">
              <Button onClick={handleContinueShopping} className="bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90 rounded-full px-8 font-bold text-base h-11">
                Continue Shopping
              </Button>
            </motion.div>

          </motion.div>
        </main>
        <div className="md:hidden h-16" />
        <Footer />
      </div>
      <BottomNavbar activeView={'order-confirmed'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      <PopupsManager 
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        allProducts={allProducts}
      />
    </>
  );
}

export default function OrderConfirmedClientPage({ allProducts }: { allProducts: SanityProduct[] }) {
    return (
        <Suspense fallback={<ProcessingView />}>
            <OrderConfirmedPageComponent allProducts={allProducts} />
        </Suspense>
    )
}
