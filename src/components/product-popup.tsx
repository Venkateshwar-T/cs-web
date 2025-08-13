'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import type { Product } from '@/app/page';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

export function ProductPopup({ product, onClose, onAddToCart, cart }: ProductPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const quantity = cart[product.name] || 0;

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

  return (
    <div 
      className="bg-[#9A7DAB] rounded-t-[40px] p-8 text-white h-full overflow-y-auto no-scrollbar"
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
      >
        <X size={24} />
      </button>
      
      <div className="flex flex-col lg:flex-row h-full w-full gap-8">
        <div className="w-full lg:w-1/3 flex flex-col lg:self-center">
          <div>
            <div className="relative w-full aspect-square">
              <Image
                key={images[currentImageIndex].id}
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
                data-ai-hint={images[currentImageIndex].hint}
              />
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
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
          <div className="mt-auto self-center max-w-max -mb-8">
             <div className="bg-custom-purple-dark rounded-t-[40px] px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-xs text-gray-400 line-through">₹1000</p>
                        <p className="text-xs font-semibold text-custom-gold">25% OFF</p>
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
