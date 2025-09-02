// @/components/faq-view.tsx

import { SectionTitle } from "./section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react";

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
    {
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within India."
    },
    {
        question: "Can I order a mix of flavors in one box?",
        answer: "Yes, absolutely! We specialize in creating personalized assortments. You can select a variety of flavors and fillings to create a box that is perfectly tailored to your taste."
    },
    {
        question: "Why do some flavors cost extra?",
        answer: "Certain specialty flavors, such as those with premium nuts or unique ingredients, require an additional charge to cover the cost of sourcing. This cost is clearly shown on the product page before you add the item to your cart."
    }
];

export function FaqView() {
  return (
    <div className="bg-[#5D2B79] rounded-[40px] mx-8 md:mx-32 animate-fade-in h-[85vh] flex flex-col" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="bg-white/20 rounded-[40px] py-10 px-12 md:px-24 flex-grow overflow-y-auto no-scrollbar">
            <SectionTitle className="text-4xl text-center mb-12 font-poppins">
                Frequently Asked Questions
            </SectionTitle>
            
            <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqData.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-black/20 rounded-2xl px-6 border-b-0">
                            <AccordionTrigger className="text-left text-lg font-semibold text-custom-gold hover:no-underline py-4">
                                {item.question}
                                <ChevronDown className="h-6 w-6 shrink-0 stroke-custom-gold transition-transform duration-200" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 text-white/90 text-base leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    </div>
  );
}