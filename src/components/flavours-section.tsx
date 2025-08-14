// @/components/flavours-section.tsx
'use client';

import { FlavourCard } from './flavour-card';
import { SectionTitle } from './section-title';
import type { Flavour } from './product-popup';

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
  return (
    <div className="bg-white/20 rounded-[40px] p-4 h-full flex flex-col">
      <SectionTitle className="pl-0 mb-2">Flavours & Fillings</SectionTitle>
      <div className="flex overflow-x-auto no-scrollbar gap-3 flex-grow items-center">
        {flavours.map((flavour) => (
          <FlavourCard
            key={flavour.id}
            flavour={flavour}
            onAddToCart={onAddToCart}
            quantity={cart[flavour.id.toString()] || 0}
          />
        ))}
      </div>
    </div>
  );
}
