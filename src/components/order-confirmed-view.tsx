
// @/components/order-confirmed-view.tsx
'use client';

import { Fragment } from 'react';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { Separator } from './ui/separator';
import { OrderSummaryItem } from './order-summary-item';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Order, OrderItem } from '@/context/app-context';
import type { SanityProduct } from '@/types';

interface OrderConfirmedViewProps {
    order: Order;
    products: SanityProduct[];
    onProductClick: (product: SanityProduct, orderItem: OrderItem) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};


export function OrderConfirmedView({ order, products, onProductClick }: OrderConfirmedViewProps) {
    const isMobile = useIsMobile();
    
    if (!order) {
        return null;
    }
    
    const productsByName = products.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#9A7DAB] rounded-[20px] md:rounded-[40px] py-6 mt-3 md:py-8 px-4 md:px-16 text-white h-auto flex items-center justify-center flex-grow"
    >
        <motion.div 
          className="flex flex-col items-center gap-4 md:gap-5 text-center w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="relative z-10 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-custom-purple-dark border-4 border-custom-gold">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-8 md:h-8">
                    <path d="M4 12L9 17L20 6" stroke="#FFD139" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-tick"/>
                </svg>
              </div>
              <div className="h-7 md:h-10 -ml-4 rounded-r-full bg-custom-gold pl-6 pr-4 md:pl-10 md:pr-6 flex items-center">
                  <span className="text-custom-purple-dark font-bold text-sm md:text-lg">Order Request Received!</span>
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="font-plex-sans font-semibold text-xs text-black">Order ID: {order.id}</motion.p>

            <motion.p variants={itemVariants} className="font-semibold font-plex-sans text-sm md:text-lg max-w-2xl text-black">
                To finalize your order and process the 50% advance payment, please connect with us directly.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <Button asChild className="h-auto py-2 px-10 text-sm md:text-base md:px-12 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full font-plex-sans shadow-lg">
                    <a href="tel:+1234567890">
                        <Phone className="h-4 w-4" /> Call Us
                    </a>
                </Button>
                <Button asChild className="h-auto py-2 px-5 text-sm md:text-base md:px-8 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full font-plex-sans shadow-lg">
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                        <IoLogoWhatsapp className="h-5 w-5" /> Whatsapp Us
                    </a>
                </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white w-full rounded-2xl md:rounded-3xl mt-2 text-black p-4 md:p-6 flex flex-col">
                <div className="flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-sm md:text-xl">Order Summary</h3>
                    <p className="font-bold text-sm md:text-xl">Total: ₹{order.total > 0 ? order.total.toFixed(2) : '0.00'}</p>
                </div>
                <Separator className="bg-gray-200 my-2" />
                <div className={cn(
                  "flex-grow overflow-y-auto min-h-0 pr-2 always-visible-scrollbar",
                  isMobile ? "max-h-full" : "max-h-[25vh]"
                )}>
                    {order.items.map((item, index) => {
                       const product = productsByName[item.name];
                       if (!product) return null;
                       return (
                        <Fragment key={item.name}>
                          <OrderSummaryItem
                              product={product}
                              quantity={item.quantity}
                              isMobile={isMobile}
                              onClick={() => onProductClick(product, item)}
                          />
                          {index < order.items.length - 1 && <Separator className="bg-gray-200 my-2" />}
                        </Fragment>
                    )})}
                </div>
            </motion.div>
        </motion.div>
    </motion.div>
  );
}
