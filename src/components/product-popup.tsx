'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import type { Product } from '@/app/page';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FlavourCard } from './flavour-card';

interface ProductPopupProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
}

const images = [
  { id: 1, src: '/categories/choco1.png', alt: 'Chocolate Box 1' },
  { id: 2, src: '/categories/choco2.png', alt: 'Chocolate Box 2', hint: 'chocolate box' },
  { id: 3, src: '/categories/choco3.png', alt: 'Chocolate Box 3', hint: 'assorted chocolate' },
  { id: 4, src: '/categories/choco4.png', alt: 'Chocolate Box 4', hint: 'gift box' },
];

export type Flavour = {
  id: number;
  name: string;
  src: string;
  hint: string;
}

const flavours: Flavour[] = [
    { id: 1, name: 'Dark Truffle', src: 'https://placehold.co/200x200.png', hint: 'dark chocolate' },
    { id: 2, name: 'Milk Hazelnut', src: 'https://placehold.co/200x200.png', hint: 'milk chocolate' },
    { id: 3, name: 'White Raspberry', src: 'https://placehold.co/200x200.png', hint: 'white chocolate' },
    { id: 4, name: 'Salted Caramel', src: 'https://placehold.co/200x200.png', hint: 'caramel' },
    { id: 5, name: 'Almond Praline', src: 'https://placehold.co/200x200.png', hint: 'almond praline' },
    { id: 6, name: 'Coffee Cream', src: 'https://placehold.co/200x200.png', hint: 'coffee chocolate' },
];

export function ProductPopup({ product, onClose, onAddToCart, cart }: ProductPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [addedFlavours, setAddedFlavours] = useState<Record<number, number>>({});
  const quantity = cart[product.name] || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.name, quantity - 1);
  };
  
  const handleFlavourAddToCart = (flavourId: number, quantity: number) => {
    setAddedFlavours(prev => {
        const newFlavours = { ...prev, [flavourId]: quantity };
        if (quantity <= 0) {
            delete newFlavours[flavourId];
        }
        return newFlavours;
    });
  };

  return (
    <div 
      className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-hidden"
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      <div className="flex flex-col lg:flex-row h-full w-full gap-8">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="relative w-full aspect-square">
                <Image
                    key={images[currentImageIndex].id}
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                    data-ai-hint={images[currentImageIndex]?.hint}
                />
                <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <div 
                        key={image.id} 
                        className={cn(
                            "relative aspect-square cursor-pointer rounded-md overflow-hidden",
                            index === currentImageIndex ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                        )}
                        onClick={() => handleThumbnailClick(index)}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint={image.hint}
                        />
                    </div>
                ))}
            </div>

            <div className="bg-custom-purple-dark p-4 rounded-[40px]">
                <h3 className="text-white font-bold text-lg mb-3">Flavours &amp; Fillings</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {flavours.map(flavour => (
                        <FlavourCard 
                            key={flavour.id}
                            flavour={flavour}
                            quantity={addedFlavours[flavour.id] || 0}
                            onAddToCart={handleFlavourAddToCart}
                        />
                    ))}
                </div>
            </div>
        </div>

        <div className="hidden lg:block w-px bg-white/30 self-stretch"></div>

        <div className="w-full lg:w-2/3 flex flex-col">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 border border-green-400 flex items-center justify-center p-0.5">
                <svg className="w-3 h-3 text-green-400" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" />
                </svg>
            </div>
            <p className="text-sm text-white/80">250g | Assorted | Hard Box</p>
          </div>
          <div className={cn(
            "mt-auto self-center max-w-max -mb-8 transition-all duration-500 ease-out",
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            )}>
             <div className="bg-custom-purple-dark rounded-t-[40px] px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <p className="text-base text-gray-400 line-through">₹1000</p>
                        <p className="text-sm font-semibold text-custom-gold">25% OFF</p>
                    </div>
                    <p className="text-3xl font-bold">₹750</p>
                </div>
                <div className="flex items-center gap-2">
                    {quantity === 0 ? (
                      <Button 
                        size="lg"
                        onClick={handleAddToCartClick}
                        className="rounded-full font-semibold text-base bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90"
                      >
                          Add to cart
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center rounded-full bg-custom-gold text-custom-purple-dark h-11 px-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleDecrement}
                          className="h-full w-10 rounded-r-none rounded-l-full hover:bg-black/10 text-custom-purple-dark hover:text-custom-purple-dark"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold px-2 text-base">{quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleIncrement}
                          className="h-full w-10 rounded-l-none rounded-r-full hover:bg-black/10 text-custom-purple-dark hover:text-custom-purple-dark"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button size="lg" className="rounded-full font-semibold text-base bg-white text-custom-purple-dark hover:bg-gray-200">
                        Buy Now
                    </Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
