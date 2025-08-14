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
    { id: 1, name: 'Roasted Almond', src: '/flavours/almonds.png', hint: 'roasted almond' },
    { id: 2, name: 'Fruit & Nut', src: '/flavours/nuts.png', hint: 'fruit nut chocolate' },
    { id: 3, name: 'Dark Chocolate', src: '/flavours/darkchoco.png', hint: 'dark chocolate' },
    { id: 4, name: 'Hazelnut', src: '/flavours/hazelnut.png', hint: 'hazelnut' },
    { id: 5, name: 'Butter Scotch', src: '/flavours/butterscotch.png', hint: 'butterscotch' },
    { id: 6, name: 'Dates', src: '/flavours/dates.png', hint: 'dates chocolate' },
    { id: 7, name: 'Plain Chocolate', src: '/flavours/plainchoco.png', hint: 'plain chocolate' },
    { id: 8, name: 'Mint', src: '/flavours/mint.png', hint: 'mint chocolate' },
    { id: 9, name: 'Raisins', src: '/flavours/raisins.png', hint: 'raisins chocolate' },
    { id: 10, name: 'Sugar Free', src: '/flavours/sugarfree.png', hint: 'sugar free chocolate' },
    { id: 11, name: 'White Chocolate', src: '/flavours/whitechoco.png', hint: 'white chocolate' },
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
    <div className="bg-[#5D2B79] rounded-[40px] py-4 px-2 h-full flex flex-col relative">
      <SectionTitle className="pl-4 mb-2 text-lg">Flavours & Fillings</SectionTitle>
      
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

      <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar gap-4 flex-grow items-center px-4">
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
