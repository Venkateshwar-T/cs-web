// @/app/faq/page.tsx
import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { Footer } from '@/components/footer';
import { SectionTitle } from "@/components/section-title";
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

// Define the type for our FAQ items based on the Sanity schema
interface FaqItem {
  _id: string;
  question: string;
  answer: any; // PortableText content
}

// Fetch the data from Sanity
async function getFaqData(): Promise<FaqItem[]> {
  const query = `*[_type == "faq"] | order(_createdAt asc)`;
  const data = await client.fetch(query);
  return data;
}

// The main component for the page
async function FaqContent() {
  const faqs = await getFaqData();

  return (
    <div className="bg-[#5D2B79] rounded-[20px] md:rounded-[40px] mt-8 mb-8 mx-4 md:mx-32 animate-fade-in flex flex-col flex-grow" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
      <div className="bg-white/10 rounded-[20px] md:rounded-[40px] py-8 px-4 md:py-10 md:px-24 flex-grow">
        <SectionTitle className="text-3xl md:text-4xl text-center mb-8 md:mb-12 font-poppins">
          Frequently Asked Questions
        </SectionTitle>
        
        <div className="max-w-4xl mx-auto">
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((item) => (
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

// The page wrapper to handle client components and layout
export default function FaqPage() {
  // A simple way to check for mobile without hooks in a server component context
  // For more complex logic, a client component wrapper would be needed
  const isMobile = false; // Placeholder for now

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className="flex flex-col h-screen">
        <Header
          onProfileOpenChange={() => {}}
          isContentScrolled={isMobile}
          onReset={() => {}}
          onNavigate={() => {}}
          activeView={'faq'}
        />
        <main className={cn(
          "flex-grow flex flex-col overflow-y-auto no-scrollbar transition-all duration-300",
          isMobile ? "pt-24" : "pt-36"
        )}>
          <Suspense fallback={<p className="text-white text-center">Loading FAQs...</p>}>
            <FaqContent />
          </Suspense>
          <Footer />
        </main>
      </div>
    </>
  );
}
