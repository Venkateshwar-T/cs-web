'use client';

import { useRef, useState, useEffect } from 'react';
import { FlavourCard } from './flavour-card';
import { SectionTitle } from './section-title';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { SanityFlavour } from '@/types';

interface FlavoursSectionProps {
  onAddToCart: (flavourId: string, quantity: number) => void;
  cart: Record<string, number>;
  isMobile?: boolean;
  availableFlavours: SanityFlavour[];
}

export function FlavoursSection({ onAddToCart, cart, isMobile = false, availableFlavours }: FlavoursSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollability = () => {
      // A small tolerance is added to prevent floating point inaccuracies
      setCanScrollLeft(container.scrollLeft > 1);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
    };

    checkScrollability();
    container.addEventListener('scroll', checkScrollability);
    
    // Check again on resize
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      resizeObserver.unobserve(container);
    };
  }, [availableFlavours]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // Scroll by 80% of the container width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn(
        "relative flex flex-col animate-fade-in",
        isMobile ? "bg-white/10 rounded-[15px] p-4" : "bg-[#5D2B79] md:rounded-[15px] lg:rounded-[40px] py-5 px-4 md:h-[85%] lg:h-full"
      )} 
      style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
      <SectionTitle className={cn(isMobile ? "text-sm mb-3 p-0 flex justify-center" :"text-sm md:text-m lg:text-xl md:pl-0 lg:pl-4 mb-2 pt-0 font-poppins")}>Flavours & Fillings</SectionTitle>
      
      {canScrollLeft && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar gap-4 flex-grow items-center md:px-0 lg:px-4">
        {availableFlavours.map((flavour) => (
          <FlavourCard
            key={flavour._id}
            flavour={flavour}
            onAddToCart={onAddToCart}
            quantity={cart[flavour._id] || 0}
          />
        ))}
      </div>

      {canScrollRight && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
