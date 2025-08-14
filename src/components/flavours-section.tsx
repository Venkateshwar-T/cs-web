'use client';

import { useRef, useState, useEffect } from 'react';
import { FlavourCard } from './flavour-card';
import { SectionTitle } from './section-title';
import type { Flavour } from './product-popup';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FlavoursSectionProps {
  onAddToCart: (flavourId: number, quantity: number) => void;
  cart: Record<string, number>;
}

const flavours: Flavour[] = [
    { id: 1, name: 'Dark Chocolate Truffle', src: 'https://placehold.co/200x200.png', hint: 'dark chocolate' },
    { id: 2, name: 'Milk Chocolate Caramel', src: 'https://placehold.co/200x200.png', hint: 'milk chocolate' },
    { id: 3, name: 'White Chocolate Berry', src: 'https://placehold.co/200x200.png', hint: 'white chocolate' },
    { id: 4, name: 'Hazelnut Praline', src: 'https://placehold.co/200x200.png', hint: 'hazelnut' },
    { id: 5, name: 'Sea Salt & Almond', src: 'https://placehold.co/200x200.png', hint: 'almond' },
    { id: 6, name: 'Coconut Cream', src: 'https://placehold.co/200x200.png', hint: 'coconut' },
];

export function FlavoursSection({ onAddToCart, cart }: FlavoursSectionProps) {
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
  }, []);

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
    <div className="bg-white/20 rounded-[40px] h-full flex flex-col relative py-4">
      <SectionTitle className="pl-4 mb-2 text-lg pt-2">Flavours & Fillings</SectionTitle>
      
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

      <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar gap-3 flex-grow items-center px-4">
        {flavours.map((flavour) => (
          <FlavourCard
            key={flavour.id}
            flavour={flavour}
            onAddToCart={onAddToCart}
            quantity={cart[flavour.id.toString()] || 0}
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
