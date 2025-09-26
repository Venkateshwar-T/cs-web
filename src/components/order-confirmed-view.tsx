
// @/components/order-confirmed-view.tsx
'use client';

import { Fragment } from 'react';
import { Button } from './ui/button';
import { Phone, CheckCircle } from 'lucide-react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { OrderConfirmedSummary } from './order-confirmed-summary';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Order, OrderItem, SanityProduct } from '@/types';

interface OrderConfirmedViewProps {
    order: Order;
    products: SanityProduct[];
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


export function OrderConfirmedView({ order, products }: OrderConfirmedViewProps) {
    const isMobile = useIsMobile();
    
    if (!order) {
        return null;
    }
    
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
            <motion.div 
                variants={itemVariants} 
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 w-full max-w-lg text-black"
            >
                <div className="flex flex-col items-center gap-3">
                    <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-400" />
                    <h1 className="font-bold text-xl md:text-2xl font-plex-sans text-white">Order Request Received!</h1>
                    <p className="text-sm text-white/80">Your Order ID is: <span className="font-bold text-white">{order.id}</span></p>
                    <div className="w-24 h-px bg-white/20 my-2"></div>
                    <p className="font-semibold text-sm md:text-base max-w-md text-white/90">
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
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full mt-2">
                <OrderConfirmedSummary 
                    order={order}
                    products={products}
                    isMobile={isMobile ?? false}
                />
            </motion.div>
        </motion.div>
    </motion.div>
  );
}
