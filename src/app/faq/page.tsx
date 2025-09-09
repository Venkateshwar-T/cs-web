
// @/app/faq/page.tsx
'use client';

import * as React from 'react';
import { useState, UIEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { Footer } from '@/components/footer';
import { SectionTitle } from "@/components/section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem as AccordionItemPrimitive,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PopupsManager } from '@/components/popups/popups-manager';
import { BottomNavbar } from '@/components/bottom-navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { cn } from '@/lib/utils';
import type { Product, ProfileInfo } from '@/app/page';
import { useAppContext } from '@/context/app-context';

const allProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Diwali Collection Box ${i + 1}`,
}));

const faqData = [
    {
        question: "How do I place an order for a custom box?",
        answer: "You can place an order directly from our catalog. Simply click on a product, select your preferred flavors and packaging style, and then proceed to finalize your order. Our team will get in touch with you to confirm the details."
    },
    {
        question: "Can I include a personalized message with my order?",
        answer: "Yes, absolutely! We love helping you add a personal touch. When our team contacts you to confirm your order, you can let them know what message you would like to include."
    },
    {
        question: "Do you offer bulk or corporate orders?",
        answer: "Yes, we specialize in creating custom corporate and bulk orders. Please contact our team directly for a personalized quote."
    },
    {
        question: "Are all your chocolates vegetarian and eggless?",
        answer: "Yes! All of our chocolates are proudly 100% vegetarian and completely eggless, made with the finest, high-quality ingredients."
    },
    {
        question: "Do your chocolates contain any allergens?",
        answer: "Our chocolates contain soy and may contain traces of milk solids and nuts. For specific allergen information, please refer to the product page."
    },
    {
        question: "How should I store the chocolates to keep them fresh?",
        answer: "To maintain their quality and flavor, store your chocolates in a cool, dry place, away from direct sunlight. Refrigeration isn't required."
    },
    {
        question: "What is your shipping policy?",
        answer: "Shipping timelines and costs depend on your location and the size of your order. Our team will provide you with an estimated delivery date and shipping cost when they finalize your order."
    },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const AccordionContext = React.createContext<{ value: string; setValue: (value: string) => void; } | null>(null);

const useAccordionContext = () => {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error('useAccordionContext must be used within an AccordionProvider');
    }
    return context;
};

const FaqAccordionItem = ({ item, value }: { item: { question: string; answer: string }, value: string }) => {
    const { value: openValue } = useAccordionContext();
    const isOpen = openValue === value;

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            animate={{ scale: isOpen ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
            className="origin-center"
        >
            <AccordionItemPrimitive value={value} className="bg-black/20 rounded-2xl px-4 md:px-6 border-b-0">
                <AccordionTrigger className="text-left text-base md:text-xl font-bold text-white hover:no-underline data-[state=open]:text-custom-gold hover:text-custom-gold transition-colors duration-300 py-4 md:py-5">
                    {item.question}
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-4 md:pb-5 text-white/80 text-sm md:text-base leading-relaxed">
                    {item.answer}
                </AccordionContent>
            </AccordionItemPrimitive>
        </motion.div>
    );
};

export default function FaqPage() {
    const router = useRouter();
    const { cart, updateCart, likedProducts, toggleLike, clearWishlist } = useAppContext();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isContentScrolled, setIsContentScrolled] = useState(false);
    const isMobile = useIsMobile();
    const [accordionValue, setAccordionValue] = React.useState('');

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;
      setIsContentScrolled(scrollTop > 0);
    };

    const handleNavigation = (view: 'home' | 'cart' | 'profile' | 'about') => {
        if (view === 'home') router.push('/');
        else if (view === 'cart') router.push('/cart');
        else if (view === 'profile') router.push('/profile');
        else if (view === 'about') router.push('/about');
    };

    const handleHeaderNavigate = (view: 'about' | 'faq') => {
        router.push(`/${view}`);
    }

    const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

    return (
        <>
            {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
            <div className={cn(isProfileOpen && "opacity-50")}>
                <div className="flex flex-col h-screen">
                    <Header
                      onProfileOpenChange={setIsProfileOpen}
                      isContentScrolled={isMobile ? true : isContentScrolled}
                      onReset={() => router.push('/')}
                      onNavigate={handleHeaderNavigate}
                      activeView={'faq'}
                      onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
                      searchInput={searchInput}
                      onSearchInputChange={setSearchInput}
                      isSearchingOnAbout={true}
                    />
                    <main onScroll={handleScroll} className={cn(
                      "flex-grow flex flex-col overflow-y-auto no-scrollbar transition-all duration-300",
                      isMobile ? "pt-24" : "pt-36"
                    )}>
                        <div className="bg-[#5D2B79] rounded-[20px] md:rounded-[40px] mt-8 mb-8 mx-4 md:mx-32 animate-fade-in flex flex-col flex-grow" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
                            <div className="bg-white/10 rounded-[20px] md:rounded-[40px] py-8 px-4 md:py-10 md:px-24 flex-grow">
                                <SectionTitle className="text-3xl md:text-4xl text-center mb-8 md:mb-12 font-poppins">
                                    Frequently Asked Questions
                                </SectionTitle>
                                
                                <motion.div
                                  className="max-w-4xl mx-auto"
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <AccordionContext.Provider value={{ value: accordionValue, setValue: setAccordionValue }}>
                                      <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full space-y-4">
                                          {faqData.map((item, index) => (
                                            <FaqAccordionItem key={index} item={item} value={`item-${index}`} />
                                          ))}
                                      </Accordion>
                                  </AccordionContext.Provider>
                                </motion.div>
                            </div>
                        </div>
                        <Footer />
                    </main>
                </div>
            </div>

             <PopupsManager
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                allProducts={allProducts}
                likedProducts={likedProducts}
                onLikeToggle={toggleLike}
                cart={cart}
                onAddToCart={updateCart}
                onClearWishlist={clearWishlist}
            />
            <BottomNavbar activeView={'faq'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
        </>
    );
}
