// @/components/faq-view.tsx
'use client';

import * as React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { SectionTitle } from "./section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem as AccordionItemPrimitive,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';


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
    const controls = useAnimation();

    React.useEffect(() => {
        if (isOpen) {
            controls.start({ scale: 1.02 });
        } else {
            controls.start({ scale: 1 });
        }
    }, [isOpen, controls]);

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            animate={controls}
            transition={{ duration: 0.2 }}
            className="origin-center"
        >
            <AccordionItemPrimitive value={value} className="bg-black/20 rounded-2xl px-6 border-b-0">
                <AccordionTrigger className="text-left text-xl font-bold text-white hover:no-underline data-[state=open]:text-custom-gold hover:text-custom-gold transition-colors duration-300 py-5">
                    {item.question}
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-5 text-white/80 text-base leading-relaxed">
                    {item.answer}
                </AccordionContent>
            </AccordionItemPrimitive>
        </motion.div>
    );
};

export function FaqView() {
  const [value, setValue] = React.useState('');

  return (
    <div className="bg-[#5D2B79] rounded-[40px] mx-8 md:mx-32 animate-fade-in h-[85vh] flex flex-col" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="bg-white/10 rounded-[40px] py-10 px-12 md:px-24 flex-grow overflow-y-auto no-scrollbar">
            <SectionTitle className="text-4xl text-center mb-12 font-poppins">
                Frequently Asked Questions
            </SectionTitle>
            
            <motion.div
              className="max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AccordionContext.Provider value={{ value, setValue }}>
                  <Accordion type="single" collapsible value={value} onValueChange={setValue} className="w-full space-y-4">
                      {faqData.map((item, index) => (
                        <FaqAccordionItem key={index} item={item} value={`item-${index}`} />
                      ))}
                  </Accordion>
              </AccordionContext.Provider>
            </motion.div>
        </div>
    </div>
  );
}
