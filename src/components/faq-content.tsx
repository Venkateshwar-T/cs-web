
// @/components/faq-content.tsx
import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle } from "@/components/section-title";

// Define the type for our FAQ items based on the Sanity schema
interface FaqItem {
  _id: string;
  question: string;
  answer: any; // PortableText content can be complex
}

const staticFaqs: Omit<FaqItem, '_id'>[] = [
    {
        question: "What makes your chocolates special?",
        answer: [{ _key: "1", _type: "block", style: "normal", children: [{ _key: "1a", _type: "span", text: "Our chocolates are handcrafted with love, using only the finest 100% vegetarian and eggless ingredients. We focus on creating a premium, guilt-free indulgence for everyone to enjoy." }] }]
    },
    {
        question: "Can I customize my chocolate box?",
        answer: [{ _key: "2", _type: "block", style: "normal", children: [{ _key: "2a", _type: "span", text: "Absolutely! We specialize in personalization. You can hand-pick your favorite flavors and fillings to create a unique gift box that's perfect for any occasion." }] }]
    },
    {
        question: "How long does delivery take?",
        answer: [{ _key: "3", _type: "block", style: "normal", children: [{ _key: "3a", _type: "span", text: "Delivery times vary based on your location. Typically, local orders are delivered within 1-2 business days, while national orders may take 3-5 business days. We'll provide a tracking number once your order is shipped." }] }]
    },
    {
        question: "What are your shipping and delivery policies?",
        answer: [{ _key: "4", _type: "block", style: "normal", children: [{ _key: "4a", _type: "span", text: "We take great care in packaging our chocolates to ensure they arrive in perfect condition. For more detailed information, please visit our Shipping & Delivery page." }] }]
    },
];

// Fetch the data from Sanity - This remains a server-side function
async function getFaqData(): Promise<FaqItem[]> {
  const query = `*[_type == "faq"] | order(_createdAt asc)`;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Failed to fetch FAQ data:", error);
    return []; // Return an empty array on error
  }
}

// This is now a dedicated Server Component for fetching and rendering the content.
export async function FaqContent() {
  const sanityFaqs = await getFaqData();

  // Add a unique _id to static FAQs for the key prop
  const allFaqs = [
      ...staticFaqs.map((faq, index) => ({ ...faq, _id: `static-${index}` })),
      ...sanityFaqs
  ];


  return (
    <div className="bg-[#5D2B79] rounded-[20px] md:rounded-[40px] mt-8 mb-8 mx-4 md:mx-32 animate-fade-in flex flex-col flex-grow" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
      <div className="bg-white/10 rounded-[20px] md:rounded-[40px] py-8 px-4 md:py-10 md:px-24 flex-grow">
        <SectionTitle className="text-3xl md:text-4xl text-center mb-8 md:mb-12 font-poppins">
          Frequently Asked Questions
        </SectionTitle>
        
        <div className="max-w-4xl mx-auto">
          {allFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {allFaqs.map((item) => (
                <AccordionItem key={item._id} value={item._id} className="bg-black/20 rounded-2xl px-4 md:px-6 border-b-0">
                  <AccordionTrigger className="text-left text-base md:text-xl font-bold text-white hover:no-underline data-[state=open]:text-custom-gold hover:text-custom-gold transition-colors duration-300 py-4 md:py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4 md:pb-5 text-white/80 text-sm md:text-base leading-relaxed">
                    <PortableText value={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-white/80">No frequently asked questions have been added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
